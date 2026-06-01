package com.example.nari.dto;

public class ConsumerProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String profileImage;

    public ConsumerProfileResponse() {
    }

    public ConsumerProfileResponse(Long id, String fullName, String email,
            String phone, String profileImage) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.profileImage = profileImage;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }
}
