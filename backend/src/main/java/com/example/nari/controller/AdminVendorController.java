package com.example.nari.controller;

import com.example.nari.dto.AdminVendorListItem;
import com.example.nari.entity.Vendor;
import com.example.nari.repository.VendorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/vendors")
@CrossOrigin(origins = "*")
public class AdminVendorController {

    private static final DateTimeFormatter FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    private final VendorRepository vendorRepository;

    public AdminVendorController(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    @GetMapping
    public ResponseEntity<?> listAllVendors(Authentication auth) {
        if (!isAdmin(auth)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "Admin access required"));
        }
        List<Vendor> vendors = vendorRepository.findAll();
        List<AdminVendorListItem> data = vendors.stream()
                .sorted(Comparator.comparing(Vendor::getCreatedAt, Comparator.nullsLast(Comparator.naturalOrder())).reversed())
                .map(this::toItem)
                .collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("success", true, "vendors", data, "count", data.size()));
    }

    private AdminVendorListItem toItem(Vendor v) {
        AdminVendorListItem item = new AdminVendorListItem();
        item.setId(v.getId());
        item.setLeaderName(v.getLeaderName());
        item.setShgName(v.getShgName());
        item.setEmail(v.getEmail());
        item.setMobileNumber(v.getMobileNumber());
        item.setVillage(v.getVillage());
        item.setDistrict(v.getDistrict());
        item.setState(v.getState());
        item.setCategory(v.getCategory());
        item.setApprovalStatus(v.getApprovalStatus());
        item.setCreatedAt(v.getCreatedAt() != null ? v.getCreatedAt().format(FMT) : null);
        return item;
    }

    private boolean isAdmin(Authentication auth) {
        if (auth == null || auth.getPrincipal() == null) return false;
        Object principal = auth.getPrincipal();
        return principal instanceof String && ((String) principal).startsWith("admin:");
    }
}
