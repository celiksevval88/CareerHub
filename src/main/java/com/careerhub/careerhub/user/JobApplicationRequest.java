package com.careerhub.careerhub.user;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class JobApplicationRequest {

    @NotNull(message = "İlan ID boş bırakılamaz")
    @Positive(message = "İlan ID pozitif bir sayı olmalıdır")
    private Long jobPostingId;

    public Long getJobPostingId() {
        return jobPostingId;
    }

    public void setJobPostingId(Long jobPostingId) {
        this.jobPostingId = jobPostingId;
    }
}