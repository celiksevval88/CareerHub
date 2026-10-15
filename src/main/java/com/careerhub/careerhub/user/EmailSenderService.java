package com.careerhub.careerhub.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    public EmailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(
            String recipientEmail,
            String firstName,
            String token) {

        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalStateException(
                    "E-posta gönderici adresi yapılandırılmamış."
            );
        }

        String verificationLink =
                baseUrl + "/api/users/verify-email?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom(fromEmail);
        message.setTo(recipientEmail);
        message.setSubject("CareerHub - E-posta adresini doğrula");

        message.setText(
                "Merhaba " + firstName + ",\n\n"
                + "CareerHub hesabını doğrulamak için aşağıdaki bağlantıya tıkla:\n\n"
                + verificationLink + "\n\n"
                + "Bu bağlantı 24 saat geçerlidir.\n\n"
                + "CareerHub Ekibi"
        );

        mailSender.send(message);
    }
}