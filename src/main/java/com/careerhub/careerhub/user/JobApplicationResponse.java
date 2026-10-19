package com.careerhub.careerhub.user;

import java.time.LocalDateTime;

public class JobApplicationResponse {

    private Long id;
    private Long jobPostingId;
    private String jobTitle;
    private String companyName;
    private String studentFirstName;
    private String studentLastName;
    private String studentEmail;
    private String studentCvType;
    private String status;
    private LocalDateTime applicationDate;

    public JobApplicationResponse(
            Long id,
            Long jobPostingId,
            String jobTitle,
            String companyName,
            String studentFirstName,
            String studentLastName,
            String studentEmail,
            String studentCvType,
            String status,
            LocalDateTime applicationDate) {

        this.id = id;
        this.jobPostingId = jobPostingId;
        this.jobTitle = jobTitle;
        this.companyName = companyName;
        this.studentFirstName = studentFirstName;
        this.studentLastName = studentLastName;
        this.studentEmail = studentEmail;
        this.studentCvType = studentCvType;
        this.status = status;
        this.applicationDate = applicationDate;
    }

    public Long getId() {
        return id;
    }

    public Long getJobPostingId() {
        return jobPostingId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public String getStudentFirstName() {
        return studentFirstName;
    }

    public String getStudentLastName() {
        return studentLastName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public String getStudentCvType() {
        return studentCvType;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getApplicationDate() {
        return applicationDate;
    }
}