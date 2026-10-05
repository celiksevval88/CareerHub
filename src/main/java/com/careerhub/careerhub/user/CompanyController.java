package com.careerhub.careerhub.user;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/company")
public class CompanyController {

    private final CompanyService companyService;
    private final UserService userService;

    public CompanyController(
            CompanyService companyService,
            UserService userService) {

        this.companyService = companyService;
        this.userService = userService;
    }
    @PostMapping
public CompanyResponse createCompany(
        @RequestBody CompanyRequest request,
        Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    Company company = new Company();

    company.setUser(user);
    company.setCompanyName(request.getCompanyName());
    company.setSector(request.getSector());
    company.setCity(request.getCity());
    company.setWebsite(request.getWebsite());
    company.setDescription(request.getDescription());

    Company savedCompany = companyService.createCompany(company);

    return new CompanyResponse(
            savedCompany.getId(),
            savedCompany.getCompanyName(),
            savedCompany.getSector(),
            savedCompany.getCity(),
            savedCompany.getWebsite(),
            savedCompany.getDescription(),
            user.getEmail()
    );
}
@GetMapping
public CompanyResponse getCompany(Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    Company company = companyService.getCompany(user);

    return new CompanyResponse(
            company.getId(),
            company.getCompanyName(),
            company.getSector(),
            company.getCity(),
            company.getWebsite(),
            company.getDescription(),
            user.getEmail()
    );
}
@PutMapping
public CompanyResponse updateCompany(
        @RequestBody CompanyRequest request,
        Authentication authentication) {

    User user = userService.getUserByEmail(authentication.getName());

    Company updatedCompany =
            companyService.updateCompany(user, request);

    return new CompanyResponse(
            updatedCompany.getId(),
            updatedCompany.getCompanyName(),
            updatedCompany.getSector(),
            updatedCompany.getCity(),
            updatedCompany.getWebsite(),
            updatedCompany.getDescription(),
            user.getEmail()
    );
}
}