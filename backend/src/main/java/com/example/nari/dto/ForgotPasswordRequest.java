package com.example.nari.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class ForgotPasswordRequest {

    // 10-digit Indian mobile number (without +91)
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\d{10}$", message = "Enter a valid 10-digit mobile number")
    private String phone;

    // OTP code received via SMS
    @NotBlank(message = "OTP is required")
    @Size(min = 4, max = 8, message = "Invalid OTP length")
    private String otp;

    // New password to set
    @NotBlank(message = "New password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String newPassword;

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }

    public String getNewPassword() { return newPassword; }
    public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
}