package com.example.nari.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class OtpVerifyRequest {

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[6-9]\\d{9}$", message = "Enter valid 10-digit Indian mobile number")
    private String phone;

    @NotBlank(message = "OTP code is required")
    private String code;

    public OtpVerifyRequest() {
    }

    public OtpVerifyRequest(String phone, String code) {
        this.phone = cleanPhone(phone);
        this.code = code;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = cleanPhone(phone);
    }

    // This makes JSON {"mobileNumber":"9963795242"} work
    public void setMobileNumber(String mobileNumber) {
        this.phone = cleanPhone(mobileNumber);
    }

    public String getMobileNumber() {
        return phone;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phone = cleanPhone(phoneNumber);
    }

    public void setMobile(String mobile) {
        this.phone = cleanPhone(mobile);
    }

    public void setNumber(String number) {
        this.phone = cleanPhone(number);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    // This makes JSON {"otp":"123456"} work
    public void setOtp(String otp) {
        this.code = otp;
    }

    public String getOtp() {
        return code;
    }

    public void setOtpCode(String otpCode) {
        this.code = otpCode;
    }

    public void setVerificationCode(String verificationCode) {
        this.code = verificationCode;
    }

    private String cleanPhone(String value) {
        if (value == null) return null;

        String p = value.trim()
                .replace(" ", "")
                .replace("-", "")
                .replace("(", "")
                .replace(")", "");

        if (p.startsWith("+91")) {
            p = p.substring(3);
        } else if (p.startsWith("91") && p.length() == 12) {
            p = p.substring(2);
        }

        return p;
    }
}
