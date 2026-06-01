package com.example.nari.repository;

import com.example.nari.entity.VendorKycDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VendorKycDocumentRepository extends JpaRepository<VendorKycDocument, Long> {

    Optional<VendorKycDocument> findByVendorId(Long vendorId);

    boolean existsByVendorId(Long vendorId);

    // Admin: fetch all KYC records with vendor info eagerly
    @Query("SELECT k FROM VendorKycDocument k JOIN FETCH k.vendor ORDER BY k.submittedAt DESC")
    List<VendorKycDocument> findAllWithVendor();

    // Admin: filter by status
    @Query("SELECT k FROM VendorKycDocument k JOIN FETCH k.vendor WHERE k.kycStatus = :status ORDER BY k.submittedAt DESC")
    List<VendorKycDocument> findByKycStatusWithVendor(String status);
}