package com.smartride.service;

import com.smartride.dto.request.DriverApplyRequest;
import com.smartride.dto.request.DriverProfileUpdateRequest;
import com.smartride.dto.request.OfferRideRequest;
import com.smartride.dto.request.UpdateRideRequest;
import com.smartride.dto.response.*;
import com.smartride.entity.*;
import com.smartride.exception.BadRequestException;
import com.smartride.exception.ResourceNotFoundException;
import com.smartride.exception.UnauthorizedException;
import com.smartride.repository.BookingRepository;
import com.smartride.repository.DriverRepository;
import com.smartride.repository.RideRepository;
import com.smartride.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverService {

    private final DriverRepository driverRepository;
    private final UserRepository userRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;

    public DriverService(DriverRepository driverRepository,
                         UserRepository userRepository,
                         RideRepository rideRepository,
                         BookingRepository bookingRepository) {
        this.driverRepository = driverRepository;
        this.userRepository = userRepository;
        this.rideRepository = rideRepository;
        this.bookingRepository = bookingRepository;
    }

    @Transactional
    public DriverDto applyDriver(Long userId, DriverApplyRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Driver driver = driverRepository.findByUserId(userId).orElse(null);

        if (driver != null) {
            if (driver.getVerificationStatus() == DriverStatus.APPROVED) {
                throw new BadRequestException("You are already an approved driver.");
            }
            if (driver.getVerificationStatus() == DriverStatus.PENDING) {
                throw new BadRequestException("Your driver application is already under review.");
            }
            // If REJECTED, allow re-application
            driver.setVerificationStatus(DriverStatus.PENDING);
        } else {
            driver = new Driver();
            driver.setUser(user);
            driver.setVerificationStatus(DriverStatus.PENDING);
        }

        driver.setLicenseNumber(request.getLicenseNumber().trim());
        driver.setLicenseExpiry(request.getLicenseExpiry());
        driver.setVehicleType(request.getVehicleType().trim());
        driver.setVehicleMake(request.getVehicleMake().trim());
        driver.setVehicleModel(request.getVehicleModel().trim());
        driver.setVehicleNumber(request.getVehicleNumber().trim());
        driver.setVehicleColor(request.getVehicleColor().trim());
        if (request.getFuelType() != null) {
            driver.setFuelType(request.getFuelType().trim());
        }
        driver.setTotalSeats(request.getTotalSeats());
        driver.setProfilePhoto(request.getProfilePhoto());
        driver.setVehiclePhoto(request.getVehiclePhoto());

        Driver savedDriver = driverRepository.save(driver);
        return DriverDto.fromEntity(savedDriver);
    }

    @Transactional(readOnly = true)
    public DriverDto getDriverProfile(Long userId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found. Please apply first."));
        return DriverDto.fromEntity(driver);
    }

    @Transactional
    public DriverDto updateDriverProfile(Long userId, DriverProfileUpdateRequest request) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        driver.setLicenseNumber(request.getLicenseNumber().trim());
        driver.setLicenseExpiry(request.getLicenseExpiry());
        driver.setVehicleType(request.getVehicleType().trim());
        driver.setVehicleMake(request.getVehicleMake().trim());
        driver.setVehicleModel(request.getVehicleModel().trim());
        driver.setVehicleNumber(request.getVehicleNumber().trim());
        driver.setVehicleColor(request.getVehicleColor().trim());
        if (request.getFuelType() != null) {
            driver.setFuelType(request.getFuelType().trim());
        }
        driver.setTotalSeats(request.getTotalSeats());
        if (request.getProfilePhoto() != null) {
            driver.setProfilePhoto(request.getProfilePhoto());
        }
        if (request.getVehiclePhoto() != null) {
            driver.setVehiclePhoto(request.getVehiclePhoto());
        }

        Driver updated = driverRepository.save(driver);
        return DriverDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public DriverDashboardDto getDriverDashboard(Long userId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        DriverDashboardDto dashboard = new DriverDashboardDto();
        dashboard.setVerificationStatus(driver.getVerificationStatus().name());

        List<Ride> allRides = rideRepository.findByDriverIdOrderByDepartureDateDescDepartureTimeDesc(driver.getId());
        long active = allRides.stream().filter(r -> r.getStatus() == RideStatus.ACTIVE).count();
        long completed = allRides.stream().filter(r -> r.getStatus() == RideStatus.COMPLETED).count();

        long passengersCount = bookingRepository.countDistinctPassengersByDriverId(driver.getId());
        Double earnings = bookingRepository.calculateTotalEarningsByDriverId(driver.getId());

        dashboard.setActiveRides(active);
        dashboard.setCompletedRides(completed);
        dashboard.setTotalPassengers(passengersCount);
        dashboard.setTotalEarnings(earnings != null ? earnings : 0.0);

        List<RideDto> recentRideDtos = allRides.stream()
                .limit(5)
                .map(r -> {
                    RideDto dto = RideDto.fromEntity(r);
                    List<Booking> bookings = bookingRepository.findByRideIdOrderByBookedAtDesc(r.getId());
                    int passengerCount = bookings.stream()
                            .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED)
                            .mapToInt(Booking::getSeatsBooked)
                            .sum();
                    dto.setPassengerCount(passengerCount);
                    return dto;
                })
                .collect(Collectors.toList());

        dashboard.setRecentRides(recentRideDtos);
        return dashboard;
    }

    @Transactional
    public RideDto createRide(Long userId, OfferRideRequest request) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("You must be a registered driver to offer rides."));

        if (driver.getVerificationStatus() == DriverStatus.PENDING) {
            throw new BadRequestException("Your driver account is still waiting for approval.");
        }

        if (driver.getVerificationStatus() == DriverStatus.REJECTED) {
            throw new BadRequestException("Your driver account has not been approved.");
        }

        if (driver.getVerificationStatus() != DriverStatus.APPROVED) {
            throw new BadRequestException("Only approved drivers can offer rides.");
        }

        if (request.getTotalSeats() > driver.getTotalSeats()) {
            throw new BadRequestException("Cannot offer more seats than your vehicle capacity (" + driver.getTotalSeats() + " seats)");
        }

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setSource(request.getSource().trim());
        ride.setDestination(request.getDestination().trim());
        ride.setDepartureDate(request.getDepartureDate());
        ride.setDepartureTime(request.getDepartureTime());
        ride.setTotalSeats(request.getTotalSeats());
        ride.setAvailableSeats(request.getTotalSeats());
        ride.setPricePerSeat(request.getPricePerSeat());
        ride.setVehicleName(request.getVehicleName() != null && !request.getVehicleName().isBlank()
                ? request.getVehicleName().trim()
                : driver.getVehicleMake() + " " + driver.getVehicleModel());
        ride.setDescription(request.getDescription());
        ride.setStatus(RideStatus.ACTIVE);

        Ride savedRide = rideRepository.save(ride);
        return RideDto.fromEntity(savedRide);
    }

    @Transactional(readOnly = true)
    public List<RideDto> getDriverRides(Long userId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        List<Ride> rides = rideRepository.findByDriverIdOrderByDepartureDateDescDepartureTimeDesc(driver.getId());
        return rides.stream().map(r -> {
            RideDto dto = RideDto.fromEntity(r);
            List<Booking> bookings = bookingRepository.findByRideIdOrderByBookedAtDesc(r.getId());
            long passengersCount = bookings.stream()
                    .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED)
                    .mapToInt(Booking::getSeatsBooked)
                    .sum();
            dto.setPassengerCount((int) passengersCount);
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RideDto getDriverRideById(Long userId, Long rideId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new UnauthorizedException("You do not have permission to view this ride.");
        }

        RideDto dto = RideDto.fromEntity(ride);
        List<Booking> bookings = bookingRepository.findByRideIdOrderByBookedAtDesc(ride.getId());
        int passengersCount = bookings.stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED)
                .mapToInt(Booking::getSeatsBooked)
                .sum();
        dto.setPassengerCount(passengersCount);
        return dto;
    }

    @Transactional
    public RideDto updateRide(Long userId, Long rideId, UpdateRideRequest request) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new UnauthorizedException("You can only modify your own rides.");
        }

        int bookedSeats = ride.getTotalSeats() - ride.getAvailableSeats();
        if (request.getTotalSeats() < bookedSeats) {
            throw new BadRequestException("Cannot reduce total seats below already booked seats (" + bookedSeats + ")");
        }

        ride.setSource(request.getSource().trim());
        ride.setDestination(request.getDestination().trim());
        ride.setDepartureDate(request.getDepartureDate());
        ride.setDepartureTime(request.getDepartureTime());
        ride.setTotalSeats(request.getTotalSeats());
        ride.setAvailableSeats(request.getTotalSeats() - bookedSeats);
        ride.setPricePerSeat(request.getPricePerSeat());
        if (request.getVehicleName() != null) {
            ride.setVehicleName(request.getVehicleName().trim());
        }
        ride.setDescription(request.getDescription());
        if (request.getStatus() != null) {
            ride.setStatus(request.getStatus());
        }

        Ride updated = rideRepository.save(ride);
        return RideDto.fromEntity(updated);
    }

    @Transactional
    public void cancelRide(Long userId, Long rideId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new UnauthorizedException("You can only cancel your own rides.");
        }

        ride.setStatus(RideStatus.CANCELLED);
        rideRepository.save(ride);

        // Also update any confirmed bookings for this ride to CANCELLED
        List<Booking> bookings = bookingRepository.findByRideIdOrderByBookedAtDesc(rideId);
        for (Booking booking : bookings) {
            if (booking.getBookingStatus() == BookingStatus.CONFIRMED || booking.getBookingStatus() == BookingStatus.PENDING) {
                booking.setBookingStatus(BookingStatus.CANCELLED);
                bookingRepository.save(booking);
            }
        }
    }

    @Transactional(readOnly = true)
    public List<BookingDto> getRidePassengers(Long userId, Long rideId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new ResourceNotFoundException("Ride not found with id: " + rideId));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new UnauthorizedException("You can only view passengers of your own rides.");
        }

        List<Booking> bookings = bookingRepository.findByRideIdOrderByBookedAtDesc(rideId);
        return bookings.stream().map(BookingDto::fromEntity).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<RideDto> getDriverHistory(Long userId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        List<Ride> rides = rideRepository.findByDriverIdOrderByDepartureDateDescDepartureTimeDesc(driver.getId());
        return rides.stream()
                .filter(r -> r.getStatus() == RideStatus.COMPLETED || r.getStatus() == RideStatus.CANCELLED)
                .map(r -> {
                    RideDto dto = RideDto.fromEntity(r);
                    List<Booking> bookings = bookingRepository.findByRideIdOrderByBookedAtDesc(r.getId());
                    int passengerCount = bookings.stream()
                            .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED)
                            .mapToInt(Booking::getSeatsBooked)
                            .sum();
                    dto.setPassengerCount(passengerCount);
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public EarningsDto getDriverEarnings(Long userId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found"));

        EarningsDto dto = new EarningsDto();
        List<Ride> allRides = rideRepository.findByDriverIdOrderByDepartureDateDescDepartureTimeDesc(driver.getId());

        int completedCount = 0;
        double total = 0.0;
        double thisMonth = 0.0;
        double thisWeek = 0.0;

        LocalDate now = LocalDate.now();
        LocalDate startOfMonth = now.withDayOfMonth(1);
        LocalDate startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1);

        List<EarningsDto.EarningsItemDto> history = new ArrayList<>();

        for (Ride ride : allRides) {
            List<Booking> bookings = bookingRepository.findByRideIdOrderByBookedAtDesc(ride.getId());
            List<Booking> confirmed = bookings.stream()
                    .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED || b.getBookingStatus() == BookingStatus.COMPLETED)
                    .toList();

            int seatsSold = confirmed.stream().mapToInt(Booking::getSeatsBooked).sum();
            double rideEarnings = confirmed.stream().mapToDouble(Booking::getTotalPrice).sum();

            if (ride.getStatus() == RideStatus.COMPLETED) {
                completedCount++;
            }

            total += rideEarnings;

            if (ride.getDepartureDate().isAfter(startOfMonth.minusDays(1))) {
                thisMonth += rideEarnings;
            }
            if (ride.getDepartureDate().isAfter(startOfWeek.minusDays(1))) {
                thisWeek += rideEarnings;
            }

            if (seatsSold > 0 || ride.getStatus() == RideStatus.COMPLETED) {
                EarningsDto.EarningsItemDto item = new EarningsDto.EarningsItemDto();
                item.setRideId(ride.getId());
                item.setSource(ride.getSource());
                item.setDestination(ride.getDestination());
                item.setDate(ride.getDepartureDate().toString());
                item.setPassengerCount(confirmed.size());
                item.setSeatsSold(seatsSold);
                item.setAmount(rideEarnings);
                item.setStatus(ride.getStatus().name());
                history.add(item);
            }
        }

        dto.setTotalEarnings(total);
        dto.setThisMonthEarnings(thisMonth);
        dto.setThisWeekEarnings(thisWeek);
        dto.setCompletedRides(completedCount);
        dto.setEarningsHistory(history);

        return dto;
    }
}
