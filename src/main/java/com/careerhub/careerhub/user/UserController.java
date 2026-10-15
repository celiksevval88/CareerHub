package com.careerhub.careerhub.user;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final EmailVerificationService emailVerificationService;

    public UserController(
            UserService userService,
            EmailVerificationService emailVerificationService) {

        this.userService = userService;
        this.emailVerificationService = emailVerificationService;
    }

    @PostMapping
    public UserResponse createUser(@Valid @RequestBody UserRequest request) {

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        String role = request.getRole();

        if (role == null ||
                (!role.equalsIgnoreCase("STUDENT")
                        && !role.equalsIgnoreCase("COMPANY"))) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Rol STUDENT veya COMPANY olmalıdır.");
        }

        user.setRole(role.toUpperCase());

        String verificationToken = emailVerificationService.generateToken();

        User savedUser = userService.createUser(user, verificationToken);
        return new UserResponse(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole());
    }

    @GetMapping("/verify-email")
    public String verifyEmail(@RequestParam("token") String token) {

        userService.verifyEmail(token);

        return "E-posta adresin başarıyla doğrulandı.";
    }

    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        return userService.login(request);
    }

    @GetMapping("/test")
    public String test() {
        return "JWT doğrulama başarılı";
    }

    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {

        User user = userService.getUserByEmail(authentication.getName());

        return new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole());
    }

    @GetMapping("/student")
    public String student() {
        return "Student endpointine erişildi";
    }

    @GetMapping("/admin")
    public String admin() {
        return "Admin endpointine erişildi";
    }
}