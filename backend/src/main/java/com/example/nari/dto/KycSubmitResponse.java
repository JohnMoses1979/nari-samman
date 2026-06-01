package com.example.nari.dto;

// ─── KYC Submit Response ─────────────────────────────────────────────────────
// Returned after a vendor submits / updates KYC documents.
public class KycSubmitResponse {

    private Long kycId;
    private Long vendorId;
    private String kycStatus;
    private String identityProofUrl;
    private String shgCertificateUrl;
    private String addressProofUrl;
    private String panRegistrationUrl;
    private String vendorNote;
    private String submittedAt;
    private String updatedAt;

    // ─── Getters & Setters ───────────────────────────────────────────────────
    public Long getKycId() {
        return kycId;
    }

    public void setKycId(Long kycId) {
        this.kycId = kycId;
    }

    public Long getVendorId() {
        return vendorId;
    }

    public void setVendorId(Long vendorId) {
        this.vendorId = vendorId;
    }

    public String getKycStatus() {
        return kycStatus;
    }

    public void setKycStatus(String kycStatus) {
        this.kycStatus = kycStatus;
    }

    public String getIdentityProofUrl() {
        return identityProofUrl;
    }

    public void setIdentityProofUrl(String identityProofUrl) {
        this.identityProofUrl = identityProofUrl;
    }

    public String getShgCertificateUrl() {
        return shgCertificateUrl;
    }

    public void setShgCertificateUrl(String shgCertificateUrl) {
        this.shgCertificateUrl = shgCertificateUrl;
    }

    public String getAddressProofUrl() {
        return addressProofUrl;
    }

    public void setAddressProofUrl(String addressProofUrl) {
        this.addressProofUrl = addressProofUrl;
    }

    public String getPanRegistrationUrl() {
        return panRegistrationUrl;
    }

    public void setPanRegistrationUrl(String panRegistrationUrl) {
        this.panRegistrationUrl = panRegistrationUrl;
    }

    public String getVendorNote() {
        return vendorNote;
    }

    public void setVendorNote(String vendorNote) {
        this.vendorNote = vendorNote;
    }

    public String getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(String submittedAt) {
        this.submittedAt = submittedAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}
