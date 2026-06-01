// package com.example.nari.controller;
// import com.example.nari.dto.ProductCreateRequest;
// import com.example.nari.dto.ProductResponse;
// import com.example.nari.service.ProductService;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;
// import java.util.List;
// import java.util.Map;
// /**
//  * Vendor-facing product endpoints (JWT protected).
//  *
//  * POST /api/vendors/{vendorId}/products — create product (multipart) GET
//  * /api/vendors/{vendorId}/products — list own products PUT
//  * /api/vendors/{vendorId}/products/{productId} — update product (multipart)
//  * DELETE /api/vendors/{vendorId}/products/{productId} — delete product
//  */
// @RestController
// @RequestMapping("/api/vendors")
// @CrossOrigin(origins = "*")
// public class ProductController {
//     private final ProductService productService;
//     public ProductController(ProductService productService) {
//         this.productService = productService;
//     }
//     /**
//      * POST /api/vendors/{vendorId}/products
//      */
//     @PostMapping(value = "/{vendorId}/products", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//     public ResponseEntity<?> createProduct(
//             @PathVariable Long vendorId,
//             @RequestPart("data") String dataJson,
//             @RequestPart(value = "images", required = false) List<MultipartFile> images,
//             Authentication auth) {
//         if (!isOwner(auth, vendorId)) {
//             return forbidden();
//         }
//         try {
//             ProductCreateRequest req = parseJson(dataJson, ProductCreateRequest.class);
//             ProductResponse response = productService.createProduct(vendorId, req, images);
//             return ResponseEntity.ok(Map.of("success", true, "product", response,
//                     "message", "Product submitted for approval."));
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Failed to create product: " + e.getMessage()));
//         }
//     }
//     /**
//      * GET /api/vendors/{vendorId}/products
//      */
//     @GetMapping("/{vendorId}/products")
//     public ResponseEntity<?> getVendorProducts(@PathVariable Long vendorId, Authentication auth) {
//         if (!isOwner(auth, vendorId)) {
//             return forbidden();
//         }
//         try {
//             List<ProductResponse> products = productService.getVendorProducts(vendorId);
//             return ResponseEntity.ok(Map.of("success", true, "products", products));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError().body(Map.of("success", false, "message", e.getMessage()));
//         }
//     }
//     /**
//      * PUT /api/vendors/{vendorId}/products/{productId}
//      */
//     @PutMapping(value = "/{vendorId}/products/{productId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//     public ResponseEntity<?> updateProduct(
//             @PathVariable Long vendorId,
//             @PathVariable Long productId,
//             @RequestPart("data") String dataJson,
//             @RequestPart(value = "images", required = false) List<MultipartFile> newImages,
//             @RequestParam(value = "deleteImageIds", required = false) List<Long> deleteImageIds,
//             Authentication auth) {
//         if (!isOwner(auth, vendorId)) {
//             return forbidden();
//         }
//         try {
//             ProductCreateRequest req = parseJson(dataJson, ProductCreateRequest.class);
//             ProductResponse response = productService.updateProduct(vendorId, productId, req, newImages, deleteImageIds);
//             return ResponseEntity.ok(Map.of("success", true, "product", response,
//                     "message", "Product updated and re-submitted for approval."));
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
//         } catch (SecurityException e) {
//             return ResponseEntity.status(403).body(Map.of("success", false, "message", e.getMessage()));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Failed to update product: " + e.getMessage()));
//         }
//     }
//     /**
//      * DELETE /api/vendors/{vendorId}/products/{productId}
//      */
//     @DeleteMapping("/{vendorId}/products/{productId}")
//     public ResponseEntity<?> deleteProduct(
//             @PathVariable Long vendorId,
//             @PathVariable Long productId,
//             Authentication auth) {
//         if (!isOwner(auth, vendorId)) {
//             return forbidden();
//         }
//         try {
//             productService.deleteProduct(vendorId, productId);
//             return ResponseEntity.ok(Map.of("success", true, "message", "Product removed successfully."));
//         } catch (SecurityException e) {
//             return ResponseEntity.status(403).body(Map.of("success", false, "message", e.getMessage()));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Failed to delete product: " + e.getMessage()));
//         }
//     }
//     // ─── Helpers ─────────────────────────────────────────────────────────────
//     private boolean isOwner(Authentication auth, Long requestedId) {
//         if (auth == null || auth.getPrincipal() == null) {
//             return false;
//         }
//         return ((Long) auth.getPrincipal()).equals(requestedId);
//     }
//     private ResponseEntity<?> forbidden() {
//         return ResponseEntity.status(403).body(Map.of("success", false, "message", "Access denied"));
//     }
//     private <T> T parseJson(String json, Class<T> clazz) {
//         try {
//             com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
//             return mapper.readValue(json, clazz);
//         } catch (Exception e) {
//             throw new IllegalArgumentException("Invalid request data: " + e.getMessage());
//         }
//     }
// }






