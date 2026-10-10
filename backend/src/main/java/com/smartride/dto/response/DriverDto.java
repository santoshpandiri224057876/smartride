package com.smartride.dto.response;

import com.smartride.entity.Driver;
import com.smartride.entity.DriverStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class DriverDto {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String licenseNumber;
    private LocalDate licenseExpiry;
    private String vehicleType;
    private String vehicleMake;
    private String vehicleModel;
    private String vehicleNumber;
    private String vehicleColor;
    private String fuelType;
    private Integer totalSeats;
    private DriverStatus verificationStatus;
    private String profilePhoto;
    private String vehiclePhoto;
    private Double rating;
    private Integer totalRides;
    private LocalDateTime createdAt;

    public DriverDto() {}

    public static DriverDto fromEntity(Driver driver) {
        DriverDto dto = new DriverDto();
        dto.setId(driver.getId());
        if (driver.getUser() != null) {
            dto.setUserId(driver.getUser().getId());
            dto.setUserName(driver.getUser().getName());
            dto.setUserEmail(driver.getUser().getEmail());
            dto.setUserPhone(driver.getUser().getPhone());
        }
        dto.setLicenseNumber(driver.getLicenseNumber());
        dto.setLicenseExpiry(driver.getLicenseExpiry());
        dto.setVehicleType(driver.getVehicleType());
        dto.setVehicleMake(driver.getVehicleMake());
        dto.setVehicleModel(driver.getVehicleModel());
        dto.setVehicleNumber(driver.getVehicleNumber());
        dto.setVehicleColor(driver.getVehicleColor());
        dto.setFuelType(driver.getFuelType());
        dto.setTotalSeats(driver.getTotalSeats());
        dto.setVerificationStatus(driver.getVerificationStatus());
        dto.setProfilePhoto(driver.getProfilePhoto());
        dto.setVehiclePhoto(driver.getVehiclePhoto());
        dto.setCreatedAt(driver.getCreatedAt());
        if (driver.getRides() != null) {
            dto.setTotalRides(driver.getRides().size());
        } else {
            dto.setTotalRides(0);
        }
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public LocalDate getLicenseExpiry() {
        return licenseExpiry;
    }

    public void setLicenseExpiry(LocalDate licenseExpiry) {
        this.licenseExpiry = licenseExpiry;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
    }

    public String getVehicleMake() {
        return vehicleMake;
    }

    public void setVehicleMake(String vehicleMake) {
        this.vehicleMake = vehicleMake;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getVehicleColor() {
        return vehicleColor;
    }

    public void setVehicleColor(String vehicleColor) {
        this.vehicleColor = vehicleColor;
    }

    public String getFuelType() {
        return fuelType;
    }

    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public DriverStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(DriverStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public String getProfilePhoto() {
        return profilePhoto;
    }

    public void setProfilePhoto(String profilePhoto) {
        this.profilePhoto = profilePhoto;
    }

    public String getVehiclePhoto() {
        return vehiclePhoto;
    }

    public void setVehiclePhoto(String vehiclePhoto) {
        this.vehiclePhoto = vehiclePhoto;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getTotalRides() {
        return totalRides;
    }

    public void setTotalRides(Integer totalRides) {
        this.totalRides = totalRides;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
