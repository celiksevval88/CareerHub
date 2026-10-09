package com.careerhub.careerhub.user;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;


import java.util.List;

@RestController
@RequestMapping("/api/job-postings")
public class JobPostingController {

    private final JobPostingService jobPostingService;
    private final UserService userService;
    private final CompanyService companyService;

    public JobPostingController(
            JobPostingService jobPostingService,
            UserService userService,
            CompanyService companyService) {

        this.jobPostingService = jobPostingService;
        this.userService = userService;
        this.companyService = companyService;
    }

    @PostMapping
    public JobPostingResponse createJobPosting(
            @Valid @RequestBody JobPostingRequest request,
            Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());

        Company company = companyService.getCompany(user);

        JobPosting jobPosting = new JobPosting();

        jobPosting.setCompany(company);
        jobPosting.setTitle(request.getTitle());
        jobPosting.setType(request.getType());
        jobPosting.setCity(request.getCity());
        jobPosting.setWorkType(request.getWorkType());
        jobPosting.setDescription(request.getDescription());

        JobPosting savedJobPosting =
                jobPostingService.createJobPosting(jobPosting);

        return new JobPostingResponse(
                savedJobPosting.getId(),
                savedJobPosting.getTitle(),
                savedJobPosting.getType(),
                savedJobPosting.getCity(),
                savedJobPosting.getWorkType(),
                savedJobPosting.getDescription(),
                company.getCompanyName()
        );
    }

    @GetMapping("/company")
    public List<JobPostingResponse> getCompanyJobPostings(
            Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());

        Company company = companyService.getCompany(user);

        List<JobPosting> jobPostings =
                jobPostingService.getCompanyJobPostings(company);

        return jobPostings.stream()
                .map(jobPosting -> new JobPostingResponse(
                        jobPosting.getId(),
                        jobPosting.getTitle(),
                        jobPosting.getType(),
                        jobPosting.getCity(),
                        jobPosting.getWorkType(),
                        jobPosting.getDescription(),
                        company.getCompanyName()
                ))
                .toList();
    }
    @GetMapping
public List<JobPostingResponse> getAllJobPostings() {

    List<JobPosting> jobPostings =
            jobPostingService.getAllJobPostings();

    return jobPostings.stream()
            .map(jobPosting -> new JobPostingResponse(
                    jobPosting.getId(),
                    jobPosting.getTitle(),
                    jobPosting.getType(),
                    jobPosting.getCity(),
                    jobPosting.getWorkType(),
                    jobPosting.getDescription(),
                    jobPosting.getCompany().getCompanyName()
            ))
            .toList();
}
@PutMapping("/{id}")
public JobPostingResponse updateJobPosting(
        @PathVariable Long id,
        @Valid @RequestBody JobPostingRequest request,
        Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    Company company = companyService.getCompany(user);

    JobPosting updatedJobPosting =
            jobPostingService.updateJobPosting(company, id, request);

    return new JobPostingResponse(
            updatedJobPosting.getId(),
            updatedJobPosting.getTitle(),
            updatedJobPosting.getType(),
            updatedJobPosting.getCity(),
            updatedJobPosting.getWorkType(),
            updatedJobPosting.getDescription(),
            company.getCompanyName()
    );
}
@DeleteMapping("/{id}")
public String deleteJobPosting(
        @PathVariable Long id,
        Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    Company company = companyService.getCompany(user);

    jobPostingService.deleteJobPosting(company, id);

    return "İlan başarıyla silindi";
}

}