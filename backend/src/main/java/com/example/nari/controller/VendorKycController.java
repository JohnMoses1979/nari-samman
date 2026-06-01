package com.example.nari.controller;

import com.example.nari.dto.KycSubmitResponse;
import com.example.nari.service.VendorKycService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * Vendor-facing KYC endpoints (JWT protected — vendor can only touch their own data).
 *
 * POST  /api/vendors/{id}/kyc        — submit / re-submit KYC documents (multipart)
 * GET   /api/vendors/{id}/kyc/status — get own KYC status + admin note
 */
@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class VendorKycController {

    private final VendorKycService kycService;

    public VendorKycController(VendorKycService kycService) {
        this.kycService = kycService;
    }

    /**
     * POST /api/vendors/{id}/kyc
     * Accepts multipart/form-data with optional file fields + vendorNote text field.
     */
    @PostMapping(value = "/{id}/kyc", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> submitKyc(
            @PathVariable Long id,
            @RequestPart(value = "identityProof",    required = false) MultipartFile identityProof,
            @RequestPart(value = "shgCertificate",   required = false) MultipartFile shgCertificate,
            @RequestPart(value = "addressProof",     required = false) MultipartFile addressProof,
            @RequestPart(value = "panRegistration",  required = false) MultipartFile panRegistration,
            @RequestParam(value = "vendorNote",      required = false) String vendorNote,
            Authentication auth) {

        if (!isOwner(auth, id)) return forbidden();

        // At least identity or shg cert must be provided on first submit
        try {
            KycSubmitResponse response = kycService.submitKyc(
                    id, identityProof, shgCertificate, addressProof, panRegistration, vendorNote);
            return ResponseEntity.ok(Map.of("success", true, "kyc", response,
                    "message", "KYC documents submitted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", "KYC submission failed: " + e.getMessage()));
        }
    }

    /**
     * GET /api/vendors/{id}/kyc/status
     * Returns the vendor's own KYC status + any admin rejection note.
     */
    @GetMapping("/{id}/kyc/status")
    public ResponseEntity<?> getKycStatus(@PathVariable Long id, Authentication auth) {
        if (!isOwner(auth, id)) return forbidden();
        try {
            KycSubmitResponse response = kycService.getVendorKycStatus(id);
            return ResponseEntity.ok(Map.of("success", true, "kyc", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(404)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private boolean isOwner(Authentication auth, Long requestedId) {
        if (auth == null || auth.getPrincipal() == null) return false;
        return ((Long) auth.getPrincipal()).equals(requestedId);
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(403)
                .body(Map.of("success", false, "message", "Access denied"));
    }
}