package com.smartride.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UserProfileUpdateRequest {

    @NotBlank(message = "Name cannot be empty")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @NotBlank(message = "Phone cannot be empty")
    @jakarta.validation.constraints.Pattern(
        regexp = "^(\\+91[\\-\\s]?)?[6-9]\\d{9}$",
        message = "Must be a valid 10-digit Indian mobile number (e.g. +91 9876543210 or 9876543210)"
    )
    private String phone;

    public UserProfileUpdateRequest() {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }
}
