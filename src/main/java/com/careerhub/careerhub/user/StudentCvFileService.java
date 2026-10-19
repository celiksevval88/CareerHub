package com.careerhub.careerhub.user;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class StudentCvFileService {

    private static final long MAX_FILE_SIZE = 5L * 1024 * 1024;

    private final StudentCvFileRepository repository;
    private final Path uploadDirectory;

    public StudentCvFileService(
            StudentCvFileRepository repository,
            @Value("${app.upload.student-cv-dir:uploads/student-cvs}") String uploadDirectory) {

        this.repository = repository;

        this.uploadDirectory = Paths.get(uploadDirectory)
                .toAbsolutePath()
                .normalize();
    }

    @Transactional
    public StudentCvFile upload(User user, MultipartFile file)
            throws IOException {

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException(
                    "Lütfen bir PDF dosyası seç.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException(
                    "CV dosyası en fazla 5 MB olabilir.");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null || originalFileName.isBlank()) {
            throw new IllegalArgumentException(
                    "Dosya adı geçerli değil.");
        }

        originalFileName = originalFileName.replace("\\", "/");
        originalFileName = originalFileName.substring(
                originalFileName.lastIndexOf('/') + 1).trim();

        if (!originalFileName.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException(
                    "Yalnızca PDF dosyaları yüklenebilir.");
        }

        byte[] content = file.getBytes();

        String pdfSignature = new String(
                content,
                0,
                Math.min(content.length, 5),
                StandardCharsets.US_ASCII);

        if (!pdfSignature.startsWith("%PDF-")) {
            throw new IllegalArgumentException(
                    "Seçilen dosya geçerli bir PDF gibi görünmüyor.");
        }

        Files.createDirectories(uploadDirectory);

        String storedFileName = UUID.randomUUID() + ".pdf";

        Path target = uploadDirectory.resolve(storedFileName).normalize();

        if (!target.startsWith(uploadDirectory)) {
            throw new IllegalArgumentException(
                    "Geçersiz dosya yolu.");
        }

        Files.write(
                target,
                content,
                StandardOpenOption.CREATE_NEW);

        StudentCvFile cvFile = repository.findByUser(user)
                .orElseGet(() -> {
                    StudentCvFile newFile = new StudentCvFile();
                    newFile.setUser(user);
                    return newFile;
                });

        String previousFileName = cvFile.getStoredFileName();

        cvFile.setOriginalFileName(originalFileName);
        cvFile.setStoredFileName(storedFileName);
        cvFile.setFileSize((long) content.length);
        cvFile.setUploadedAt(LocalDateTime.now());

        try {
            StudentCvFile savedFile = repository.save(cvFile);

            if (previousFileName != null
                    && !previousFileName.equals(storedFileName)) {
                try {
                    Files.deleteIfExists(
                            uploadDirectory.resolve(previousFileName).normalize());
                } catch (IOException ignored) {
                    // Eski dosyanın silinememesi yeni kaydı engellemez.
                }
            }

            return savedFile;

        } catch (RuntimeException exception) {
            Files.deleteIfExists(target);
            throw exception;
        }
    }

    // Öğrencinin daha önce yüklediği CV dosyasını bul
    public StudentCvFile getByUser(User user) {
        return repository.findByUser(user).orElse(null);
    }

    // Öğrencinin yüklediği PDF dosyasının konumunu bul
    public Path getFilePath(User user) {
        StudentCvFile cvFile = repository.findByUser(user)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Henüz PDF CV yüklemediniz."));

        Path filePath = uploadDirectory
                .resolve(cvFile.getStoredFileName())
                .normalize();

        if (!filePath.startsWith(uploadDirectory)
                || !Files.isRegularFile(filePath)) {
            throw new IllegalArgumentException(
                    "Yüklenen CV dosyası bulunamadı.");
        }

        return filePath;
    }
}