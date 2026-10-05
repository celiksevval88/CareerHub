package com.careerhub.careerhub.user;

public class CompanyResponse {

    private Long id;
    private String companyName;
    private String sector;
    private String city;
    private String website;
    private String description;
    private String email;

    public CompanyResponse(
            Long id,
            String companyName,
            String sector,
            String city,
            String website,
            String description,
            String email) {

        this.id = id;
        this.companyName = companyName;
        this.sector = sector;
        this.city = city;
        this.website = website;
        this.description = description;
        this.email = email;
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

    public String getEmail() {
        return email;
    }
}