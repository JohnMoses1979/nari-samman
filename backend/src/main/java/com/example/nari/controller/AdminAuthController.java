package com.example.nari.controller;

import com.example.nari.dto.AdminLoginRequest;
import com.example.nari.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminAuthController {

    @Value("${admin.email}")
    private String adminEmail;

    @Value("${admin.password}")
    private String adminPassword;

    @Value("${admin.enabled}")
    private boolean adminEnabled;

    @Value("${admin.allow-default-credentials:false}")
    private boolean allowDefaultCredentials;

    private final JwtUtil jwtUtil;

    public AdminAuthController(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AdminLoginRequest request) {
        if (!adminEnabled) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "success", false,
                    "message", "Admin login is disabled. Set admin.enabled=true and provide ADMIN_EMAIL / ADMIN_PASSWORD."
            ));
        }

        // Safety: don't allow shipping the default demo credentials in production by accident.
        boolean usingDefaultEmail = "admin@narisamman.in".equalsIgnoreCase(adminEmail != null ? adminEmail.trim() : "");
        boolean usingDefaultPass = "Admin@1234".equals(adminPassword);
        if (usingDefaultEmail && usingDefaultPass && !allowDefaultCredentials) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(Map.of(
                    "success", false,
                    "message", "Default admin credentials are disabled. Set ADMIN_EMAIL/ADMIN_PASSWORD or set admin.allow-default-credentials=true for local dev."
            ));
        }

        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        String pass = request.getPassword() != null ? request.getPassword() : "";

        if (!email.equals(adminEmail.trim().toLowerCase()) || !pass.equals(adminPassword)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid admin credentials"));
        }

        String token = jwtUtil.generateAdminToken(email);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token,
                "email", email,
                "role", "ADMIN",
                "message", "Admin login successful"
        ));
    }
}
