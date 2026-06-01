package com.example.nari.dto;

public class VendorProfileResponse {

    private Long id;
    private String shgName;
    private String leaderName;
    private String email;
    private String mobileNumber;
    private String village;
    private String district;
    private String state;
    private String category;
    private String members;
    private String profileImage;
    private String approvalStatus;

    public VendorProfileResponse(Long id, String shgName, String leaderName, String email,
                                  String mobileNumber, String village, String district,
                                  String state, String category, String members,
                                  String profileImage, String approvalStatus) {
        this.id = id;
        this.shgName = shgName;
        this.leaderName = leaderName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.village = village;
        this.district = district;
        this.state = state;
        this.category = category;
        this.members = members;
        this.profileImage = profileImage;
        this.approvalStatus = approvalStatus;
    }

    // Getters
    public Long getId() { return id; }
    public String getShgName() { return shgName; }
    public String getLeaderName() { return leaderName; }
    public String getEmail() { return email; }
    public String getMobileNumber() { return mobileNumber; }
    public String getVillage() { return village; }
    public String getDistrict() { return district; }
    public String getState() { return state; }
    public String getCategory() { return category; }
    public String getMembers() { return members; }
    public String getProfileImage() { return profileImage; }
    public String getApprovalStatus() { return approvalStatus; }
}