// package com.example.nari.controller;
// import com.example.nari.dto.AdminProductReviewRequest;
// import com.example.nari.dto.ProductResponse;
// import com.example.nari.service.ProductService;
// import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
// import org.springframework.web.bind.annotation.*;
// import java.util.List;
// import java.util.Map;
// /**
//  * Admin-only product review endpoints.
//  *
//  * GET  /api/admin/products              — list products (optional ?status=PENDING)
//  * PUT  /api/admin/products/{id}/approve — approve
//  * PUT  /api/admin/products/{id}/reject  — reject with reason
//  */
// @RestController
// @RequestMapping("/api/admin/products")
// @CrossOrigin(origins = "*")
// public class AdminProductController {
//     private final ProductService productService;
//     public AdminProductController(ProductService productService) {
//         this.productService = productService;
//     }
//     @GetMapping
//     public ResponseEntity<?> listProducts(
//             @RequestParam(value = "status", required = false) String status,
//             Authentication auth) {
//         if (!isAdmin(auth)) return forbidden();
//         try {
//             List<ProductResponse> products = productService.adminGetProducts(status);
//             return ResponseEntity.ok(Map.of("success", true, "products", products,
//                     "pendingCount", productService.countPendingProducts()));
//         } catch (Exception e) {
//             return ResponseEntity.internalServerError()
//                     .body(Map.of("success", false, "message", e.getMessage()));
//         }
//     }
//     @PutMapping("/{id}/approve")
//     public ResponseEntity<?> approveProduct(
//             @PathVariable Long id,
//             @RequestBody(required = false) AdminProductReviewRequest req,
//             Authentication auth) {
//         if (!isAdmin(auth)) return forbidden();
//         try {
//             String badge = req != null ? req.getBadge() : null;
//             String reviewer = auth.getName();
//             ProductResponse product = productService.adminApproveProduct(id, reviewer, badge);
//             return ResponseEntity.ok(Map.of("success", true, "product", product,
//                     "message", "Product approved and is now live."));
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
//         }
//     }
//     @PutMapping("/{id}/reject")
//     public ResponseEntity<?> rejectProduct(
//             @PathVariable Long id,
//             @RequestBody AdminProductReviewRequest req,
//             Authentication auth) {
//         if (!isAdmin(auth)) return forbidden();
//         try {
//             String reviewer = auth.getName();
//             ProductResponse product = productService.adminRejectProduct(id, req.getRejectionReason(), reviewer);
//             return ResponseEntity.ok(Map.of("success", true, "product", product,
//                     "message", "Product rejected."));
//         } catch (IllegalArgumentException e) {
//             return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
//         }
//     }
//     private boolean isAdmin(Authentication auth) {
//         return auth != null && "ADMIN".equals(auth.getName());
//     }
//     private ResponseEntity<?> forbidden() {
//         return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
//     }
// }

package com.example.nari.controller;

import com.example.nari.dto.AdminProductReviewRequest;
import com.example.nari.dto.ProductResponse;
import com.example.nari.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only product review endpoints.
 *
 * GET /api/admin/products — list products (optional ?status=PENDING) PUT
 * /api/admin/products/{id}/approve — approve PUT
 * /api/admin/products/{id}/reject — reject with reason
 */
@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "*")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<?> listProducts(
            @RequestParam(value = "status", required = false) String status,
            Authentication auth) {

        if (!isAdmin(auth)) {
            return forbidden();
        }
        try {
            List<ProductResponse> products = productService.adminGetProducts(status);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "products", products,
                    "pendingCount", productService.countPendingProducts()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveProduct(
            @PathVariable Long id,
            @RequestBody(required = false) AdminProductReviewRequest req,
            Authentication auth) {

        if (!isAdmin(auth)) {
            return forbidden();
        }
        try {
            // Extract admin email from principal string "admin:email@..."
            String reviewer = extractAdminEmail(auth);
            String badge = req != null ? req.getBadge() : null;
            ProductResponse product = productService.adminApproveProduct(id, reviewer, badge);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "product", product,
                    "message", "Product approved and is now live."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectProduct(
            @PathVariable Long id,
            @RequestBody AdminProductReviewRequest req,
            Authentication auth) {

        if (!isAdmin(auth)) {
            return forbidden();
        }
        try {
            String reviewer = extractAdminEmail(auth);
            ProductResponse product = productService.adminRejectProduct(
                    id, req.getRejectionReason(), reviewer);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "product", product,
                    "message", "Product rejected."
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────
    /**
     * Check ROLE_ADMIN authority — matches how JwtAuthenticationFilter sets it.
     * Principal for admin = "admin:email@..." (String) Authority = ROLE_ADMIN
     */
    private boolean isAdmin(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) {
            return false;
        }
        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .anyMatch(a -> a.equals("ROLE_ADMIN"));
    }

    /**
     * Extract admin email from principal string "admin:email@..."
     */
    private String extractAdminEmail(Authentication auth) {
        if (auth == null) {
            return "admin";
        }
        String principal = String.valueOf(auth.getPrincipal());
        // principal format: "admin:email@example.com"
        if (principal.startsWith("admin:")) {
            return principal.substring(6);
        }
        return principal;
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(403)
                .body(Map.of("success", false, "message", "Admin access required"));
    }
}
