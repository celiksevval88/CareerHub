package com.careerhub.careerhub.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class JobPostingRequest {

    @NotBlank(message = "İlan başlığı boş bırakılamaz")
    @Size(max = 150, message = "İlan başlığı en fazla 150 karakter olabilir")
    private String title;

    @NotBlank(message = "İlan türü boş bırakılamaz")
    @Size(max = 50, message = "İlan türü en fazla 50 karakter olabilir")
    private String type;

    @NotBlank(message = "Şehir boş bırakılamaz")
    @Size(max = 100, message = "Şehir en fazla 100 karakter olabilir")
    private String city;

    @NotBlank(message = "Çalışma şekli boş bırakılamaz")
    @Size(max = 50, message = "Çalışma şekli en fazla 50 karakter olabilir")
    private String workType;

    @NotBlank(message = "İlan açıklaması boş bırakılamaz")
    private String description;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getWorkType() {
        return workType;
    }

    public void setWorkType(String workType) {
        this.workType = workType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}