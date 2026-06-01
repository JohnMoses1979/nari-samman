package com.example.nari.service;

import com.example.nari.dto.*;
import com.example.nari.entity.Vendor;
import com.example.nari.repository.VendorRepository;
import com.example.nari.security.JwtUtil;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class VendorService {

    private final VendorRepository vendorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private static final Logger log = LoggerFactory.getLogger(VendorService.class);

    public VendorService(VendorRepository vendorRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.vendorRepository = vendorRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    // ─── Register ─────────────────────────────────────────────────────────────
    public Map<String, Object> register(VendorRegisterRequest request) {
        if (vendorRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (vendorRepository.existsByMobileNumber(request.getMobileNumber().trim())) {
            throw new IllegalArgumentException("Mobile number already registered");
        }

        Vendor vendor = new Vendor();
        vendor.setLeaderName(request.getLeaderName().trim());
        vendor.setShgName(request.getShgName().trim());
        vendor.setEmail(request.getEmail().toLowerCase().trim());
        vendor.setMobileNumber(request.getMobileNumber().trim());
        vendor.setPassword(passwordEncoder.encode(request.getPassword()));
        vendor.setVillage(request.getVillage() != null ? request.getVillage().trim() : null);
        vendor.setDistrict(request.getDistrict() != null ? request.getDistrict().trim() : null);
        vendor.setState(request.getState() != null ? request.getState().trim() : null);
        vendor.setCategory(request.getCategory() != null ? request.getCategory().trim() : null);
        vendor.setMembers(request.getMembers() != null ? request.getMembers().trim() : null);
        vendor.setApprovalStatus("pending");

        Vendor saved = vendorRepository.save(vendor);
        String token = jwtUtil.generateVendorToken(saved.getId(), saved.getEmail());

        return Map.of(
                "success", true,
                "token", token,
                "vendorId", saved.getId(),
                "profile", toProfileResponse(saved)
        );
    }

    // ─── Login ────────────────────────────────────────────────────────────────
    public Map<String, Object> login(VendorLoginRequest request) {
        Vendor vendor = vendorRepository
                .findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), vendor.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = jwtUtil.generateVendorToken(vendor.getId(), vendor.getEmail());

        return Map.of(
                "success", true,
                "token", token,
                "vendorId", vendor.getId(),
                "profile", toProfileResponse(vendor)
        );
    }

    // ─── Get Profile ──────────────────────────────────────────────────────────
    public VendorProfileResponse getProfile(Long id) {
        return toProfileResponse(findById(id));
    }

    // ─── Update Profile ───────────────────────────────────────────────────────
    public VendorProfileResponse updateProfile(Long id, VendorUpdateRequest request) {
        Vendor vendor = findById(id);

        if (!vendor.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (vendorRepository.existsByEmail(request.getEmail().toLowerCase().trim())) {
                throw new IllegalArgumentException("Email already in use by another account");
            }
        }

        vendor.setLeaderName(request.getLeaderName().trim());
        vendor.setShgName(request.getShgName().trim());
        vendor.setEmail(request.getEmail().toLowerCase().trim());
        if (request.getMobileNumber() != null && !request.getMobileNumber().isBlank()) {
            vendor.setMobileNumber(request.getMobileNumber().trim());
        }
        vendor.setVillage(request.getVillage() != null ? request.getVillage().trim() : vendor.getVillage());
        vendor.setDistrict(request.getDistrict() != null ? request.getDistrict().trim() : vendor.getDistrict());
        vendor.setState(request.getState() != null ? request.getState().trim() : vendor.getState());
        vendor.setCategory(request.getCategory() != null ? request.getCategory().trim() : vendor.getCategory());
        vendor.setMembers(request.getMembers() != null ? request.getMembers().trim() : vendor.getMembers());
        if (request.getProfileImage() != null && !request.getProfileImage().isBlank()) {
            vendor.setProfileImage(request.getProfileImage());
        }

        return toProfileResponse(vendorRepository.save(vendor));
    }

    // ─── Helpers ──────────────────────────────────────────────────────────────
    private Vendor findById(Long id) {
        return vendorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Vendor not found with id: " + id));
    }

    private VendorProfileResponse toProfileResponse(Vendor v) {
        return new VendorProfileResponse(
                v.getId(), v.getShgName(), v.getLeaderName(), v.getEmail(),
                v.getMobileNumber(), v.getVillage(), v.getDistrict(), v.getState(),
                v.getCategory(), v.getMembers(), v.getProfileImage(), v.getApprovalStatus()
        );
    }

    // ─── Forgot Password: verify phone is registered ──────────────────────────
    public boolean phoneExists(String mobileNumber) {
        return vendorRepository.existsByMobileNumber(mobileNumber.trim());
    }

// ─── Forgot Password: reset password after OTP verified ───────────────────
    public boolean resetPasswordByPhone(String mobileNumber, String newPassword) {
        return vendorRepository.findByMobileNumber(mobileNumber.trim()).map(vendor -> {
            vendor.setPassword(passwordEncoder.encode(newPassword));
            vendorRepository.save(vendor);
            log.info("[ForgotPassword] Vendor password reset for mobile: {}", mobileNumber);
            return true;
        }).orElse(false);
    }
}
