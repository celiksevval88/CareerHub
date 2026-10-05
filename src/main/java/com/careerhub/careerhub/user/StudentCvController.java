package com.careerhub.careerhub.user;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student-cv")
public class StudentCvController {

    private final StudentCvService studentCvService;
    private final UserService userService;

    public StudentCvController(
            StudentCvService studentCvService,
            UserService userService) {

        this.studentCvService = studentCvService;
        this.userService = userService;
    }

    @PostMapping
    public StudentCvResponse createCv(
            @RequestBody StudentCvRequest request,
            Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());

        StudentCv cv = new StudentCv();

        cv.setUser(user);
        cv.setTitle(request.getTitle());
        cv.setAbout(request.getAbout());
        cv.setEducation(request.getEducation());
        cv.setSkills(request.getSkills());
        cv.setExperiences(request.getExperiences());
        cv.setProjects(request.getProjects());

        StudentCv savedCv = studentCvService.createCv(cv);

        return new StudentCvResponse(
                savedCv.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                savedCv.getTitle(),
                savedCv.getAbout(),
                savedCv.getEducation(),
                savedCv.getSkills(),
                savedCv.getExperiences(),
                savedCv.getProjects()
        );
    }
    @GetMapping
public StudentCvResponse getCv(Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    StudentCv cv = studentCvService.getCv(user);

    return new StudentCvResponse(
            cv.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            cv.getTitle(),
            cv.getAbout(),
            cv.getEducation(),
            cv.getSkills(),
            cv.getExperiences(),
            cv.getProjects()
    );
}
@PutMapping
public StudentCvResponse updateCv(
        @RequestBody StudentCvRequest request,
        Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    StudentCv updatedCv =
            studentCvService.updateCv(user, request);

    return new StudentCvResponse(
            updatedCv.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            updatedCv.getTitle(),
            updatedCv.getAbout(),
            updatedCv.getEducation(),
            updatedCv.getSkills(),
            updatedCv.getExperiences(),
            updatedCv.getProjects()
    );
}
}