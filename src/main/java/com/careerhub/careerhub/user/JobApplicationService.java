package com.careerhub.careerhub.user;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class JobApplicationService {

        private final JobApplicationRepository jobApplicationRepository;
        private final JobPostingRepository jobPostingRepository;
        private final NotificationService notificationService;

        public JobApplicationService(
                        JobApplicationRepository jobApplicationRepository,
                        JobPostingRepository jobPostingRepository,
                        NotificationService notificationService) {

                this.jobApplicationRepository = jobApplicationRepository;
                this.jobPostingRepository = jobPostingRepository;
                this.notificationService = notificationService;
        }

        public JobApplication createApplication(
                        User student,
                        JobPosting jobPosting) {

                if (jobApplicationRepository
                                .existsByStudentAndJobPosting(student, jobPosting)) {

                        throw new RuntimeException(
                                        "Bu ilana daha önce başvurdunuz");
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

        public void withdrawApplication(User student, Long applicationId) {

                JobApplication application = jobApplicationRepository.findById(applicationId)
                                .orElseThrow(() -> new RuntimeException("Başvuru bulunamadı"));

                if (!application.getStudent().getId().equals(student.getId())) {
                        throw new RuntimeException("Bu başvuruyu geri çekme yetkiniz yok");
                }

                if ("KABUL_EDİLDİ".equals(application.getStatus())
                                || "REDDEDİLDİ".equals(application.getStatus())
                                || "GERİ_ÇEKİLDİ".equals(application.getStatus())) {
                        throw new RuntimeException("Bu başvuru artık geri çekilemez");
                }

                application.setStatus("GERİ_ÇEKİLDİ");
                jobApplicationRepository.save(application);
        }

        public List<JobApplication> getJobApplications(JobPosting jobPosting) {
                return jobApplicationRepository.findByJobPosting(jobPosting);
        }

        public List<JobApplication> getApplicationsForCompany(
                        Company company) {

                List<JobApplication> applications = new java.util.ArrayList<>();

                List<JobPosting> jobPostings = jobPostingRepository.findByCompany(company);

                for (JobPosting jobPosting : jobPostings) {
                        applications.addAll(
                                        jobApplicationRepository
                                                        .findByJobPosting(jobPosting));
                }

                return applications;
        }

        // Şirketin yalnızca kendi ilanlarına ait başvuruyu açmasını sağla
        public JobApplication getApplicationForCompany(
                        Company company,
                        Long applicationId) {

                JobApplication application = jobApplicationRepository.findById(applicationId)
                                .orElseThrow(() -> new RuntimeException("Başvuru bulunamadı"));

                if (!application.getJobPosting()
                                .getCompany()
                                .getId()
                                .equals(company.getId())) {

                        throw new RuntimeException(
                                        "Bu başvuruyu görüntüleme yetkiniz yok");
                }

                return application;
        }

        public JobApplication updateApplicationStatus(
                        Company company,
                        Long applicationId,
                        String status) {

                if (!"BEKLEMEDE".equals(status)
                                && !"DEĞERLENDİRİLİYOR".equals(status)
                                && !"KABUL_EDİLDİ".equals(status)
                                && !"REDDEDİLDİ".equals(status)) {

                        throw new RuntimeException(
                                        "Geçersiz başvuru durumu");
                }

                JobApplication application = jobApplicationRepository.findById(applicationId)
                                .orElseThrow(() -> new RuntimeException(
                                                "Başvuru bulunamadı"));

                if (!application.getJobPosting()
                                .getCompany()
                                .getId()
                                .equals(company.getId())) {

                        throw new RuntimeException(
                                        "Bu başvuruyu güncelleme yetkiniz yok");
                }

                String previousStatus = application.getStatus();

                application.setStatus(status);

                JobApplication updatedApplication = jobApplicationRepository.save(application);

                if (!status.equals(previousStatus)) {

                        String message = application.getJobPosting().getTitle()
                                        + " ilanındaki başvurunuzun durumu "
                                        + status
                                        + " olarak güncellendi.";

                        notificationService.createNotification(
                                        application.getStudent(),
                                        message);
                }

                return updatedApplication;
        }
}