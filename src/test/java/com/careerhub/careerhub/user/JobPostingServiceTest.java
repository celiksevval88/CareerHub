package com.careerhub.careerhub.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

class JobPostingServiceTest {

    private JobPostingRepository jobPostingRepository;
    private JobPostingService jobPostingService;

    @BeforeEach
    void setUp() {
        jobPostingRepository = mock(JobPostingRepository.class);
        jobPostingService =
                new JobPostingService(jobPostingRepository);
    }

    @Test
    void onayBekleyenSirketIlanOlusturamaz() {

        Company company = mock(Company.class);
        JobPosting jobPosting = mock(JobPosting.class);

        when(jobPosting.getCompany()).thenReturn(company);
        when(company.getApprovalStatus()).thenReturn("PENDING");

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> jobPostingService.createJobPosting(jobPosting)
        );

        assertEquals(
                "Şirketiniz admin tarafından onaylanmadan ilan oluşturamaz",
                exception.getMessage()
        );

        verify(jobPostingRepository, never())
                .save(any(JobPosting.class));
    }

    @Test
    void sirketProfiliOlmadanIlanOlusturulamaz() {

        JobPosting jobPosting = mock(JobPosting.class);

        when(jobPosting.getCompany()).thenReturn(null);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> jobPostingService.createJobPosting(jobPosting)
        );

        assertEquals(
                "Şirketiniz admin tarafından onaylanmadan ilan oluşturamaz",
                exception.getMessage()
        );

        verify(jobPostingRepository, never())
                .save(any(JobPosting.class));
    }

    @Test
    void onayliSirketIlanOlusturabilir() {

        Company company = mock(Company.class);
        JobPosting jobPosting = mock(JobPosting.class);

        when(jobPosting.getCompany()).thenReturn(company);
        when(company.getApprovalStatus()).thenReturn("APPROVED");
        when(jobPostingRepository.save(jobPosting))
                .thenReturn(jobPosting);

        JobPosting result =
                jobPostingService.createJobPosting(jobPosting);

        assertSame(jobPosting, result);

        verify(jobPostingRepository).save(jobPosting);
    }
}