package com.careerhub.careerhub.user;

import java.time.LocalDateTime;

public class StudentCvFileResponse {

    private Long id;
    private String originalFileName;
    private Long fileSize;
    private LocalDateTime uploadedAt;

    public StudentCvFileResponse(
            Long id,
            String originalFileName,
            Long fileSize,
            LocalDateTime uploadedAt) {

        this.id = id;
        this.originalFileName = originalFileName;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
    }

    public Long getId() {
        return id;
    }

    public String getOriginalFileName() {
        return originalFileName;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public LocalDateTime getUploadedAt() {
        return uploadedAt;
    }
}