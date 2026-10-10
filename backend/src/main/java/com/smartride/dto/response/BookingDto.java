package com.smartride.dto.response;

import com.smartride.entity.Booking;
import com.smartride.entity.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class BookingDto {
    private Long id;
    private Long rideId;
    private Long passengerId;
    private String passengerName;
    private String passengerEmail;
    private String passengerPhone;
    private Long driverId;
    private String driverName;
    private String driverEmail;
    private String driverPhone;
    private String source;
    private String destination;
    private LocalDate departureDate;
    private LocalTime departureTime;
    private String vehicleName;
    private Double pricePerSeat;
    private Integer seatsBooked;
    private Double totalPrice;
    private BookingStatus bookingStatus;
    private LocalDateTime bookedAt;
    private LocalDateTime updatedAt;

    public BookingDto() {}

    public static BookingDto fromEntity(Booking booking) {
        BookingDto dto = new BookingDto();
        dto.setId(booking.getId());
        if (booking.getPassenger() != null) {
            dto.setPassengerId(booking.getPassenger().getId());
            dto.setPassengerName(booking.getPassenger().getName());
            dto.setPassengerEmail(booking.getPassenger().getEmail());
            dto.setPassengerPhone(booking.getPassenger().getPhone());
        }
        if (booking.getRide() != null) {
            dto.setRideId(booking.getRide().getId());
            dto.setSource(booking.getRide().getSource());
            dto.setDestination(booking.getRide().getDestination());
            dto.setDepartureDate(booking.getRide().getDepartureDate());
            dto.setDepartureTime(booking.getRide().getDepartureTime());
            dto.setVehicleName(booking.getRide().getVehicleName());
            dto.setPricePerSeat(booking.getRide().getPricePerSeat());
            if (booking.getRide().getDriver() != null) {
                dto.setDriverId(booking.getRide().getDriver().getId());
                if (booking.getRide().getDriver().getUser() != null) {
                    dto.setDriverName(booking.getRide().getDriver().getUser().getName());
                    dto.setDriverEmail(booking.getRide().getDriver().getUser().getEmail());
                    dto.setDriverPhone(booking.getRide().getDriver().getUser().getPhone());
                }
            }
        }
        dto.setSeatsBooked(booking.getSeatsBooked());
        dto.setTotalPrice(booking.getTotalPrice());
        dto.setBookingStatus(booking.getBookingStatus());
        dto.setBookedAt(booking.getBookedAt());
        dto.setUpdatedAt(booking.getUpdatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public void setPassengerName(String passengerName) {
        this.passengerName = passengerName;
    }

    public String getPassengerEmail() {
        return passengerEmail;
    }

    public void setPassengerEmail(String passengerEmail) {
        this.passengerEmail = passengerEmail;
    }

    public String getPassengerPhone() {
        return passengerPhone;
    }

    public void setPassengerPhone(String passengerPhone) {
        this.passengerPhone = passengerPhone;
    }

    public Long getDriverId() {
        return driverId;
    }

    public void setDriverId(Long driverId) {
        this.driverId = driverId;
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

    public String getVehicleName() {
        return vehicleName;
    }

    public void setVehicleName(String vehicleName) {
        this.vehicleName = vehicleName;
    }

    public Double getPricePerSeat() {
        return pricePerSeat;
    }

    public void setPricePerSeat(Double pricePerSeat) {
        this.pricePerSeat = pricePerSeat;
    }

    public Integer getSeatsBooked() {
        return seatsBooked;
    }

    public void setSeatsBooked(Integer seatsBooked) {
        this.seatsBooked = seatsBooked;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public BookingStatus getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(BookingStatus bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public LocalDateTime getBookedAt() {
        return bookedAt;
    }

    public void setBookedAt(LocalDateTime bookedAt) {
        this.bookedAt = bookedAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
