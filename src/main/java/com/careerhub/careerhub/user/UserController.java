package com.careerhub.careerhub.user;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponse createUser(@Valid @RequestBody UserRequest request) {

        User user = new User();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());

        User savedUser = userService.createUser(user);

        return new UserResponse(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
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
            user.getRole()
    );
}
}