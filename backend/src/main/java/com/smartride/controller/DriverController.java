package com.smartride.controller;

import com.smartride.dto.request.DriverApplyRequest;
import com.smartride.dto.request.DriverProfileUpdateRequest;
import com.smartride.dto.request.OfferRideRequest;
import com.smartride.dto.request.UpdateRideRequest;
import com.smartride.dto.response.*;
import com.smartride.security.UserPrincipal;
import com.smartride.service.DriverService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    // Driver Application & Profile
    @PostMapping("/api/drivers/apply")
    public ResponseEntity<ApiResponse<DriverDto>> applyDriver(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DriverApplyRequest request) {
        DriverDto driverDto = driverService.applyDriver(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Driver application submitted and waiting for admin approval.", driverDto));
    }

    @GetMapping("/api/drivers/profile")
    public ResponseEntity<ApiResponse<DriverDto>> getDriverProfile(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DriverDto driverDto = driverService.getDriverProfile(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Driver profile retrieved", driverDto));
    }

    @PutMapping("/api/drivers/profile")
    public ResponseEntity<ApiResponse<DriverDto>> updateDriverProfile(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody DriverProfileUpdateRequest request) {
        DriverDto driverDto = driverService.updateDriverProfile(currentUser.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Driver profile updated successfully", driverDto));
    }

    // Driver Dashboard
    @GetMapping("/api/driver/dashboard")
    public ResponseEntity<ApiResponse<DriverDashboardDto>> getDriverDashboard(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        DriverDashboardDto dashboard = driverService.getDriverDashboard(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Driver dashboard data retrieved", dashboard));
    }

    // Driver Rides Management
    @PostMapping("/api/driver/rides")
    public ResponseEntity<ApiResponse<RideDto>> offerRide(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody OfferRideRequest request) {
        RideDto ride = driverService.createRide(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Ride offered successfully!", ride));
    }

    @GetMapping("/api/driver/rides")
    public ResponseEntity<ApiResponse<List<RideDto>>> getDriverRides(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<RideDto> rides = driverService.getDriverRides(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Driver rides retrieved", rides));
    }

    @GetMapping("/api/driver/rides/{id}")
    public ResponseEntity<ApiResponse<RideDto>> getDriverRideById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        RideDto ride = driverService.getDriverRideById(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Ride details retrieved", ride));
    }

    @PutMapping("/api/driver/rides/{id}")
    public ResponseEntity<ApiResponse<RideDto>> updateRide(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id,
            @Valid @RequestBody UpdateRideRequest request) {
        RideDto updated = driverService.updateRide(currentUser.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Ride updated successfully", updated));
    }

    @DeleteMapping("/api/driver/rides/{id}")
    public ResponseEntity<ApiResponse<Void>> cancelRide(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        driverService.cancelRide(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Ride cancelled successfully", null));
    }

    @GetMapping("/api/driver/rides/{rideId}/passengers")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getRidePassengers(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long rideId) {
        List<BookingDto> passengers = driverService.getRidePassengers(currentUser.getId(), rideId);
        return ResponseEntity.ok(ApiResponse.success("Passengers retrieved", passengers));
    }

    @GetMapping("/api/driver/history")
    public ResponseEntity<ApiResponse<List<RideDto>>> getDriverHistory(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<RideDto> history = driverService.getDriverHistory(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Driver ride history retrieved", history));
    }

    @GetMapping("/api/driver/earnings")
    public ResponseEntity<ApiResponse<EarningsDto>> getDriverEarnings(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        EarningsDto earnings = driverService.getDriverEarnings(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Earnings data retrieved", earnings));
    }
}
