package com.careerhub.careerhub.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    List<JobApplication> findByStudent(User student);

    List<JobApplication> findByJobPosting(JobPosting jobPosting);

    boolean existsByStudentAndJobPosting(User student, JobPosting jobPosting);
}