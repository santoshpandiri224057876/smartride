package com.smartride.service;

import com.smartride.dto.response.*;
import com.smartride.entity.*;
import com.smartride.exception.BadRequestException;
import com.smartride.exception.ResourceNotFoundException;
import com.smartride.repository.BookingRepository;
import com.smartride.repository.DriverRepository;
import com.smartride.repository.RideRepository;
import com.smartride.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;

    public AdminService(UserRepository userRepository,
                        DriverRepository driverRepository,
                        RideRepository rideRepository,
                        BookingRepository bookingRepository) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.rideRepository = rideRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto blockUser(Long adminUserId, Long targetUserId) {
        if (adminUserId.equals(targetUserId)) {
            throw new BadRequestException("Administrator cannot block their own account.");
        }

        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        user.setStatus(UserStatus.BLOCKED);
        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    @Transactional
    public UserDto unblockUser(Long targetUserId) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        user.setStatus(UserStatus.ACTIVE);
        User updated = userRepository.save(user);
        return UserDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<DriverDto> getAllDrivers() {
        return driverRepository.findAll().stream()
                .map(DriverDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public DriverDto approveDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));

        driver.setVerificationStatus(DriverStatus.APPROVED);
        Driver saved = driverRepository.save(driver);
        return DriverDto.fromEntity(saved);
    }

    @Transactional
    public DriverDto rejectDriver(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));

        driver.setVerificationStatus(DriverStatus.REJECTED);
        Driver saved = driverRepository.save(driver);
        return DriverDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public List<RideDto> getAllRides() {
        return rideRepository.findAll().stream()
                .map(RideDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteRide(Long rideId) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        ride.setStatus(RideStatus.CANCELLED);
        rideRepository.save(ride);

        List<Booking> bookings = bookingRepository.findByRideIdOrderByBookedAtDesc(rideId);
        for (Booking booking : bookings) {
            if (booking.getBookingStatus() == BookingStatus.CONFIRMED || booking.getBookingStatus() == BookingStatus.PENDING) {
                booking.setBookingStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);
            }
        }
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getAllBookings() {
        return bookingRepository.findAllByOrderByBookedAtDesc().stream()
                .map(BookingDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AdminDashboardDto getDashboardStats() {
        AdminDashboardDto stats = new AdminDashboardDto();

        long users = userRepository.count();
        long drivers = driverRepository.count();
        long pendingDrivers = driverRepository.countByVerificationStatus(DriverStatus.PENDING);
        long approvedDrivers = driverRepository.countByVerificationStatus(DriverStatus.APPROVED);
        long rejectedDrivers = driverRepository.countByVerificationStatus(DriverStatus.REJECTED);

        long totalRides = rideRepository.count();
        long activeRides = rideRepository.countByStatus(RideStatus.ACTIVE);
        long completedRides = rideRepository.countByStatus(RideStatus.COMPLETED);

        long totalBookings = bookingRepository.count();
        long completedBookings = bookingRepository.countByBookingStatus(BookingStatus.COMPLETED);

        Double platformVolume = bookingRepository.findAll().stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED || b.getBookingStatus() == BookingStatus.COMPLETED)
                .mapToDouble(Booking::getTotalPrice)
                .sum();

        stats.setTotalUsers(users);
        stats.setTotalDrivers(drivers);
        stats.setPendingDrivers(pendingDrivers);
        stats.setApprovedDrivers(approvedDrivers);
        stats.setRejectedDrivers(rejectedDrivers);
        stats.setTotalRides(totalRides);
        stats.setActiveRides(activeRides);
        stats.setCompletedRides(completedRides);
        stats.setTotalBookings(totalBookings);
        stats.setCompletedBookings(completedBookings);
        stats.setTotalPlatformVolume(platformVolume != null ? platformVolume : 0.0);

        stats.setRecentUsers(userRepository.findAll().stream().limit(5).map(UserDto::fromEntity).collect(Collectors.toList()));
        stats.setPendingApplications(driverRepository.findByVerificationStatus(DriverStatus.PENDING).stream().map(DriverDto::fromEntity).collect(Collectors.toList()));
        stats.setRecentBookings(bookingRepository.findAllByOrderByBookedAtDesc().stream().limit(5).map(BookingDto::fromEntity).collect(Collectors.toList()));

        return stats;
    }
}
