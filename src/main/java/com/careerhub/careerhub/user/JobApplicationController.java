package com.careerhub.careerhub.user;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;
import java.io.IOException;

@RestController
@RequestMapping("/api/job-applications")
public class JobApplicationController {

        private final JobApplicationService jobApplicationService;
        private final UserService userService;
        private final JobPostingRepository jobPostingRepository;
        private final CompanyService companyService;
        private final StudentCvFileService studentCvFileService;

        public JobApplicationController(
                        JobApplicationService jobApplicationService,
                        UserService userService,
                        JobPostingRepository jobPostingRepository,
                        CompanyService companyService,
                        StudentCvFileService studentCvFileService) {

                this.jobApplicationService = jobApplicationService;
                this.userService = userService;
                this.jobPostingRepository = jobPostingRepository;
                this.companyService = companyService;
                this.studentCvFileService = studentCvFileService;
        }

        @PostMapping
        public JobApplicationResponse createApplication(
                        @Valid @RequestBody JobApplicationRequest request,
                        Authentication authentication) {

                User student = userService.getUserByEmail(authentication.getName());

                JobPosting jobPosting = jobPostingRepository.findById(request.getJobPostingId())
                                .orElseThrow(() -> new RuntimeException("İlan bulunamadı"));

                JobApplication application = jobApplicationService.createApplication(
                                student,
                                jobPosting);

                return new JobApplicationResponse(
                                application.getId(),
                                jobPosting.getId(),
                                jobPosting.getTitle(),
                                jobPosting.getCompany().getCompanyName(),
                                student.getFirstName(),
                                student.getLastName(),
                                student.getEmail(),
                                student.getCvType(),
                                application.getStatus(),
                                application.getApplicationDate());
        }

        @GetMapping("/student")
        public List<JobApplicationResponse> getStudentApplications(
                        Authentication authentication) {

                User student = userService.getUserByEmail(authentication.getName());

                List<JobApplication> applications = jobApplicationService.getStudentApplications(student);

                return applications.stream()
                                .map(application -> new JobApplicationResponse(
                                                application.getId(),
                                                application.getJobPosting().getId(),
                                                application.getJobPosting().getTitle(),
                                                application.getJobPosting().getCompany().getCompanyName(),
                                                student.getFirstName(),
                                                student.getLastName(),
                                                student.getEmail(),
                                                student.getCvType(),
                                                application.getStatus(),
                                                application.getApplicationDate()))
                                .toList();
        }

        @GetMapping("/company")
        public List<JobApplicationResponse> getCompanyApplications(
                        Authentication authentication) {

                User user = userService.getUserByEmail(authentication.getName());

                Company company = companyService.getCompany(user);

                List<JobApplication> applications = jobApplicationService.getApplicationsForCompany(company);

                return applications.stream()
                                .map(application -> new JobApplicationResponse(
                                                application.getId(),
                                                application.getJobPosting().getId(),
                                                application.getJobPosting().getTitle(),
                                                application.getJobPosting().getCompany().getCompanyName(),
                                                application.getStudent().getFirstName(),
                                                application.getStudent().getLastName(),
                                                application.getStudent().getEmail(),
                                                application.getStudent().getCvType(),
                                                application.getStatus(),
                                                application.getApplicationDate()))
                                .toList();
        }

        @PutMapping("/{applicationId}/status")
        public JobApplicationResponse updateApplicationStatus(
                        @PathVariable Long applicationId,
                        @RequestParam String status,
                        Authentication authentication) {

                User user = userService.getUserByEmail(authentication.getName());

                Company company = companyService.getCompany(user);

                JobApplication updatedApplication = jobApplicationService.updateApplicationStatus(
                                company,
                                applicationId,
                                status);

                return new JobApplicationResponse(
                                updatedApplication.getId(),
                                updatedApplication.getJobPosting().getId(),
                                updatedApplication.getJobPosting().getTitle(),
                                updatedApplication.getJobPosting().getCompany().getCompanyName(),
                                updatedApplication.getStudent().getFirstName(),
                                updatedApplication.getStudent().getLastName(),
                                updatedApplication.getStudent().getEmail(),
                                updatedApplication.getStudent().getCvType(),
                                updatedApplication.getStatus(),
                                updatedApplication.getApplicationDate());
        }

        @PutMapping("/{applicationId}/withdraw")
        public void withdrawApplication(
                        Authentication authentication,
                        @PathVariable Long applicationId) {

                User student = userService.getUserByEmail(authentication.getName());

                jobApplicationService.withdrawApplication(student, applicationId);
        }

        // Şirket, kendi ilanına başvuran öğrencinin PDF CV'sini indirir
        @GetMapping("/{applicationId}/student-cv")
        public ResponseEntity<Resource> downloadStudentCv(
                        @PathVariable Long applicationId,
                        Authentication authentication) throws IOException {

                User user = userService.getUserByEmail(authentication.getName());

                Company company = companyService.getCompany(user);

                JobApplication application = jobApplicationService.getApplicationForCompany(
                                company,
                                applicationId);

                User student = application.getStudent();

                StudentCvFile cvFile = studentCvFileService.getByUser(student);

                if (cvFile == null) {
                        return ResponseEntity.notFound().build();
                }

                Path filePath;

                try {
                        filePath = studentCvFileService.getFilePath(student);
                } catch (IllegalArgumentException exception) {
                        return ResponseEntity.notFound().build();
                }

                Resource resource = new UrlResource(filePath.toUri());

                if (!resource.exists() || !resource.isReadable()) {
                        return ResponseEntity.notFound().build();
                }

                ContentDisposition disposition = ContentDisposition
                                .attachment()
                                .filename(
                                                cvFile.getOriginalFileName(),
                                                StandardCharsets.UTF_8)
                                .build();

                return ResponseEntity.ok()
                                .contentType(MediaType.APPLICATION_PDF)
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                disposition.toString())
                                .body(resource);
        }
}