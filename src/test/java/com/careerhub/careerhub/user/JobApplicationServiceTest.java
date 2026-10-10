package com.careerhub.careerhub.user;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class JobApplicationServiceTest {

    private JobApplicationRepository jobApplicationRepository;
    private JobPostingRepository jobPostingRepository;
    private NotificationService notificationService;
    private JobApplicationService jobApplicationService;

    @BeforeEach
    void setUp() {
        jobApplicationRepository = mock(JobApplicationRepository.class);
        jobPostingRepository = mock(JobPostingRepository.class);
        notificationService = mock(NotificationService.class);

        jobApplicationService = new JobApplicationService(
                jobApplicationRepository,
                jobPostingRepository,
                notificationService
        );
    }

    @Test
    void ayniIlanaIkinciKezBasvuruYapilamaz() {

        User student = mock(User.class);
        JobPosting jobPosting = mock(JobPosting.class);

        when(jobApplicationRepository
                .existsByStudentAndJobPosting(student, jobPosting))
                .thenReturn(true);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> jobApplicationService.createApplication(
                        student, jobPosting)
        );

        assertEquals(
                "Bu ilana daha önce başvurdunuz",
                exception.getMessage()
        );

        verify(jobApplicationRepository, never())
                .save(any(JobApplication.class));
    }

    @Test
    void yeniBasvuruBeklemedeDurumuylaOlusturulur() {

        User student = mock(User.class);
        JobPosting jobPosting = mock(JobPosting.class);

        when(jobApplicationRepository
                .existsByStudentAndJobPosting(student, jobPosting))
                .thenReturn(false);

        when(jobApplicationRepository.save(any(JobApplication.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        JobApplication result =
                jobApplicationService.createApplication(student, jobPosting);

        assertEquals("BEKLEMEDE", result.getStatus());
        assertSame(student, result.getStudent());
        assertSame(jobPosting, result.getJobPosting());
        assertNotNull(result.getApplicationDate());

        verify(jobApplicationRepository).save(any(JobApplication.class));
    }

    @Test
    void gecersizBasvuruDurumuReddedilir() {

        Company company = mock(Company.class);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> jobApplicationService.updateApplicationStatus(
                        company, 1L, "GECERSIZ")
        );

        assertEquals(
                "Geçersiz başvuru durumu",
                exception.getMessage()
        );

        verify(jobApplicationRepository, never()).findById(1L);
    }

    @Test
    void baskaSirketBasvuruDurumunuGuncelleyemez() {

        Company ilanSahibi = mock(Company.class);
        Company istekYapan = mock(Company.class);
        JobPosting jobPosting = mock(JobPosting.class);
        JobApplication application = mock(JobApplication.class);

        when(jobApplicationRepository.findById(10L))
                .thenReturn(Optional.of(application));

        when(application.getJobPosting()).thenReturn(jobPosting);
        when(jobPosting.getCompany()).thenReturn(ilanSahibi);
        when(ilanSahibi.getId()).thenReturn(1L);
        when(istekYapan.getId()).thenReturn(2L);

        RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> jobApplicationService.updateApplicationStatus(
                        istekYapan, 10L, "KABUL_EDİLDİ")
        );

        assertEquals(
                "Bu başvuruyu güncelleme yetkiniz yok",
                exception.getMessage()
        );

        verify(jobApplicationRepository, never())
                .save(any(JobApplication.class));
    }
}