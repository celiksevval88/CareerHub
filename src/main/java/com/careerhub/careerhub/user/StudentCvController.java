package com.careerhub.careerhub.user;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;

import java.nio.charset.StandardCharsets;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/student-cv")
public class StudentCvController {

        private final StudentCvService studentCvService;
        private final UserService userService;
        private final StudentCvFileService studentCvFileService;

        public StudentCvController(
                        StudentCvService studentCvService,
                        UserService userService,
                        StudentCvFileService studentCvFileService) {

                this.studentCvService = studentCvService;
                this.userService = userService;
                this.studentCvFileService = studentCvFileService;
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
                                savedCv.getProjects());
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
                                cv.getProjects());
        }

        @PutMapping
        public StudentCvResponse updateCv(
                        @RequestBody StudentCvRequest request,
                        Authentication authentication) {

                User user = userService.getUserByEmail(authentication.getName());

                StudentCv updatedCv = studentCvService.updateCv(user, request);

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
                                updatedCv.getProjects());
        }

        @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
        public ResponseEntity<?> uploadCvFile(
                        @RequestParam("file") MultipartFile file,
                        Authentication authentication) {

                User user = userService.getUserByEmail(authentication.getName());

                try {
                        StudentCvFile savedFile = studentCvFileService.upload(user, file);

                        return ResponseEntity.ok(
                                        new StudentCvFileResponse(
                                                        savedFile.getId(),
                                                        savedFile.getOriginalFileName(),
                                                        savedFile.getFileSize(),
                                                        savedFile.getUploadedAt()));

                } catch (IllegalArgumentException exception) {
                        return ResponseEntity.badRequest().body(
                                        Map.of("message", exception.getMessage()));

                } catch (IOException exception) {
                        return ResponseEntity.internalServerError().body(
                                        Map.of("message", "CV dosyası kaydedilemedi."));
                }
        }

        // Öğrencinin daha önce yüklediği CV bilgisini getir
        @GetMapping("/upload")
        public ResponseEntity<?> getUploadedCvFile(
                        Authentication authentication) {

                User user = userService.getUserByEmail(authentication.getName());

                StudentCvFile cvFile = studentCvFileService.getByUser(user);

                if (cvFile == null) {
                        return ResponseEntity.notFound().build();
                }

                return ResponseEntity.ok(
                                new StudentCvFileResponse(
                                                cvFile.getId(),
                                                cvFile.getOriginalFileName(),
                                                cvFile.getFileSize(),
                                                cvFile.getUploadedAt()));
        }

        // Öğrencinin yüklediği PDF CV'yi indir
        @GetMapping("/upload/download")
        public ResponseEntity<Resource> downloadCvFile(
                        Authentication authentication) throws IOException {

                User user = userService.getUserByEmail(authentication.getName());

                StudentCvFile cvFile = studentCvFileService.getByUser(user);

                if (cvFile == null) {
                        return ResponseEntity.notFound().build();
                }

                Path filePath = studentCvFileService.getFilePath(user);
                Resource resource = new UrlResource(filePath.toUri());

                if (!resource.exists() || !resource.isReadable()) {
                        return ResponseEntity.notFound().build();
                }

                ContentDisposition disposition = ContentDisposition
                                .attachment()
                                .filename(
                                                cvFile.getOriginalFileName(),
                                                StandardCharsets.UTF_8)
                                .build();

                return ResponseEntity.ok()
                                .contentType(MediaType.APPLICATION_PDF)
                                .header(
                                                HttpHeaders.CONTENT_DISPOSITION,
                                                disposition.toString())
                                .body(resource);
        }

        // Öğrencinin mevcut CV tercihini getir
        @GetMapping("/type")
        public Map<String, String> getCvType(
                        Authentication authentication) {

                User user = userService.getUserByEmail(authentication.getName());

                return Map.of(
                                "cvType",
                                user.getCvType() == null ? "" : user.getCvType());
        }

        // Öğrencinin CV tercihini kaydet
        @PutMapping("/type")
        public Map<String, String> updateCvType(
                        @RequestParam String cvType,
                        Authentication authentication) {

                User user = userService.getUserByEmail(authentication.getName());

                User updatedUser = userService.updateCvType(user, cvType);

                return Map.of("cvType", updatedUser.getCvType());
        }
}