package com.careerhub.careerhub.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentCvRepository extends JpaRepository<StudentCv, Long> {

    Optional<StudentCv> findByUser(User user);
}