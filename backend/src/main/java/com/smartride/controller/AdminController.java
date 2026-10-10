package com.smartride.controller;

import com.smartride.dto.response.*;
import com.smartride.security.UserPrincipal;
import com.smartride.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboardStats() {
        AdminDashboardDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Admin statistics retrieved", stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        List<UserDto> users = adminService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PutMapping("/users/{id}/block")
    public ResponseEntity<ApiResponse<UserDto>> blockUser(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        UserDto blockedUser = adminService.blockUser(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("User blocked successfully", blockedUser));
    }

    @PutMapping("/users/{id}/unblock")
    public ResponseEntity<ApiResponse<UserDto>> unblockUser(@PathVariable Long id) {
        UserDto unblockedUser = adminService.unblockUser(id);
        return ResponseEntity.ok(ApiResponse.success("User unblocked successfully", unblockedUser));
    }

    @GetMapping("/drivers")
    public ResponseEntity<ApiResponse<List<DriverDto>>> getAllDrivers() {
        List<DriverDto> drivers = adminService.getAllDrivers();
        return ResponseEntity.ok(ApiResponse.success("Drivers retrieved", drivers));
    }

    @PutMapping("/drivers/{id}/approve")
    public ResponseEntity<ApiResponse<DriverDto>> approveDriver(@PathVariable Long id) {
        DriverDto approved = adminService.approveDriver(id);
        return ResponseEntity.ok(ApiResponse.success("Driver approved successfully", approved));
    }

    @PutMapping("/drivers/{id}/reject")
    public ResponseEntity<ApiResponse<DriverDto>> rejectDriver(@PathVariable Long id) {
        DriverDto rejected = adminService.rejectDriver(id);
        return ResponseEntity.ok(ApiResponse.success("Driver application rejected", rejected));
    }

    @GetMapping("/rides")
    public ResponseEntity<ApiResponse<List<RideDto>>> getAllRides() {
        List<RideDto> rides = adminService.getAllRides();
        return ResponseEntity.ok(ApiResponse.success("Rides retrieved", rides));
    }

    @DeleteMapping("/rides/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteRide(@PathVariable Long id) {
        adminService.deleteRide(id);
        return ResponseEntity.ok(ApiResponse.success("Ride removed successfully", null));
    }

    @GetMapping("/bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getAllBookings() {
        List<BookingDto> bookings = adminService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookings));
    }
}
