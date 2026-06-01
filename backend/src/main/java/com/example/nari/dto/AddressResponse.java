
package com.example.nari.dto;

import java.time.LocalDateTime;

public class AddressResponse {

    private Long id;
    private Long consumerId;
    private String fullName;
    private String phoneNumber;
    private String addressLine;
    private String landmark;
    private String city;
    private String state;
    private String pincode;
    private String addressType;
    private Boolean isDefault;
    private LocalDateTime createdAt;

    public AddressResponse(Long id, Long consumerId, String fullName, String phoneNumber,
                           String addressLine, String landmark, String city, String state,
                           String pincode, String addressType, Boolean isDefault,
                           LocalDateTime createdAt) {
        this.id = id;
        this.consumerId = consumerId;
        this.fullName = fullName;
        this.phoneNumber = phoneNumber;
        this.addressLine = addressLine;
        this.landmark = landmark;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.addressType = addressType;
        this.isDefault = isDefault;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() { return id; }
    public Long getConsumerId() { return consumerId; }
    public String getFullName() { return fullName; }
    public String getPhoneNumber() { return phoneNumber; }
    public String getAddressLine() { return addressLine; }
    public String getLandmark() { return landmark; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getPincode() { return pincode; }
    public String getAddressType() { return addressType; }
    public Boolean getIsDefault() { return isDefault; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}