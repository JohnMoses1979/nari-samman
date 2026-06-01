    

package com.example.nari.service;

import com.example.nari.dto.AdminKycReviewResponse;
import com.example.nari.dto.KycSubmitResponse;
import com.example.nari.entity.Vendor;
import com.example.nari.entity.VendorKycDocument;
import com.example.nari.repository.VendorKycDocumentRepository;
import com.example.nari.repository.VendorRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VendorKycService {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    // ── Directory where KYC uploads are stored ────────────────────────────────
    // Set kyc.upload.dir=uploads/kyc in application.properties
    // In production, point this to a path OUTSIDE the web root (e.g. /var/data/kyc)
    @Value("${kyc.upload.dir:uploads/kyc}")
    private String uploadDir;

    // ── Base URL used to build download links served by FileServeController ──
    // e.g. http://192.168.1.42:8080
    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    private final VendorKycDocumentRepository kycRepo;
    private final VendorRepository vendorRepo;

    public VendorKycService(VendorKycDocumentRepository kycRepo, VendorRepository vendorRepo) {
        this.kycRepo    = kycRepo;
        this.vendorRepo = vendorRepo;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VENDOR: Submit / update KYC documents
    // ─────────────────────────────────────────────────────────────────────────

    public KycSubmitResponse submitKyc(
            Long vendorId,
            MultipartFile identityProof,
            MultipartFile shgCertificate,
            MultipartFile addressProof,
            MultipartFile panRegistration,
            String vendorNote) throws IOException {

        Vendor vendor = findVendor(vendorId);

        // Fetch existing KYC record or create a new one
        VendorKycDocument kyc = kycRepo.findByVendorId(vendorId)
                .orElseGet(() -> {
                    VendorKycDocument doc = new VendorKycDocument();
                    doc.setVendor(vendor);
                    return doc;
                });

        // Always reset to PENDING on re-submission
        kyc.setKycStatus("PENDING");
        kyc.setVendorNote(vendorNote);
        kyc.setAdminNote(null);   // clear previous rejection note
        kyc.setReviewedBy(null);
        kyc.setReviewedAt(null);

        // ── Save uploaded files ───────────────────────────────────────────────
        Path vendorDir = resolveUploadRoot().resolve(String.valueOf(vendorId));
        Files.createDirectories(vendorDir);

        if (identityProof != null && !identityProof.isEmpty()) {
            String path = saveFile(vendorDir, "identity", identityProof);
            kyc.setIdentityProofPath(path);
        }
        if (shgCertificate != null && !shgCertificate.isEmpty()) {
            String path = saveFile(vendorDir, "shg_cert", shgCertificate);
            kyc.setShgCertificatePath(path);
        }
        if (addressProof != null && !addressProof.isEmpty()) {
            String path = saveFile(vendorDir, "address", addressProof);
            kyc.setAddressProofPath(path);
        }
        if (panRegistration != null && !panRegistration.isEmpty()) {
            String path = saveFile(vendorDir, "pan", panRegistration);
            kyc.setPanRegistrationPath(path);
        }

        // ── Update vendor's kycStatus field too ──────────────────────────────
        vendor.setApprovalStatus("pending"); // keep vendor pending until admin approves
        vendorRepo.save(vendor);

        VendorKycDocument saved = kycRepo.save(kyc);
        return toSubmitResponse(saved);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // VENDOR: Get own KYC status
    // ─────────────────────────────────────────────────────────────────────────

    public KycSubmitResponse getVendorKycStatus(Long vendorId) {
        findVendor(vendorId); // validates ownership
        VendorKycDocument kyc = kycRepo.findByVendorId(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("No KYC submission found for this vendor"));
        return toSubmitResponse(kyc);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: List all KYC submissions (optionally filtered by status)
    // ─────────────────────────────────────────────────────────────────────────

    public List<AdminKycReviewResponse> getAllKycSubmissions(String status) {
        List<VendorKycDocument> docs = (status != null && !status.isBlank())
                ? kycRepo.findByKycStatusWithVendor(status.toUpperCase())
                : kycRepo.findAllWithVendor();
        return docs.stream().map(this::toAdminResponse).collect(Collectors.toList());
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: Get single vendor's KYC detail
    // ─────────────────────────────────────────────────────────────────────────

    public AdminKycReviewResponse getVendorKycDetail(Long vendorId) {
        VendorKycDocument kyc = kycRepo.findByVendorId(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("No KYC submission found for vendor " + vendorId));
        return toAdminResponse(kyc);
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: Approve KYC
    // ─────────────────────────────────────────────────────────────────────────

    public AdminKycReviewResponse approveKyc(Long vendorId, String adminNote, String reviewedBy) {
        VendorKycDocument kyc = findKyc(vendorId);

        kyc.setKycStatus("APPROVED");
        kyc.setAdminNote(adminNote);
        kyc.setReviewedBy(reviewedBy);
        kyc.setReviewedAt(LocalDateTime.now());

        // ── Mirror status onto Vendor entity ─────────────────────────────────
        Vendor vendor = kyc.getVendor();
        vendor.setApprovalStatus("approved");
        vendorRepo.save(vendor);

        return toAdminResponse(kycRepo.save(kyc));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // ADMIN: Reject KYC
    // ─────────────────────────────────────────────────────────────────────────

    public AdminKycReviewResponse rejectKyc(Long vendorId, String adminNote, String reviewedBy) {
        if (adminNote == null || adminNote.isBlank()) {
            throw new IllegalArgumentException("Rejection reason (adminNote) is required");
        }
        VendorKycDocument kyc = findKyc(vendorId);

        kyc.setKycStatus("REJECTED");
        kyc.setAdminNote(adminNote);
        kyc.setReviewedBy(reviewedBy);
        kyc.setReviewedAt(LocalDateTime.now());

        // ── Mirror status onto Vendor entity ─────────────────────────────────
        Vendor vendor = kyc.getVendor();
        vendor.setApprovalStatus("rejected");
        vendorRepo.save(vendor);

        return toAdminResponse(kycRepo.save(kyc));
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Internal helpers
    // ─────────────────────────────────────────────────────────────────────────

    private Vendor findVendor(Long vendorId) {
        return vendorRepo.findById(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found: " + vendorId));
    }

    private VendorKycDocument findKyc(Long vendorId) {
        return kycRepo.findByVendorId(vendorId)
                .orElseThrow(() -> new IllegalArgumentException("No KYC submission found for vendor " + vendorId));
    }

    /**
     * Saves an uploaded file under vendorDir/<type>_<uuid>.<ext>
     * Returns the relative path stored in DB (e.g. "uploads/kyc/42/identity_abc123.jpg").
     */
    private String saveFile(Path vendorDir, String type, MultipartFile file) throws IOException {
        String originalName  = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String extension     = originalName.contains(".")
                ? originalName.substring(originalName.lastIndexOf('.'))
                : ".jpg";
        String filename      = type + "_" + UUID.randomUUID().toString().replace("-", "").substring(0, 8) + extension;
        Path destination = vendorDir.resolve(filename).normalize();

        Files.createDirectories(destination.getParent());

        // Avoid MultipartFile.transferTo() quirks on some platforms/temp dirs; use stream copy.
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, destination, StandardCopyOption.REPLACE_EXISTING);
        }

        // Store a stable relative path rooted at uploadDir (e.g. "1/identity_abcd1234.jpg")
        Path root = resolveUploadRoot();
        return root.relativize(destination).toString().replace("\\", "/");
    }

    /** Builds a secure download URL served by FileServeController */
    private String buildUrl(String filePath) {
        if (filePath == null || filePath.isBlank()) return null;
        String relative = filePath.replace("\\", "/");

        // Backward compatibility: older records stored absolute/expanded paths like
        // ".../uploads/kyc/{vendorId}/{file}". Convert them to "{vendorId}/{file}".
        String root = resolveUploadRoot().toString().replace("\\", "/");
        if (relative.startsWith(root)) {
            relative = relative.substring(root.length());
            if (relative.startsWith("/")) relative = relative.substring(1);
        }
        return baseUrl + "/api/kyc-files/" + relative;
    }

    private Path resolveUploadRoot() {
        Path raw = Paths.get(uploadDir);
        if (raw.isAbsolute()) {
            return raw.normalize();
        }
        // If a relative path is configured, resolve from the process working directory.
        // Example when running from the backend project root:
        //   "uploads/kyc" -> "<project>/uploads/kyc"
        return Paths.get(System.getProperty("user.dir"), raw.toString())
                .toAbsolutePath()
                .normalize();
    }

    private String fmt(LocalDateTime dt) {
        return dt != null ? dt.format(FMT) : null;
    }

    private KycSubmitResponse toSubmitResponse(VendorKycDocument kyc) {
        KycSubmitResponse r = new KycSubmitResponse();
        r.setKycId(kyc.getId());
        r.setVendorId(kyc.getVendor().getId());
        r.setKycStatus(kyc.getKycStatus());
        r.setIdentityProofUrl(buildUrl(kyc.getIdentityProofPath()));
        r.setShgCertificateUrl(buildUrl(kyc.getShgCertificatePath()));
        r.setAddressProofUrl(buildUrl(kyc.getAddressProofPath()));
        r.setPanRegistrationUrl(buildUrl(kyc.getPanRegistrationPath()));
        r.setVendorNote(kyc.getVendorNote());
        r.setSubmittedAt(fmt(kyc.getSubmittedAt()));
        r.setUpdatedAt(fmt(kyc.getUpdatedAt()));
        return r;
    }

    private AdminKycReviewResponse toAdminResponse(VendorKycDocument kyc) {
        Vendor v = kyc.getVendor();
        AdminKycReviewResponse r = new AdminKycReviewResponse();

        // Vendor info
        r.setVendorId(v.getId());
        r.setVendorName(v.getLeaderName());
        r.setShgName(v.getShgName());
        r.setEmail(v.getEmail());
        r.setPhone(v.getMobileNumber());
        r.setLocation(v.getVillage());
        r.setCategory(v.getCategory());
        r.setApprovalStatus(v.getApprovalStatus());

        // KYC info
        r.setKycId(kyc.getId());
        r.setKycStatus(kyc.getKycStatus());
        r.setIdentityProofUrl(buildUrl(kyc.getIdentityProofPath()));
        r.setShgCertificateUrl(buildUrl(kyc.getShgCertificatePath()));
        r.setAddressProofUrl(buildUrl(kyc.getAddressProofPath()));
        r.setPanRegistrationUrl(buildUrl(kyc.getPanRegistrationPath()));
        r.setVendorNote(kyc.getVendorNote());
        r.setAdminNote(kyc.getAdminNote());
        r.setReviewedBy(kyc.getReviewedBy());
        r.setReviewedAt(fmt(kyc.getReviewedAt()));
        r.setSubmittedAt(fmt(kyc.getSubmittedAt()));
        r.setUpdatedAt(fmt(kyc.getUpdatedAt()));

        return r;
    }
}
