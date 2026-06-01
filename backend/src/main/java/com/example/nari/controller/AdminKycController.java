package com.example.nari.controller;

import com.example.nari.dto.AdminKycReviewResponse;
import com.example.nari.service.VendorKycService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Admin-only KYC management endpoints.
 * All routes require ROLE_ADMIN (enforced in SecurityConfig).
 *
 * GET  /api/admin/vendor-kyc                  — list all KYC submissions (optionally ?status=PENDING|APPROVED|REJECTED)
 * GET  /api/admin/vendor-kyc/{vendorId}        — single vendor KYC detail
 * PUT  /api/admin/vendor-kyc/{vendorId}/approve — approve KYC
 * PUT  /api/admin/vendor-kyc/{vendorId}/reject  — reject KYC (adminNote required)
 */
@RestController
@RequestMapping("/api/admin/vendor-kyc")
@CrossOrigin(origins = "*")
public class AdminKycController {

    private final VendorKycService kycService;

    public AdminKycController(VendorKycService kycService) {
        this.kycService = kycService;
    }

    /**
     * GET /api/admin/vendor-kyc?status=PENDING
     */
    @GetMapping
    public ResponseEntity<?> listAllKyc(
            @RequestParam(required = false) String status,
            Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        try {
            List<AdminKycReviewResponse> list = kycService.getAllKycSubmissions(status);
            return ResponseEntity.ok(Map.of("success", true, "kyc", list, "count", list.size()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Failed to fetch KYC submissions: " + e.getMessage()));
        }
    }

    /**
     * GET /api/admin/vendor-kyc/{vendorId}
     */
    @GetMapping("/{vendorId}")
    public ResponseEntity<?> getVendorKyc(@PathVariable Long vendorId, Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        try {
            AdminKycReviewResponse response = kycService.getVendorKycDetail(vendorId);
            return ResponseEntity.ok(Map.of("success", true, "kyc", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * PUT /api/admin/vendor-kyc/{vendorId}/approve
     * Body: { "adminNote": "Documents verified successfully" }
     */
    @PutMapping("/{vendorId}/approve")
    public ResponseEntity<?> approveKyc(
            @PathVariable Long vendorId,
            @RequestBody(required = false) Map<String, String> body,
            Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        try {
            String adminNote  = body != null ? body.getOrDefault("adminNote", "") : "";
            String reviewedBy = getAdminIdentifier(auth);
            AdminKycReviewResponse response = kycService.approveKyc(vendorId, adminNote, reviewedBy);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "kyc", response,
                    "message", "KYC approved — vendor account activated"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Approval failed: " + e.getMessage()));
        }
    }

    /**
     * PUT /api/admin/vendor-kyc/{vendorId}/reject
     * Body: { "adminNote": "Identity document unclear, please resubmit." }
     */
    @PutMapping("/{vendorId}/reject")
    public ResponseEntity<?> rejectKyc(
            @PathVariable Long vendorId,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        try {
            String adminNote  = body != null ? body.get("adminNote") : null;
            String reviewedBy = getAdminIdentifier(auth);
            AdminKycReviewResponse response = kycService.rejectKyc(vendorId, adminNote, reviewedBy);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "kyc", response,
                    "message", "KYC rejected — vendor notified"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "Rejection failed: " + e.getMessage()));
        }
    }

    // ─── Helper ──────────────────────────────────────────────────────────────

    private String getAdminIdentifier(Authentication auth) {
        if (auth == null) return "admin";
        Object principal = auth.getPrincipal();
        return principal != null ? principal.toString() : "admin";
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) return false;
        Object principal = auth.getPrincipal();
        return principal instanceof String && ((String) principal).startsWith("admin:");
    }
}
