package com.example.nari.controller;

import com.example.nari.dto.*;
import com.example.nari.service.ConsumerService;
import com.example.nari.service.TwilioService;
import com.example.nari.dto.ForgotPasswordRequest;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@ RestController 

    @RequestMapping("/api/consumers")
    @CrossOrigin(origins = "*")
    public class ConsumerController {

        private final ConsumerService consumerService;
        private final TwilioService twilioService;

        public ConsumerController(ConsumerService consumerService, TwilioService twilioService) {
            this.consumerService = consumerService;
            this.twilioService = twilioService;
        }
         
        
          
        /**
     * POST /api/consumers/register Public — no JWT needed.
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody ConsumerRegisterRequest request) {
        try {
            Map<String, Object> result = consumerService.register(request);
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
     * POST /api/consumers/login Public — no JWT needed.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody ConsumerLoginRequest request) {
        try {
            Map<String, Object> result = consumerService.login(request);
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
     * GET /api/consumers/{id} Protected — JWT required. Consumers can only
     * access their own profile.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProfile(@PathVariable Long id, Authentication auth) {
        if (!isOwner(auth, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "Access denied"));
        }
        try {
            ConsumerProfileResponse profile = consumerService.getProfile(id);
            return ResponseEntity.ok(Map.of("success", true, "profile", profile));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * PUT /api/consumers/{id} Protected — JWT required.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id,
            @Valid @RequestBody ConsumerUpdateRequest request,
            Authentication auth) {
        if (!isOwner(auth, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "Access denied"));
        }
        try {
            ConsumerProfileResponse updated = consumerService.updateProfile(id, request);
            return ResponseEntity.ok(Map.of("success", true, "profile", updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * DELETE /api/consumers/{id} Protected — JWT required.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteConsumer(@PathVariable Long id, Authentication auth) {
        if (!isOwner(auth, id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "Access denied"));
        }
        try {
            consumerService.deleteConsumer(id);
            return ResponseEntity.ok(Map.of("success", true, "message", "Account deleted successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * Checks that the JWT principal matches the requested resource ID. Prevents
     * consumers from accessing other consumers' data.
     */
    private boolean isOwner(Authentication auth, Long requestedId) {
        if (auth == null || auth.getPrincipal() == null) {
            return false;
        }
        Long tokenConsumerId = (Long) auth.getPrincipal();
        return tokenConsumerId.equals(requestedId);
    }

    // ADD these imports if not already present:
// import com.example.nari.dto.ForgotPasswordRequest;
    /**
     * POST /api/consumers/check-phone Public — verifies the phone is registered
     * before OTP is sent. Returns 200 if found, 404 if not found.
     */
    @PostMapping("/check-phone")
    public ResponseEntity<?> checkPhone(@RequestBody Map<String, String> body) {
        String phone = body.getOrDefault("phone", "").trim();
        if (phone.length() != 10 || !phone.matches("\\d{10}")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "Enter a valid 10-digit mobile number"));
        }
        boolean exists = consumerService.phoneExists(phone);
        if (!exists) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "No account found with this mobile number"));
        }
        return ResponseEntity.ok(Map.of("success", true, "message", "Phone number verified"));
    }

    /**
     * POST /api/consumers/reset-password Public — resets the password after OTP
     * has been verified. Frontend must call /api/otp/verify first, then call
     * this.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        // Re-verify OTP one final time on the backend as a security gate.
        // TwilioService is injected via constructor — add it below.
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

        boolean updated = consumerService.resetPasswordByPhone(request.getPhone(), request.getNewPassword());
        if (!updated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "No account found with this mobile number"));
        }

        return ResponseEntity.ok(Map.of("success", true, "message", "Password reset successfully. Please login."));
    }
}
