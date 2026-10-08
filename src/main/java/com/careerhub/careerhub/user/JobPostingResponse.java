package com.careerhub.careerhub.user;

public class JobPostingResponse {

    private Long id;
    private String title;
    private String type;
    private String city;
    private String workType;
    private String description;
    private String companyName;

    public JobPostingResponse(
            Long id,
            String title,
            String type,
            String city,
            String workType,
            String description,
            String companyName) {

        this.id = id;
        this.title = title;
        this.type = type;
        this.city = city;
        this.workType = workType;
        this.description = description;
        this.companyName = companyName;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getType() {
        return type;
    }

    public String getCity() {
        return city;
    }

    public String getWorkType() {
        return workType;
    }

    public String getDescription() {
        return description;
    }

    public String getCompanyName() {
        return companyName;
    }
}