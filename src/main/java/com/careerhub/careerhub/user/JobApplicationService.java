package com.careerhub.careerhub.user;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobApplicationService {

    private final JobApplicationRepository jobApplicationRepository;
    private final JobPostingRepository jobPostingRepository;

    public JobApplicationService(
            JobApplicationRepository jobApplicationRepository,
            JobPostingRepository jobPostingRepository) {

        this.jobApplicationRepository = jobApplicationRepository;
        this.jobPostingRepository = jobPostingRepository;
    }

    public JobApplication createApplication(User student, JobPosting jobPosting) {

        if (jobApplicationRepository.existsByStudentAndJobPosting(student, jobPosting)) {
            throw new RuntimeException("Bu ilana daha önce başvurdunuz");
        }

        JobApplication application = new JobApplication();

        application.setStudent(student);
        application.setJobPosting(jobPosting);
        application.setStatus("BEKLEMEDE");
        application.setApplicationDate(LocalDateTime.now());

        return jobApplicationRepository.save(application);
    }

    public List<JobApplication> getStudentApplications(User student) {
        return jobApplicationRepository.findByStudent(student);
    }

    public List<JobApplication> getJobApplications(JobPosting jobPosting) {
        return jobApplicationRepository.findByJobPosting(jobPosting);
    }

    public List<JobApplication> getApplicationsForCompany(Company company) {

        List<JobApplication> applications = new java.util.ArrayList<>();

        List<JobPosting> jobPostings =
                jobPostingRepository.findByCompany(company);

        for (JobPosting jobPosting : jobPostings) {

            applications.addAll(
                    jobApplicationRepository.findByJobPosting(jobPosting)
            );
        }

        return applications;
    }

    public JobApplication updateApplicationStatus(
            Company company,
            Long applicationId,
            String status) {

        if (!status.equals("BEKLEMEDE")
                && !status.equals("DEĞERLENDİRİLİYOR")
                && !status.equals("KABUL_EDİLDİ")
                && !status.equals("REDDEDİLDİ")) {

            throw new RuntimeException("Geçersiz başvuru durumu");
        }

        JobApplication application =
                jobApplicationRepository.findById(applicationId)
                        .orElseThrow(() ->
                                new RuntimeException("Başvuru bulunamadı"));

        if (!application.getJobPosting()
                .getCompany()
                .getId()
                .equals(company.getId())) {

            throw new RuntimeException(
                    "Bu başvuruyu güncelleme yetkiniz yok");
        }

        application.setStatus(status);

        return jobApplicationRepository.save(application);
    }
}