package com.smartride.dto.response;

import com.smartride.entity.Ride;
import com.smartride.entity.RideStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class RideDto {
    private Long id;
    private Long driverId;
    private Long driverUserId;
    private String driverName;
    private String driverEmail;
    private String driverPhone;
    private Double driverRating;
    private String driverVerificationStatus;
    private String driverProfilePhoto;
    private String source;
    private String destination;
    private LocalDate departureDate;
    private LocalTime departureTime;
    private Integer totalSeats;
    private Integer availableSeats;
    private Integer bookedSeats;
    private Double pricePerSeat;
    private String vehicleName;
    private String vehicleType;
    private String vehicleNumber;
    private String vehicleColor;
    private String description;
    private RideStatus status;
    private LocalDateTime createdAt;
    private Integer passengerCount;

    public RideDto() {}

    public static RideDto fromEntity(Ride ride) {
        RideDto dto = new RideDto();
        dto.setId(ride.getId());
        if (ride.getDriver() != null) {
            dto.setDriverId(ride.getDriver().getId());
            dto.setDriverVerificationStatus(ride.getDriver().getVerificationStatus().name());
            dto.setDriverProfilePhoto(ride.getDriver().getProfilePhoto());
            dto.setVehicleType(ride.getDriver().getVehicleType());
            dto.setVehicleNumber(ride.getDriver().getVehicleNumber());
            dto.setVehicleColor(ride.getDriver().getVehicleColor());
            if (ride.getDriver().getUser() != null) {
                dto.setDriverUserId(ride.getDriver().getUser().getId());
                dto.setDriverName(ride.getDriver().getUser().getName());
                dto.setDriverEmail(ride.getDriver().getUser().getEmail());
                dto.setDriverPhone(ride.getDriver().getUser().getPhone());
            }
        }
        dto.setSource(ride.getSource());
        dto.setDestination(ride.getDestination());
        dto.setDepartureDate(ride.getDepartureDate());
        dto.setDepartureTime(ride.getDepartureTime());
        dto.setTotalSeats(ride.getTotalSeats());
        dto.setAvailableSeats(ride.getAvailableSeats());
        dto.setBookedSeats(ride.getTotalSeats() - ride.getAvailableSeats());
        dto.setPricePerSeat(ride.getPricePerSeat());
        dto.setVehicleName(ride.getVehicleName());
        dto.setDescription(ride.getDescription());
        dto.setStatus(ride.getStatus());
        dto.setCreatedAt(ride.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
    }

    public Long getDriverUserId() {
        return driverUserId;
    }

    public void setDriverUserId(Long driverUserId) {
        this.driverUserId = driverUserId;
    }

    public String getDriverName() {
        return driverName;
    }

    public void setDriverName(String driverName) {
        this.driverName = driverName;
    }

    public String getDriverEmail() {
        return driverEmail;
    }

    public void setDriverEmail(String driverEmail) {
        this.driverEmail = driverEmail;
    }

    public String getDriverPhone() {
        return driverPhone;
    }

    public void setDriverPhone(String driverPhone) {
        this.driverPhone = driverPhone;
    }

    public Double getDriverRating() {
        return driverRating;
    }

    public void setDriverRating(Double driverRating) {
        this.driverRating = driverRating;
    }

    public String getDriverVerificationStatus() {
        return driverVerificationStatus;
    }

    public void setDriverVerificationStatus(String driverVerificationStatus) {
        this.driverVerificationStatus = driverVerificationStatus;
    }

    public String getDriverProfilePhoto() {
        return driverProfilePhoto;
    }

    public void setDriverProfilePhoto(String driverProfilePhoto) {
        this.driverProfilePhoto = driverProfilePhoto;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }

    public LocalTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalTime departureTime) {
        this.departureTime = departureTime;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Integer getBookedSeats() {
        return bookedSeats;
    }

    public void setBookedSeats(Integer bookedSeats) {
        this.bookedSeats = bookedSeats;
    }

    public Double getPricePerSeat() {
        return pricePerSeat;
    }

    public void setPricePerSeat(Double pricePerSeat) {
        this.pricePerSeat = pricePerSeat;
    }

    public String getVehicleName() {
        return vehicleName;
    }

    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }

    public String getVehicleType() {
        return vehicleType;
    }

    public void setVehicleType(String vehicleType) {
        this.vehicleType = vehicleType;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RideStatus getStatus() {
        return status;
    }

    public void setStatus(RideStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Integer getPassengerCount() {
        return passengerCount;
    }

    public void setPassengerCount(Integer passengerCount) {
        this.passengerCount = passengerCount;
    }
}
