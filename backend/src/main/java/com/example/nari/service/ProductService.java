package com.example.nari.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.nari.dto.ProductCreateRequest;
import com.example.nari.dto.ProductResponse;
import com.example.nari.entity.Product;
import com.example.nari.entity.ProductImage;
import com.example.nari.entity.Vendor;
import com.example.nari.repository.ProductImageRepository;
import com.example.nari.repository.ProductRepository;
import com.example.nari.repository.VendorRepository;

@Service
public class ProductService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final Set<String> ALLOWED_TYPES = Set.of(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024L; // 5 MB
    private static final List<String> VALID_CATEGORIES = List.of("food", "textiles", "crafts");
    private static final List<String> VALID_STATUSES = List.of("PENDING", "APPROVED", "REJECTED", "DISABLED");

    @Value("${product.upload.dir:uploads/products}")
    private String uploadDir;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    private final ProductRepository productRepo;
    private final ProductImageRepository imageRepo;
    private final VendorRepository vendorRepo;

    public ProductService(ProductRepository productRepo,
            ProductImageRepository imageRepo,
            VendorRepository vendorRepo) {
        this.productRepo = productRepo;
        this.imageRepo = imageRepo;
        this.vendorRepo = vendorRepo;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VENDOR: Create product
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public ProductResponse createProduct(Long vendorId,
            ProductCreateRequest req,
            List<MultipartFile> images) throws IOException {
        Vendor vendor = findVendor(vendorId);
        validateCreateRequest(req, images);

        Product product = new Product();
        product.setVendor(vendor);
        mapRequestToProduct(req, product);
        product.setStatus("PENDING");

        Product saved = productRepo.save(product);
        saveImages(saved, images);
        // reload with images
        return toResponse(productRepo.findById(saved.getId()).orElse(saved));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VENDOR: Update own product (re-submits for approval if was APPROVED/REJECTED)
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public ProductResponse updateProduct(Long vendorId,
            Long productId,
            ProductCreateRequest req,
            List<MultipartFile> newImages,
            List<Long> deleteImageIds) throws IOException {
        Product product = findOwnProduct(vendorId, productId);
        validateUpdateRequest(req);

        mapRequestToProduct(req, product);

        // Re-queue for approval if it was previously approved or rejected
        if ("APPROVED".equals(product.getStatus()) || "REJECTED".equals(product.getStatus())) {
            product.setStatus("PENDING");
            product.setRejectionReason(null);
            product.setReviewedBy(null);
            product.setReviewedAt(null);
        }

        // Delete specific images requested by vendor
        if (deleteImageIds != null && !deleteImageIds.isEmpty()) {
            for (Long imgId : deleteImageIds) {
                imageRepo.findById(imgId).ifPresent(img -> {
                    if (img.getProduct().getId().equals(productId)) {
                        deleteFile(img.getFilePath());
                        imageRepo.delete(img);
                    }
                });
            }
        }

        // Add new images
        if (newImages != null && !newImages.isEmpty()) {
            validateImages(newImages);
            saveImages(product, newImages);
        }

        // Ensure at least one image remains
        long remaining = imageRepo.findByProductIdOrderBySortOrderAsc(productId).size();
        if (remaining == 0) {
            throw new IllegalArgumentException("Product must have at least one image.");
        }

        productRepo.save(product);
        return toResponse(productRepo.findById(productId).orElse(product));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VENDOR: Delete own product (only PENDING or REJECTED allowed)
    // ─────────────────────────────────────────────────────────────────────────
    @Transactional
    public void deleteProduct(Long vendorId, Long productId) {
        Product product = findOwnProduct(vendorId, productId);
        if ("APPROVED".equals(product.getStatus())) {
            // Soft-disable instead of hard delete for APPROVED products
            product.setStatus("DISABLED");
            productRepo.save(product);
            return;
        }
        // Hard delete for PENDING/REJECTED/DISABLED
        for (ProductImage img : product.getImages()) {
            deleteFile(img.getFilePath());
        }
        productRepo.delete(product);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VENDOR: List own products
    // ─────────────────────────────────────────────────────────────────────────
    public List<ProductResponse> getVendorProducts(Long vendorId) {
        findVendor(vendorId); // validate existence
        return productRepo.findByVendorId(vendorId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // CONSUMER: Approved products
    // ─────────────────────────────────────────────────────────────────────────
    public List<ProductResponse> getApprovedProducts(String category) {
        List<Product> products = (category != null && !category.isBlank() && !"all".equalsIgnoreCase(category))
                ? productRepo.findApprovedByCategory(category.toLowerCase())
                : productRepo.findAllApproved();
        return products.stream().map(this::toResponse).collect(Collectors.toList());
    }

    public ProductResponse getProductDetail(Long productId) {
        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        if (!"APPROVED".equals(p.getStatus())) {
            throw new IllegalArgumentException("Product not available.");
        }
        return toResponse(p);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: Review
    // ─────────────────────────────────────────────────────────────────────────
    public List<ProductResponse> adminGetProducts(String status) {
        List<Product> products = (status != null && !status.isBlank())
                ? productRepo.findByStatus(status.toUpperCase())
                : productRepo.findAllWithVendor();
        return products.stream().map(this::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public ProductResponse adminApproveProduct(Long productId, String reviewedBy, String badge) {
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        product.setStatus("APPROVED");
        product.setRejectionReason(null);
        product.setReviewedBy(reviewedBy);
        product.setReviewedAt(java.time.LocalDateTime.now());
        if (badge != null && !badge.isBlank()) {
            product.setBadge(badge);
        }
        return toResponse(productRepo.save(product));
    }

    @Transactional
    public ProductResponse adminRejectProduct(Long productId, String reason, String reviewedBy) {
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Rejection reason is required.");
        }
        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        product.setStatus("REJECTED");
        product.setRejectionReason(reason);
        product.setReviewedBy(reviewedBy);
        product.setReviewedAt(java.time.LocalDateTime.now());
        return toResponse(productRepo.save(product));
    }

    public long countPendingProducts() {
        return productRepo.countByStatus("PENDING");
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────────────
    private void mapRequestToProduct(ProductCreateRequest req, Product product) {
        product.setName(req.getName().trim());
        product.setCategory(req.getCategory().trim().toLowerCase());
        product.setSellingPrice(req.getSellingPrice());
        product.setMrp(req.getMrp() != null ? req.getMrp() : req.getSellingPrice());
        product.setUnit(req.getUnit() != null ? req.getUnit().trim() : "piece");
        product.setDescription(req.getDescription().trim());
        product.setStock(req.getStock() != null ? req.getStock() : 0);
        product.setTags(req.getTags() != null ? req.getTags().trim() : "");
        product.setCertifications(req.getCertifications() != null ? req.getCertifications().trim() : "");
    }

    private void saveImages(Product product, List<MultipartFile> files) throws IOException {
        Path vendorDir = resolveUploadRoot().resolve(String.valueOf(product.getVendor().getId()));
        Files.createDirectories(vendorDir);

        List<ProductImage> existing = imageRepo.findByProductIdOrderBySortOrderAsc(product.getId());
        int nextOrder = existing.isEmpty() ? 0 : existing.get(existing.size() - 1).getSortOrder() + 1;

        for (MultipartFile file : files) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            String ext = getExtension(Objects.requireNonNull(file.getOriginalFilename(), "file"));
            String filename = "img_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8) + ext;
            Path dest = vendorDir.resolve(filename).normalize();

            try (InputStream in = file.getInputStream()) {
                Files.copy(in, dest, StandardCopyOption.REPLACE_EXISTING);
            }

            // Store path relative to uploadDir root: "{vendorId}/{filename}"
            String relativePath = product.getVendor().getId() + "/" + filename;

            ProductImage img = new ProductImage();
            img.setProduct(product);
            img.setFilePath(relativePath);
            img.setSortOrder(nextOrder++);
            imageRepo.save(img);
        }
    }

    private void validateCreateRequest(ProductCreateRequest req, List<MultipartFile> images) {
        validateUpdateRequest(req);
        if (images == null || images.stream().allMatch(f -> f == null || f.isEmpty())) {
            throw new IllegalArgumentException("At least one product image is required.");
        }
        validateImages(images);
    }

    private void validateUpdateRequest(ProductCreateRequest req) {
        if (req.getName() == null || req.getName().isBlank()) {
            throw new IllegalArgumentException("Product name is required.");
        }
        if (req.getDescription() == null || req.getDescription().isBlank()) {
            throw new IllegalArgumentException("Product description is required.");
        }
        if (req.getSellingPrice() == null || req.getSellingPrice() <= 0) {
            throw new IllegalArgumentException("Selling price must be greater than 0.");
        }
        if (req.getMrp() != null && req.getMrp() < req.getSellingPrice()) {
            throw new IllegalArgumentException("MRP must be greater than or equal to selling price.");
        }
        if (req.getStock() != null && req.getStock() < 0) {
            throw new IllegalArgumentException("Stock cannot be negative.");
        }
        if (req.getCategory() == null || !VALID_CATEGORIES.contains(req.getCategory().toLowerCase())) {
            throw new IllegalArgumentException("Category must be one of: food, textiles, crafts.");
        }
    }

    private void validateImages(List<MultipartFile> images) {
        for (MultipartFile file : images) {
            if (file == null || file.isEmpty()) {
                continue;
            }
            String ct = file.getContentType();
            if (ct == null || !ALLOWED_TYPES.contains(ct.toLowerCase())) {
                throw new IllegalArgumentException("Only JPG, PNG, and WebP images are allowed.");
            }
            if (file.getSize() > MAX_FILE_SIZE) {
                throw new IllegalArgumentException("Each image must be under 5 MB.");
            }
        }
    }

    private Vendor findVendor(Long vendorId) {
        return vendorRepo.findById(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found: " + vendorId));
    }

    private Product findOwnProduct(Long vendorId, Long productId) {
        Product p = productRepo.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found: " + productId));
        if (!p.getVendor().getId().equals(vendorId)) {
            throw new SecurityException("Access denied — not your product.");
        }
        return p;
    }

    private String buildUrl(String filePath) {
        if (filePath == null || filePath.isBlank()) {
            return null;
        }
        // Return a relative path — frontend will prepend its own BASE_URL.
        // This works on web, Android, iOS, and production without any hardcoding.
        return "/api/product-images/" + filePath.replace("\\", "/");
    }

    private void deleteFile(String relativePath) {
        if (relativePath == null) {
            return;
        }
        try {
            Files.deleteIfExists(resolveUploadRoot().resolve(relativePath));
        } catch (IOException ignored) {
        }
    }

    private Path resolveUploadRoot() {
        Path raw = Paths.get(uploadDir);
        if (raw.isAbsolute()) {
            return raw.normalize();
        }
        return Paths.get(System.getProperty("user.dir"), raw.toString()).toAbsolutePath().normalize();
    }

    private String getExtension(String filename) {
        int dot = filename.lastIndexOf('.');
        return dot >= 0 ? filename.substring(dot).toLowerCase() : ".jpg";
    }

    public ProductResponse toResponse(Product p) {
        ProductResponse r = new ProductResponse();
        r.setId(p.getId());
        r.setVendorId(p.getVendor().getId());
        r.setVendorName(p.getVendor().getLeaderName());
        r.setShgName(p.getVendor().getShgName());
        r.setName(p.getName());
        r.setCategory(p.getCategory());
        r.setSellingPrice(p.getSellingPrice());
        r.setMrp(p.getMrp());
        r.setUnit(p.getUnit());
        r.setDescription(p.getDescription());
        r.setStock(p.getStock());
        r.setStatus(p.getStatus());
        r.setRejectionReason(p.getRejectionReason());
        r.setRating(p.getRating());
        r.setReviewCount(p.getReviewCount());
        r.setBadge(p.getBadge());
        r.setCreatedAt(p.getCreatedAt() != null ? p.getCreatedAt().format(FMT) : null);
        r.setUpdatedAt(p.getUpdatedAt() != null ? p.getUpdatedAt().format(FMT) : null);

        // Tags
        r.setTags(p.getTags() != null && !p.getTags().isBlank()
                ? Arrays.stream(p.getTags().split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList())
                : new ArrayList<>());

        // Certifications
        r.setCertifications(p.getCertifications() != null && !p.getCertifications().isBlank()
                ? Arrays.stream(p.getCertifications().split(",")).map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList())
                : new ArrayList<>());

        // Images
        List<String> urls = p.getImages().stream()
                .sorted(Comparator.comparingInt(i -> i.getSortOrder() != null ? i.getSortOrder() : 0))
                .map(img -> buildUrl(img.getFilePath()))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
        r.setImageUrls(urls);
        r.setPrimaryImageUrl(urls.isEmpty() ? null : urls.get(0));

        return r;
    }
}
