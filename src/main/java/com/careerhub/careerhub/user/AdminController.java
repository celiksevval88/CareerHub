package com.careerhub.careerhub.user;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;



import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

        private final UserRepository userRepository;
        private final CompanyRepository companyRepository;

        public AdminController(
                        UserRepository userRepository,
                        CompanyRepository companyRepository) {

                this.userRepository = userRepository;
                this.companyRepository = companyRepository;
        }

        @GetMapping("/users")
        public List<AdminUserResponse> getAllUsers() {

                return userRepository.findByActiveTrue()
                                .stream()
                                .map(user -> new AdminUserResponse(
                                                user.getId(),
                                                user.getFirstName(),
                                                user.getLastName(),
                                                user.getEmail(),
                                                user.getRole()))
                                .toList();
        }

        @DeleteMapping("/users/{userId}")
        public void deactivateUser(@PathVariable Long userId) {

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new RuntimeException("Kullanıcı bulunamadı"));

                user.setActive(false);
                userRepository.save(user);
        }

        @DeleteMapping("/companies/{companyId}")
        public void deactivateCompany(@PathVariable Long companyId) {

                Company company = companyRepository.findById(companyId)
                                .orElseThrow(() -> new RuntimeException("Şirket bulunamadı"));

                company.setApprovalStatus("REJECTED");

                companyRepository.save(company);

                User user = company.getUser();
                user.setActive(false);
                userRepository.save(user);
        }

        @GetMapping("/companies")
        public List<AdminCompanyResponse> getAllCompanies() {

                return companyRepository.findAll().stream()
                                .filter(company -> company.getUser().isActive())
                                .map(company -> new AdminCompanyResponse(
                                                company.getId(),
                                                company.getCompanyName(),
                                                company.getSector(),
                                                company.getCity(),
                                                company.getWebsite(),
                                                company.getDescription(),
                                                company.getUser().getEmail(),
                                                company.getApprovalStatus()))
                                .toList();
        }

        @PutMapping("/companies/{companyId}/approval")
        public AdminCompanyResponse updateCompanyApproval(
                        @PathVariable Long companyId,
                        @RequestParam String status) {

                if (!"APPROVED".equals(status)
                                && !"REJECTED".equals(status)
                                && !"PENDING".equals(status)) {

                        throw new RuntimeException("Geçersiz şirket onay durumu");
                }

                Company company = companyRepository.findById(companyId)
                                .orElseThrow(() -> new RuntimeException("Şirket bulunamadı"));

                company.setApprovalStatus(status);

                Company updatedCompany = companyRepository.save(company);

                return new AdminCompanyResponse(
                                updatedCompany.getId(),
                                updatedCompany.getCompanyName(),
                                updatedCompany.getSector(),
                                updatedCompany.getCity(),
                                updatedCompany.getWebsite(),
                                updatedCompany.getDescription(),
                                updatedCompany.getUser().getEmail(),
                                updatedCompany.getApprovalStatus());
        }
}