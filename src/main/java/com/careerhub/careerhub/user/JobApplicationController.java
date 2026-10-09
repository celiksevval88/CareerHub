package com.careerhub.careerhub.user;


import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {

    private final JobApplicationService jobApplicationService;
    private final UserService userService;
    private final JobPostingRepository jobPostingRepository;
    private final CompanyService companyService;

    public JobApplicationController(
            JobApplicationService jobApplicationService,
            UserService userService,
            JobPostingRepository jobPostingRepository,
            CompanyService companyService) {

        this.jobApplicationService = jobApplicationService;
        this.userService = userService;
        this.jobPostingRepository = jobPostingRepository;
        this.companyService = companyService;
    }

    @PostMapping
    public JobApplicationResponse createApplication(
            @RequestBody JobApplicationRequest request,
            Authentication authentication) {

        User student =
                userService.getUserByEmail(authentication.getName());

        JobPosting jobPosting =
                jobPostingRepository.findById(request.getJobPostingId())
                        .orElseThrow(() ->
                                new RuntimeException("İlan bulunamadı"));

        JobApplication application =
                jobApplicationService.createApplication(
                        student,
                        jobPosting
                );

        return new JobApplicationResponse(
                application.getId(),
                jobPosting.getId(),
                jobPosting.getTitle(),
                jobPosting.getCompany().getCompanyName(),
                student.getFirstName(),
                student.getLastName(),
                student.getEmail(),
                application.getStatus(),
                application.getApplicationDate()
        );
    }

    @GetMapping("/student")
    public List<JobApplicationResponse> getStudentApplications(
            Authentication authentication) {

        User student =
                userService.getUserByEmail(authentication.getName());

        List<JobApplication> applications =
                jobApplicationService.getStudentApplications(student);

        return applications.stream()
                .map(application -> new JobApplicationResponse(
                        application.getId(),
                        application.getJobPosting().getId(),
                        application.getJobPosting().getTitle(),
                        application.getJobPosting().getCompany().getCompanyName(),
                        student.getFirstName(),
                        student.getLastName(),
                        student.getEmail(),
                        application.getStatus(),
                        application.getApplicationDate()
                ))
                .toList();
    }

    @GetMapping("/company")
    public List<JobApplicationResponse> getCompanyApplications(
            Authentication authentication) {

        User user =
                userService.getUserByEmail(authentication.getName());

        Company company =
                companyService.getCompany(user);

        List<JobApplication> applications =
                jobApplicationService.getApplicationsForCompany(company);

        return applications.stream()
                .map(application -> new JobApplicationResponse(
                        application.getId(),
                        application.getJobPosting().getId(),
                        application.getJobPosting().getTitle(),
                        application.getJobPosting().getCompany().getCompanyName(),
                        application.getStudent().getFirstName(),
                        application.getStudent().getLastName(),
                        application.getStudent().getEmail(),
                        application.getStatus(),
                        application.getApplicationDate()
                ))
                .toList();
    }

    @PutMapping("/{applicationId}/status")
    public JobApplicationResponse updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam String status,
            Authentication authentication) {

        User user =
                userService.getUserByEmail(authentication.getName());

        Company company =
                companyService.getCompany(user);

        JobApplication updatedApplication =
                jobApplicationService.updateApplicationStatus(
                        company,
                        applicationId,
                        status
                );

        return new JobApplicationResponse(
                updatedApplication.getId(),
                updatedApplication.getJobPosting().getId(),
                updatedApplication.getJobPosting().getTitle(),
                updatedApplication.getJobPosting().getCompany().getCompanyName(),
                updatedApplication.getStudent().getFirstName(),
                updatedApplication.getStudent().getLastName(),
                updatedApplication.getStudent().getEmail(),
                updatedApplication.getStatus(),
                updatedApplication.getApplicationDate()
        );
    }
}