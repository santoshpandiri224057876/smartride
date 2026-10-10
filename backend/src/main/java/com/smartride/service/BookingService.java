package com.smartride.service;

import com.smartride.dto.request.CreateBookingRequest;
import com.smartride.dto.response.BookingDto;
import com.smartride.entity.*;
import com.smartride.exception.BadRequestException;
import com.smartride.exception.ResourceNotFoundException;
import com.smartride.exception.UnauthorizedException;
import com.smartride.repository.BookingRepository;
import com.smartride.repository.RideRepository;
import com.smartride.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public BookingService(BookingRepository bookingRepository,
                          RideRepository rideRepository,
                          UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BookingDto createBooking(Long passengerId, CreateBookingRequest request) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found with id: " + passengerId));

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + request.getRideId()));

        if (ride.getStatus() != RideStatus.ACTIVE) {
            throw new BadRequestException("This ride is no longer active for booking.");
        }

        if (request.getSeatsBooked() <= 0) {
            throw new BadRequestException("Number of seats booked must be at least 1.");
        }

        if (ride.getAvailableSeats() < request.getSeatsBooked()) {
            throw new BadRequestException("Insufficient seats available. Only " + ride.getAvailableSeats() + " seats left.");
        }

        if (ride.getDriver() != null && ride.getDriver().getUser() != null
                && ride.getDriver().getUser().getId().equals(passengerId)) {
            throw new BadRequestException("You cannot book your own offered ride.");
        }

        double totalPrice = request.getSeatsBooked() * ride.getPricePerSeat();

        Booking booking = new Booking();
        booking.setPassenger(passenger);
        booking.setRide(ride);
        booking.setSeatsBooked(request.getSeatsBooked());
        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        // Reduce available seats in ride
        ride.setAvailableSeats(ride.getAvailableSeats() - request.getSeatsBooked());
        rideRepository.save(ride);

        Booking savedBooking = bookingRepository.save(booking);
        return BookingDto.fromEntity(savedBooking);
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getMyBookings(Long passengerId) {
        List<Booking> bookings = bookingRepository.findByPassengerIdOrderByBookedAtDesc(passengerId);
        return bookings.stream().map(BookingDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BookingDto getBookingById(Long userId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        boolean isPassenger = booking.getPassenger() != null && booking.getPassenger().getId().equals(userId);
        boolean isDriver = booking.getRide() != null && booking.getRide().getDriver() != null
                && booking.getRide().getDriver().getUser() != null
                && booking.getRide().getDriver().getUser().getId().equals(userId);

        User currentUser = userRepository.findById(userId).orElse(null);
        boolean isAdmin = currentUser != null && currentUser.getRole() == Role.ADMIN;

        if (!isPassenger && !isDriver && !isAdmin) {
            throw new UnauthorizedException("You do not have permission to view this booking.");
        }

        return BookingDto.fromEntity(booking);
    }

    @Transactional
    public BookingDto cancelBooking(Long passengerId, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!booking.getPassenger().getId().equals(passengerId)) {
            throw new UnauthorizedException("You can only cancel your own bookings.");
        }

        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking is already cancelled.");
        }

        Ride ride = booking.getRide();
        if (ride != null) {
            // Restore seats
            ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());
            rideRepository.save(ride);
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);

        return BookingDto.fromEntity(updated);
    }
}
