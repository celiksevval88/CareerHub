package com.careerhub.careerhub.user;

import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyService(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    public Company createCompany(Company company) {

        return companyRepository.save(company);
    }

    public Company getCompany(User user) {

        return companyRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Şirket profili bulunamadı"));
    }
    public Company updateCompany(User user, CompanyRequest request) {

    Company company = companyRepository.findByUser(user)
            .orElseThrow(() -> new RuntimeException("Şirket profili bulunamadı"));

    company.setCompanyName(request.getCompanyName());
    company.setSector(request.getSector());
    company.setCity(request.getCity());
    company.setWebsite(request.getWebsite());
    company.setDescription(request.getDescription());

    return companyRepository.save(company);
}
}