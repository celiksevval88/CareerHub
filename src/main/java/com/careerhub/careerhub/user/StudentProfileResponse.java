package com.careerhub.careerhub.user;

public class StudentProfileResponse {

    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String university;
    private String department;
    private Integer classYear;
    private String phone;
    private String bio;

    public StudentProfileResponse(
            Long id,
            String firstName,
            String lastName,
            String email,
            String university,
            String department,
            Integer classYear,
            String phone,
            String bio) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.university = university;
        this.department = department;
        this.classYear = classYear;
        this.phone = phone;
        this.bio = bio;
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

    public String getUniversity() {
        return university;
    }

    public String getDepartment() {
        return department;
    }

    public Integer getClassYear() {
        return classYear;
    }

    public String getPhone() {
        return phone;
    }

    public String getBio() {
        return bio;
    }
}