
package com.example.nari.dto;

// ─── Admin KYC Review Response ───────────────────────────────────────────────
// Returned by GET /api/admin/vendor-kyc and GET /api/admin/vendor-kyc/{vendorId}
// Contains full vendor info + KYC document URLs + review status.

public class AdminKycReviewResponse {

    // Vendor info
    private Long vendorId;
    private String vendorName;       // leaderName
    private String shgName;
    private String email;
    private String phone;
    private String location;         // village
    private String category;
    private String approvalStatus;   // vendor's overall approval status

    // KYC doc
    private Long kycId;
    private String kycStatus;        // PENDING | APPROVED | REJECTED
    private String identityProofUrl;
    private String shgCertificateUrl;
    private String addressProofUrl;
    private String panRegistrationUrl;
    private String vendorNote;
    private String adminNote;
    private String reviewedBy;
    private String reviewedAt;
    private String submittedAt;
    private String updatedAt;

    // ─── Getters & Setters ───────────────────────────────────────────────────

    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }

    public String getVendorName() { return vendorName; }
    public void setVendorName(String vendorName) { this.vendorName = vendorName; }

    public String getShgName() { return shgName; }
    public void setShgName(String shgName) { this.shgName = shgName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }

    public Long getKycId() { return kycId; }
    public void setKycId(Long kycId) { this.kycId = kycId; }

    public String getKycStatus() { return kycStatus; }
    public void setKycStatus(String kycStatus) { this.kycStatus = kycStatus; }

    public String getIdentityProofUrl() { return identityProofUrl; }
    public void setIdentityProofUrl(String identityProofUrl) { this.identityProofUrl = identityProofUrl; }

    public String getShgCertificateUrl() { return shgCertificateUrl; }
    public void setShgCertificateUrl(String shgCertificateUrl) { this.shgCertificateUrl = shgCertificateUrl; }

    public String getAddressProofUrl() { return addressProofUrl; }
    public void setAddressProofUrl(String addressProofUrl) { this.addressProofUrl = addressProofUrl; }

    public String getPanRegistrationUrl() { return panRegistrationUrl; }
    public void setPanRegistrationUrl(String panRegistrationUrl) { this.panRegistrationUrl = panRegistrationUrl; }

    public String getVendorNote() { return vendorNote; }
    public void setVendorNote(String vendorNote) { this.vendorNote = vendorNote; }

    public String getAdminNote() { return adminNote; }
    public void setAdminNote(String adminNote) { this.adminNote = adminNote; }

    public String getReviewedBy() { return reviewedBy; }
    public void setReviewedBy(String reviewedBy) { this.reviewedBy = reviewedBy; }

    public String getReviewedAt() { return reviewedAt; }
    public void setReviewedAt(String reviewedAt) { this.reviewedAt = reviewedAt; }

    public String getSubmittedAt() { return submittedAt; }
    public void setSubmittedAt(String submittedAt) { this.submittedAt = submittedAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}