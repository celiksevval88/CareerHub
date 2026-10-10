package com.careerhub.careerhub;

import com.careerhub.careerhub.user.UserRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CareerhubApplicationTests {

    private static ValidatorFactory validatorFactory;
    private static Validator validator;

    @BeforeAll
    static void setUp() {
        validatorFactory = Validation.buildDefaultValidatorFactory();
        validator = validatorFactory.getValidator();
    }

    @AfterAll
    static void tearDown() {
        validatorFactory.close();
    }

    @Test
    void gecerliKullaniciBilgileriKabulEdilmeli() {
        UserRequest request = new UserRequest();
        request.setFirstName("Zeynep");
        request.setLastName("Kaya");
        request.setEmail("zeynep@example.com");
        request.setPassword("123456");
        request.setRole("STUDENT");

        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void bosAdReddedilmeli() {
        UserRequest request = gecerliKullaniciOlustur();
        request.setFirstName("");

        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void gecersizEmailReddedilmeli() {
        UserRequest request = gecerliKullaniciOlustur();
        request.setEmail("gecersiz-email");

        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void adminRoluKullaniciKaydindaReddedilmeli() {
        UserRequest request = gecerliKullaniciOlustur();
        request.setRole("ADMIN");

        assertFalse(validator.validate(request).isEmpty());
    }

    private UserRequest gecerliKullaniciOlustur() {
        UserRequest request = new UserRequest();
        request.setFirstName("Zeynep");
        request.setLastName("Kaya");
        request.setEmail("zeynep@example.com");
        request.setPassword("123456");
        request.setRole("STUDENT");
        return request;
    }
	@Test
void bosIlanBasligiReddedilmeli() {
    com.careerhub.careerhub.user.JobPostingRequest request =
            new com.careerhub.careerhub.user.JobPostingRequest();

    request.setTitle("");
    request.setType("STAJ");
    request.setCity("Çorlu");
    request.setWorkType("HİBRİT");
    request.setDescription("Test açıklaması");

    assertFalse(validator.validate(request).isEmpty());
}

@Test
void bosIlanIdReddedilmeli() {
    com.careerhub.careerhub.user.JobApplicationRequest request =
            new com.careerhub.careerhub.user.JobApplicationRequest();

    assertFalse(validator.validate(request).isEmpty());
}

@Test
void sifirIlanIdReddedilmeli() {
    com.careerhub.careerhub.user.JobApplicationRequest request =
            new com.careerhub.careerhub.user.JobApplicationRequest();

    request.setJobPostingId(0L);

    assertFalse(validator.validate(request).isEmpty());
}
}