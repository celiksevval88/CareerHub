package com.careerhub.careerhub.user;

import org.springframework.stereotype.Service;

@Service
public class StudentCvService {

    private final StudentCvRepository studentCvRepository;

    public StudentCvService(StudentCvRepository studentCvRepository) {
        this.studentCvRepository = studentCvRepository;
    }

    public StudentCv createCv(StudentCv cv) {

        return studentCvRepository.save(cv);
    }

    public StudentCv getCv(User user) {

        return studentCvRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Öğrenci CV'si bulunamadı"));
    }
    public StudentCv updateCv(User user, StudentCvRequest request) {

    StudentCv cv = studentCvRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Öğrenci CV'si bulunamadı"));

    cv.setTitle(request.getTitle());
    cv.setAbout(request.getAbout());
    cv.setEducation(request.getEducation());
    cv.setSkills(request.getSkills());
    cv.setExperiences(request.getExperiences());
    cv.setProjects(request.getProjects());

    return studentCvRepository.save(cv);
}
}