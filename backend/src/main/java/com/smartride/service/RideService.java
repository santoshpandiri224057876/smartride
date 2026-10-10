package com.smartride.service;

import com.smartride.dto.response.RideDto;
import com.smartride.entity.Ride;
import com.smartride.entity.RideStatus;
import com.smartride.exception.ResourceNotFoundException;
import com.smartride.repository.BookingRepository;
import com.smartride.repository.ReviewRepository;
import com.smartride.repository.RideRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RideService {

    private final RideRepository rideRepository;
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;

    public RideService(RideRepository rideRepository,
                       ReviewRepository reviewRepository,
                       BookingRepository bookingRepository) {
        this.rideRepository = rideRepository;
        this.reviewRepository = reviewRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<RideDto> searchRides(String source, String destination, LocalDate departureDate, Integer minSeats, Double maxPrice, String vehicleType) {
        String cleanSource = (source != null && !source.isBlank()) ? source.trim() : null;
        String cleanDest = (destination != null && !destination.isBlank()) ? destination.trim() : null;
        Integer seats = (minSeats != null && minSeats > 0) ? minSeats : 1;

        List<Ride> rides = rideRepository.searchRides(cleanSource, cleanDest, departureDate, seats);

        return rides.stream()
                .filter(r -> r.getStatus() == RideStatus.ACTIVE && r.getAvailableSeats() >= seats)
                .filter(r -> maxPrice == null || r.getPricePerSeat() <= maxPrice)
                .filter(r -> vehicleType == null || vehicleType.isBlank() ||
                        (r.getDriver() != null && r.getDriver().getVehicleType() != null &&
                                r.getDriver().getVehicleType().equalsIgnoreCase(vehicleType.trim())))
                .map(this::populateRideDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RideDto getRideById(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        return populateRideDto(ride);
    }

    private RideDto populateRideDto(Ride ride) {
        RideDto dto = RideDto.fromEntity(ride);
        if (ride.getDriver() != null) {
            Double avgRating = reviewRepository.getAverageRatingForDriver(ride.getDriver().getId());
            dto.setDriverRating(avgRating != null ? Math.round(avgRating * 10.0) / 10.0 : 4.8); // default friendly starter rating if no reviews yet
        }
        return dto;
    }
}
