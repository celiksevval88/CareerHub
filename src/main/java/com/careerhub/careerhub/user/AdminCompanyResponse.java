package com.careerhub.careerhub.user;

public class AdminCompanyResponse {

    private Long id;
    private String companyName;
    private String sector;
    private String city;
    private String website;
    private String description;
    private String userEmail;
    private String approvalStatus;

    public AdminCompanyResponse(
            Long id,
            String companyName,
            String sector,
            String city,
            String website,
            String description,
            String userEmail,
            String approvalStatus) {

        this.id = id;
        this.companyName = companyName;
        this.sector = sector;
        this.city = city;
        this.website = website;
        this.description = description;
        this.userEmail = userEmail;
        this.approvalStatus = approvalStatus;
    }

    public Long getId() {
        return id;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getSector() {
        return sector;
    }

    public String getCity() {
        return city;
    }

    public String getWebsite() {
        return website;
    }

    public String getDescription() {
        return description;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }
}