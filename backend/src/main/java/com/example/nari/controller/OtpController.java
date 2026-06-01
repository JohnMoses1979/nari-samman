package com.example.nari.controller;

import com.example.nari.dto.OtpRequest;
import com.example.nari.dto.OtpVerifyRequest;
import com.example.nari.service.TwilioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@CrossOrigin(origins = "*")
public class OtpController {

    private final TwilioService twilioService;

    public OtpController(TwilioService twilioService) {
        this.twilioService = twilioService;
    }

    /**
     * POST /api/otp/send Public — no JWT needed. Sends OTP to the given
     * 10-digit Indian mobile number.
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@Valid @RequestBody OtpRequest request) {
        try {
            String phoneE164 = "+91" + request.getPhone();
            twilioService.sendOtp(phoneE164);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP sent successfully to +91" + request.getPhone()
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Failed to send OTP. Please check the number and try again."
            ));
        }
    }

    /**
     * POST /api/otp/verify Public — no JWT needed. Verifies OTP code entered by
     * the user.
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@Valid @RequestBody OtpVerifyRequest request) {
        try {
            String phoneE164 = "+91" + request.getPhone();
            boolean approved = twilioService.verifyOtp(phoneE164, request.getCode());

            if (approved) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Mobile number verified successfully"
                ));
            } else {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Invalid or expired OTP. Please try again."
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", "Verification failed. Please try again."
            ));
        }
    }
}
