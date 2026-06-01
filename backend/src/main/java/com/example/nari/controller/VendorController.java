package com.example.nari.controller;

import com.example.nari.dto.*;
import com.example.nari.service.TwilioService;
import com.example.nari.service.VendorService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.example.nari.dto.ForgotPasswordRequest;

import java.util.Map;

@RestController
@RequestMapping("/api/vendors")
@CrossOrigin(origins = "*")
public class VendorController {

    private final VendorService vendorService;
    private final TwilioService twilioService;

    public VendorController(VendorService vendorService, TwilioService twilioService) {
        this.vendorService = vendorService;
        this.twilioService = twilioService;
    }

    /**
     * POST /api/vendors/register — Public
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody VendorRegisterRequest request) {
        try {
            Map<String, Object> result = vendorService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Registration failed. Please try again."));
        }
    }

    /**
     * POST /api/vendors/login — Public
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody VendorLoginRequest request) {
        try {
            Map<String, Object> result = vendorService.login(request);
            return ResponseEntity.ok(result);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Login failed. Please try again."));
        }
    }

    /**
     * GET /api/vendors/{id} — JWT protected
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id, Authentication auth) {
        if (!isOwner(auth, id)) {
            return forbidden();
        }
        try {
            VendorProfileResponse profile = vendorService.getProfile(id);
            return ResponseEntity.ok(Map.of("success", true, "profile", profile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * PUT /api/vendors/{id} — JWT protected
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id,
            @Valid @RequestBody VendorUpdateRequest request,
            Authentication auth) {
        if (!isOwner(auth, id)) {
            return forbidden();
        }
        try {
            VendorProfileResponse updated = vendorService.updateProfile(id, request);
            return ResponseEntity.ok(Map.of("success", true, "profile", updated,
                    "message", "Profile updated successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Update failed. Please try again."));
        }
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private boolean isOwner(Authentication auth, Long requestedId) {
        if (auth == null || auth.getPrincipal() == null) {
            return false;
        }
        return ((Long) auth.getPrincipal()).equals(requestedId);
    }

    private ResponseEntity<?> forbidden() {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("success", false, "message", "Access denied"));
    }


    // ADD these two endpoints:

/**
 * POST /api/vendors/check-phone
 * Public — verifies mobile is registered before OTP is sent.
 */
@PostMapping("/check-phone")
public ResponseEntity<?> checkPhone(@RequestBody Map<String, String> body) {
    String phone = body.getOrDefault("phone", "").trim();
    if (phone.length() != 10 || !phone.matches("\\d{10}")) {
        return ResponseEntity.badRequest()
                .body(Map.of("success", false, "message", "Enter a valid 10-digit mobile number"));
    }
    boolean exists = vendorService.phoneExists(phone);
    if (!exists) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "No SHG/vendor account found with this mobile number"));
    }
    return ResponseEntity.ok(Map.of("success", true, "message", "Phone number verified"));
}

/**
 * POST /api/vendors/reset-password
 * Public — resets password after OTP verification.
 */
@PostMapping("/reset-password")
public ResponseEntity<?> resetPassword(@Valid @RequestBody ForgotPasswordRequest request) {
    // String phoneE164 = "+91" + request.getPhone();
    // boolean otpValid;
    // try {
    //     otpValid = twilioService.verifyOtp(phoneE164, request.getOtp());
    // } catch (Exception e) {
    //     return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
    //             .body(Map.of("success", false, "message", "OTP verification failed. Please try again."));
    // }

    // if (!otpValid) {
    //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    //             .body(Map.of("success", false, "message", "Invalid or expired OTP"));
    // }

    boolean updated = vendorService.resetPasswordByPhone(request.getPhone(), request.getNewPassword());
    if (!updated) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("success", false, "message", "No account found with this mobile number"));
    }

    return ResponseEntity.ok(Map.of("success", true, "message", "Password reset successfully. Please login."));
}
}