package com.example.nari.controller;

import com.example.nari.dto.ProductCreateRequest;
import com.example.nari.dto.ProductResponse;
import com.example.nari.service.ProductService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

/**
 * Vendor-facing product endpoints (JWT protected).
 *
 * POST /api/vendors/{vendorId}/products — create product (multipart) GET
 * /api/vendors/{vendorId}/products — list own products PUT
 * /api/vendors/{vendorId}/products/{productId} — update product (multipart)
 * DELETE /api/vendors/{vendorId}/products/{productId} — delete product
 */
@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;
    private final ObjectMapper objectMapper;

    public ProductController(ProductService productService, ObjectMapper objectMapper) {
        this.productService = productService;
        this.objectMapper = objectMapper;
    }

    /**
     * POST /api/vendors/{vendorId}/products
     *
     * Accepts multipart/form-data: - "data" : JSON string of
     * ProductCreateRequest fields - "images" : one or more image files
     * (jpg/png/webp, max 5 MB each)
     *
     * Using @RequestParam for "data" instead of @RequestPart because React
     * Native FormData sends text parts without a Content-Type, which breaks
     * @RequestPart.
     */
    @PostMapping(value = "/{vendorId}/products", consumes = "multipart/form-data")
    public ResponseEntity<?> createProduct(
            @PathVariable Long vendorId,
            @RequestParam("data") String dataJson,
            @RequestParam(value = "images", required = false) List<MultipartFile> images,
            Authentication auth) {

        if (!isVendorOwner(auth, vendorId)) {
            return forbidden();
        }

        try {
            ProductCreateRequest req = objectMapper.readValue(dataJson, ProductCreateRequest.class);
            ProductResponse response = productService.createProduct(vendorId, req, images);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "product", response,
                    "message", "Product submitted for approval."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Failed to create product: " + e.getMessage()));
        }
    }

    /**
     * GET /api/vendors/{vendorId}/products
     */
    @GetMapping("/{vendorId}/products")
    public ResponseEntity<?> getVendorProducts(
            @PathVariable Long vendorId,
            Authentication auth) {

        if (!isVendorOwner(auth, vendorId)) {
            return forbidden();
        }
        try {
            List<ProductResponse> products = productService.getVendorProducts(vendorId);
            return ResponseEntity.ok(Map.of("success", true, "products", products));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * PUT /api/vendors/{vendorId}/products/{productId}
     */
    @PutMapping(value = "/{vendorId}/products/{productId}", consumes = "multipart/form-data")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long vendorId,
            @PathVariable Long productId,
            @RequestParam("data") String dataJson,
            @RequestParam(value = "images", required = false) List<MultipartFile> newImages,
            @RequestParam(value = "deleteImageIds", required = false) List<Long> deleteImageIds,
            Authentication auth) {

        if (!isVendorOwner(auth, vendorId)) {
            return forbidden();
        }

        try {
            ProductCreateRequest req = objectMapper.readValue(dataJson, ProductCreateRequest.class);
            ProductResponse response = productService.updateProduct(
                    vendorId, productId, req, newImages, deleteImageIds);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "product", response,
                    "message", "Product updated and re-submitted for approval."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (SecurityException e) {
            return ResponseEntity.status(403)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Failed to update product: " + e.getMessage()));
        }
    }

    /**
     * DELETE /api/vendors/{vendorId}/products/{productId}
     */
    @DeleteMapping("/{vendorId}/products/{productId}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long vendorId,
            @PathVariable Long productId,
            Authentication auth) {

        if (!isVendorOwner(auth, vendorId)) {
            return forbidden();
        }

        try {
            productService.deleteProduct(vendorId, productId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Product removed successfully."));
        } catch (SecurityException e) {
            return ResponseEntity.status(403)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Failed to delete product: " + e.getMessage()));
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────
    /**
     * Vendor owner check — principal is a Long (vendorId) set by
     * JwtAuthenticationFilter. Authority must be ROLE_VENDOR.
     */
    private boolean isVendorOwner(Authentication auth, Long requestedVendorId) {
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }

        boolean isVendor = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_VENDOR"));
        if (!isVendor) {
            return false;
        }

        Object principal = auth.getPrincipal();
        if (principal instanceof Long) {
            return ((Long) principal).equals(requestedVendorId);
        }
        return false;
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(403)
                .body(Map.of("success", false, "message", "Access denied"));
    }
}
