package com.careerhub.careerhub.user;

public class StudentCvResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String title;
    private String about;
    private String education;
    private String skills;
    private String experiences;
    private String projects;

    public StudentCvResponse(
            Long id,
            String firstName,
            String lastName,
            String email,
            String title,
            String about,
            String education,
            String skills,
            String experiences,
            String projects) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.title = title;
        this.about = about;
        this.education = education;
        this.skills = skills;
        this.experiences = experiences;
        this.projects = projects;
    }

    public Long getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getTitle() {
        return title;
    }

    public String getAbout() {
        return about;
    }

    public String getEducation() {
        return education;
    }

    public String getSkills() {
        return skills;
    }

    public String getExperiences() {
        return experiences;
    }

    public String getProjects() {
        return projects;
    }
}