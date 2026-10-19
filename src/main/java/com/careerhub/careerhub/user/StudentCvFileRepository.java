package com.careerhub.careerhub.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentCvFileRepository
        extends JpaRepository<StudentCvFile, Long> {

    Optional<StudentCvFile> findByUser(User user);
}