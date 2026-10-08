package com.careerhub.careerhub.user;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobPostingService {

    private final JobPostingRepository jobPostingRepository;

    public JobPostingService(JobPostingRepository jobPostingRepository) {
        this.jobPostingRepository = jobPostingRepository;
    }

    public JobPosting createJobPosting(JobPosting jobPosting) {
        return jobPostingRepository.save(jobPosting);
    }

    public List<JobPosting> getCompanyJobPostings(Company company) {
        return jobPostingRepository.findByCompany(company);
    }
    public List<JobPosting> getAllJobPostings() {
    return jobPostingRepository.findAll();
}
public JobPosting updateJobPosting(
        Company company,
        Long id,
        JobPostingRequest request) {

    JobPosting jobPosting = jobPostingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("İlan bulunamadı"));

    if (!jobPosting.getCompany().getId().equals(company.getId())) {
        throw new RuntimeException("Bu ilanı güncelleme yetkiniz yok");
    }

    jobPosting.setTitle(request.getTitle());
    jobPosting.setType(request.getType());
    jobPosting.setCity(request.getCity());
    jobPosting.setWorkType(request.getWorkType());
    jobPosting.setDescription(request.getDescription());

    return jobPostingRepository.save(jobPosting);
}
public void deleteJobPosting(Company company, Long id) {

    JobPosting jobPosting = jobPostingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("İlan bulunamadı"));

    if (!jobPosting.getCompany().getId().equals(company.getId())) {
        throw new RuntimeException("Bu ilanı silme yetkiniz yok");
    }

    jobPostingRepository.delete(jobPosting);
}
}