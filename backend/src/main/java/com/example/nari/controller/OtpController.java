package com.example.nari.controller;

import com.example.nari.service.TwilioService;
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

    private String getValue(Map<String, Object> body, String... keys) {
        for (String key : keys) {
            Object value = body.get(key);
            if (value != null && !String.valueOf(value).trim().isEmpty()) {
                return String.valueOf(value).trim();
            }
        }
        return null;
    }

    private String normalizeIndianPhone(String value) {
        if (value == null) return null;

        String phone = value.trim()
                .replace(" ", "")
                .replace("-", "")
                .replace("(", "")
                .replace(")", "");

        if (phone.startsWith("+91")) {
            phone = phone.substring(3);
        } else if (phone.startsWith("91") && phone.length() == 12) {
            phone = phone.substring(2);
        }

        if (!phone.matches("^[6-9]\\d{9}$")) {
            return null;
        }

        return "+91" + phone;
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, Object> body) {
        try {
            String rawPhone = getValue(body, "phone", "mobileNumber", "phoneNumber", "mobile", "number");
            String phoneE164 = normalizeIndianPhone(rawPhone);

            if (phoneE164 == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "message", "Valid 10-digit Indian mobile number is required"
                ));
            }

            twilioService.sendOtp(phoneE164);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "OTP sent successfully to " + phoneE164
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "message", e.getMessage()
            ));
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, Object> body) {
        try {
            String rawPhone = getValue(body, "phone", "mobileNumber", "phoneNumber", "mobile", "number");
            String rawCode = getValue(body, "code", "otp", "otpCode", "verificationCode");

            String phoneE164 = normalizeIndianPhone(rawPhone);

            if (phoneE164 == null || rawCode == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "verified", false,
                        "message", "Valid phone number and OTP code are required"
                ));
            }

            boolean approved = twilioService.verifyOtp(phoneE164, rawCode);

            if (approved) {
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "verified", true,
                        "message", "Mobile number verified successfully"
                ));
            }

            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "verified", false,
                    "message", "Invalid or expired OTP. Please try again."
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "success", false,
                    "verified", false,
                    "message", e.getMessage()
            ));
        }
    }
}
