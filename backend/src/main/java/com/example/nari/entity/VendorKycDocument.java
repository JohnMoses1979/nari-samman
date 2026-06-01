package com.example.nari.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Stores KYC document metadata + file paths for each vendor. One row per vendor
 * — updated on re-submission.
 */
@Entity
@Table(name = "vendor_kyc_documents")
public class VendorKycDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ── Vendor link ───────────────────────────────────────────────────────────
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false, unique = true)
    private Vendor vendor;

    // ── Uploaded file paths (relative to upload dir, e.g. "kyc/42/identity.jpg") ──
    @Column(name = "identity_proof_path")
    private String identityProofPath;

    @Column(name = "shg_certificate_path")
    private String shgCertificatePath;

    @Column(name = "address_proof_path")
    private String addressProofPath;

    @Column(name = "pan_registration_path")
    private String panRegistrationPath;

    // ── Admin note left by vendor during submission ───────────────────────────
    @Column(name = "vendor_note", length = 1000)
    private String vendorNote;

    // ── KYC status: PENDING | APPROVED | REJECTED ─────────────────────────────
    @Column(name = "kyc_status", nullable = false)
    private String kycStatus = "PENDING";

    // ── Admin review ─────────────────────────────────────────────────────────
    @Column(name = "admin_note", length = 1000)
    private String adminNote;

    @Column(name = "reviewed_by")
    private String reviewedBy; // admin email/id who reviewed

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    // ── Timestamps ─────────────────────────────────────────────────────────────
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        submittedAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ─── Getters & Setters ───────────────────────────────────────────────────
    public Long getId() {
        return id;
    }

    public Vendor getVendor() {
        return vendor;
    }

    public void setVendor(Vendor vendor) {
        this.vendor = vendor;
    }

    public String getIdentityProofPath() {
        return identityProofPath;
    }

    public void setIdentityProofPath(String identityProofPath) {
        this.identityProofPath = identityProofPath;
    }

    public String getShgCertificatePath() {
        return shgCertificatePath;
    }

    public void setShgCertificatePath(String shgCertificatePath) {
        this.shgCertificatePath = shgCertificatePath;
    }

    public String getAddressProofPath() {
        return addressProofPath;
    }

    public void setAddressProofPath(String addressProofPath) {
        this.addressProofPath = addressProofPath;
    }

    public String getPanRegistrationPath() {
        return panRegistrationPath;
    }

    public void setPanRegistrationPath(String panRegistrationPath) {
        this.panRegistrationPath = panRegistrationPath;
    }

    public String getVendorNote() {
        return vendorNote;
    }

    public void setVendorNote(String vendorNote) {
        this.vendorNote = vendorNote;
    }

    public String getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(String kycStatus) {
        this.kycStatus = kycStatus;
    }

    public String getAdminNote() {
        return adminNote;
    }

    public void setAdminNote(String adminNote) {
        this.adminNote = adminNote;
    }

    public String getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(String reviewedBy) {
        this.reviewedBy = reviewedBy;
    }

    public LocalDateTime getReviewedAt() {
        return reviewedAt;
    }

    public void setReviewedAt(LocalDateTime reviewedAt) {
        this.reviewedAt = reviewedAt;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
