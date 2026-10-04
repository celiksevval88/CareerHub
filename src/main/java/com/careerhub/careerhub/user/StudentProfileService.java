package com.careerhub.careerhub.user;

import org.springframework.stereotype.Service;

@Service
public class StudentProfileService {

    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileService(StudentProfileRepository studentProfileRepository) {
        this.studentProfileRepository = studentProfileRepository;
    }

    public StudentProfile createProfile(StudentProfile profile) {

        return studentProfileRepository.save(profile);
    }

    public StudentProfile getProfile(User user) {

        return studentProfileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Öğrenci profili bulunamadı"));
    }
}