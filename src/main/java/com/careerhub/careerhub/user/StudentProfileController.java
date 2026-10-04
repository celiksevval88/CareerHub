package com.careerhub.careerhub.user;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student-profile")
public class StudentProfileController {

    private final StudentProfileService studentProfileService;
    private final UserService userService;

    public StudentProfileController(
            StudentProfileService studentProfileService,
            UserService userService) {

        this.studentProfileService = studentProfileService;
        this.userService = userService;
    }

   @PostMapping
public StudentProfileResponse createProfile(
        @RequestBody StudentProfile profile,
        Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    profile.setUser(user);

    StudentProfile savedProfile =
            studentProfileService.createProfile(profile);

    return new StudentProfileResponse(
            savedProfile.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            savedProfile.getUniversity(),
            savedProfile.getDepartment(),
            savedProfile.getClassYear(),
            savedProfile.getPhone(),
            savedProfile.getBio()
    );
}
@GetMapping
public StudentProfileResponse getProfile(Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    StudentProfile profile = studentProfileService.getProfile(user);

    return new StudentProfileResponse(
            profile.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            profile.getUniversity(),
            profile.getDepartment(),
            profile.getClassYear(),
            profile.getPhone(),
            profile.getBio()
    );
}
@PutMapping
public StudentProfileResponse updateProfile(
        @RequestBody StudentProfileRequest request,
        Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    StudentProfile updatedProfile =
            studentProfileService.updateProfile(user, request);

    return new StudentProfileResponse(
            updatedProfile.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            updatedProfile.getUniversity(),
            updatedProfile.getDepartment(),
            updatedProfile.getClassYear(),
            updatedProfile.getPhone(),
            updatedProfile.getBio()
    );
}
}