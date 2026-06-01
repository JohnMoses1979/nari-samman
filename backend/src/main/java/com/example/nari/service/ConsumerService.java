package com.example.nari.service;

import com.example.nari.dto.*;
import com.example.nari.entity.Consumer;
import com.example.nari.repository.ConsumerRepository;
import com.example.nari.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Map;

@Service
public class ConsumerService {

    private final ConsumerRepository consumerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private static final Logger log = LoggerFactory.getLogger(ConsumerService.class);

    public ConsumerService(ConsumerRepository consumerRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.consumerRepository = consumerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ─── Register ─────────────────────────────────────────────────────────────
    public Map<String, Object> register(ConsumerRegisterRequest request) {
        if (consumerRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Consumer consumer = new Consumer();
        consumer.setFullName(request.getFullName());
        consumer.setEmail(request.getEmail().toLowerCase().trim());
        consumer.setPhone(request.getPhone());
        consumer.setPassword(passwordEncoder.encode(request.getPassword())); // BCrypt hash

        Consumer saved = consumerRepository.save(consumer);

        String token = jwtUtil.generateConsumerToken(saved.getId(), saved.getEmail());

        return Map.of(
                "success", true,
                "token", token,
                "consumerId", saved.getId(),
                "profile", toProfileResponse(saved)
        );
    }

    // ─── Login ────────────────────────────────────────────────────────────────
    public Map<String, Object> login(ConsumerLoginRequest request) {
        Consumer consumer = consumerRepository
                .findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), consumer.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateConsumerToken(consumer.getId(), consumer.getEmail());

        return Map.of(
                "success", true,
                "token", token,
                "consumerId", consumer.getId(),
                "profile", toProfileResponse(consumer)
        );
    }

    // ─── Get Profile ──────────────────────────────────────────────────────────
    public ConsumerProfileResponse getProfile(Long id) {
        Consumer consumer = findById(id);
        return toProfileResponse(consumer);
    }

    // ─── Update Profile ───────────────────────────────────────────────────────
    public ConsumerProfileResponse updateProfile(Long id, ConsumerUpdateRequest request) {
        Consumer consumer = findById(id);

        // If email changed, ensure the new email is not already taken by another account
        if (!consumer.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (consumerRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already in use by another account");
            }
        }

        consumer.setFullName(request.getFullName());
        consumer.setEmail(request.getEmail().toLowerCase().trim());
        consumer.setPhone(request.getPhone());

        if (request.getProfileImage() != null && !request.getProfileImage().isBlank()) {
            consumer.setProfileImage(request.getProfileImage());
        }

        Consumer updated = consumerRepository.save(consumer);
        return toProfileResponse(updated);
    }

    // ─── Delete ───────────────────────────────────────────────────────────────
    public void deleteConsumer(Long id) {
        Consumer consumer = findById(id);
        consumerRepository.delete(consumer);
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private Consumer findById(Long id) {
        return consumerRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Consumer not found with id: " + id));
    }

    private ConsumerProfileResponse toProfileResponse(Consumer consumer) {
        return new ConsumerProfileResponse(
                consumer.getId(),
                consumer.getFullName(),
                consumer.getEmail(),
                consumer.getPhone(),
                consumer.getProfileImage()
        );
    }

// ─── Forgot Password: verify phone is registered ──────────────────────────
// Called BEFORE sending OTP — confirms this phone belongs to a consumer.
    public boolean phoneExists(String phone) {
        return consumerRepository.existsByPhone(phone.trim());
    }

// ─── Forgot Password: reset password after OTP verified ───────────────────
// Called AFTER frontend verifies OTP via /api/otp/verify.
// BCrypt-hashes the new password and saves it. Returns false if phone not found.
    public boolean resetPasswordByPhone(String phone, String newPassword) {
        return consumerRepository.findByPhone(phone.trim()).map(consumer -> {
            consumer.setPassword(passwordEncoder.encode(newPassword));
            consumerRepository.save(consumer);
            log.info("[ForgotPassword] Consumer password reset for phone: {}", phone);
            return true;
        }).orElse(false);
    }
}
