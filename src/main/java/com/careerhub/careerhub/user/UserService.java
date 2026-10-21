package com.careerhub.careerhub.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.time.LocalDateTime;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final JwtService jwtService;
        private final EmailVerificationService emailVerificationService;
        private final EmailSenderService emailSenderService;

        public UserService(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        JwtService jwtService,
                        EmailVerificationService emailVerificationService,
                        EmailSenderService emailSenderService) {

                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.jwtService = jwtService;
                this.emailVerificationService = emailVerificationService;
                this.emailSenderService = emailSenderService;
        }

        @Transactional
        public User createUser(User user, String verificationToken) {

                if (userRepository.findByEmail(user.getEmail()).isPresent()) {
                        throw new ResponseStatusException(
                                        HttpStatus.CONFLICT,
                                        "Bu e-posta adresi zaten kayıtlı.");
                }

                user.setPassword(passwordEncoder.encode(user.getPassword()));
                user.setEmailVerified(false);

                user.setEmailVerificationTokenHash(
                                emailVerificationService.hashToken(verificationToken));

                user.setEmailVerificationTokenExpiry(
                                LocalDateTime.now().plusHours(24));

                User savedUser = userRepository.save(user);

                emailSenderService.sendVerificationEmail(
                                savedUser.getEmail(),
                                savedUser.getFirstName(),
                                verificationToken);

                return savedUser;
        }

        public void verifyEmail(String token) {

                if (token == null || token.isBlank()) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Doğrulama tokenı boş olamaz.");
                }

                String tokenHash = emailVerificationService.hashToken(token);

                User user = userRepository
                                .findByEmailVerificationTokenHash(tokenHash)
                                .orElseThrow(() -> new ResponseStatusException(
                                                HttpStatus.BAD_REQUEST,
                                                "Doğrulama bağlantısı geçersiz veya daha önce kullanılmış."));

                LocalDateTime expiry = user.getEmailVerificationTokenExpiry();

                if (expiry == null || !expiry.isAfter(LocalDateTime.now())) {
                        throw new ResponseStatusException(
                                        HttpStatus.GONE,
                                        "Doğrulama bağlantısının süresi dolmuş.");
                }

                user.setEmailVerified(true);
                user.setEmailVerificationTokenHash(null);
                user.setEmailVerificationTokenExpiry(null);

                userRepository.save(user);
        }

        public LoginResponse login(LoginRequest request) {

                User user = userRepository.findByEmail(request.getEmail())
                                .orElseThrow(() -> new RuntimeException("Email veya şifre hatalı"));

                if (!user.isActive()) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Hesabınız devre dışı bırakılmış.");
                }

                if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                        throw new RuntimeException("Email veya şifre hatalı");
                }
                if (!Boolean.TRUE.equals(user.getEmailVerified())) {
                        throw new ResponseStatusException(
                                        HttpStatus.FORBIDDEN,
                                        "Giriş yapmadan önce e-posta adresini doğrulamalısın.");
                }

                String token = jwtService.generateToken(
                                user.getEmail(),
                                user.getRole());

                return new LoginResponse(
                                "Giriş başarılı",
                                user.getEmail(),
                                token);
        }

        public User getUserByEmail(String email) {

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));
        }

        @Transactional
        public User updateCvType(User user, String cvType) {

                if (!"CREATED".equals(cvType)
                                && !"UPLOADED".equals(cvType)) {
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST,
                                        "Geçersiz CV türü seçildi.");
                }

                user.setCvType(cvType);

                return userRepository.save(user);
        }
}