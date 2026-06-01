package com.example.nari.dto;

public class AdminProductReviewRequest {

    private String rejectionReason;
    private String badge; // optional — admin can set a badge on approval

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getBadge() {
        return badge;
    }

    public void setBadge(String badge) {
        this.badge = badge;
    }
}
