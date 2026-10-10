package com.smartride.dto.response;

import java.util.ArrayList;
import java.util.List;

public class AdminDashboardDto {
    private long totalUsers;
    private long totalDrivers;
    private long pendingDrivers;
    private long approvedDrivers;
    private long rejectedDrivers;
    private long totalRides;
    private long activeRides;
    private long completedRides;
    private long totalBookings;
    private long completedBookings;
    private double totalPlatformVolume;
    private List<UserDto> recentUsers = new ArrayList<>();
    private List<DriverDto> pendingApplications = new ArrayList<>();
    private List<BookingDto> recentBookings = new ArrayList<>();

    public AdminDashboardDto() {}

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalDrivers() {
        return totalDrivers;
    }

    public void setTotalDrivers(long totalDrivers) {
        this.totalDrivers = totalDrivers;
    }

    public long getPendingDrivers() {
        return pendingDrivers;
    }

    public void setPendingDrivers(long pendingDrivers) {
        this.pendingDrivers = pendingDrivers;
    }

    public long getApprovedDrivers() {
        return approvedDrivers;
    }

    public void setApprovedDrivers(long approvedDrivers) {
        this.approvedDrivers = approvedDrivers;
    }

    public long getRejectedDrivers() {
        return rejectedDrivers;
    }

    public void setRejectedDrivers(long rejectedDrivers) {
        this.rejectedDrivers = rejectedDrivers;
    }

    public long getTotalRides() {
        return totalRides;
    }

    public void setTotalRides(long totalRides) {
        this.totalRides = totalRides;
    }

    public long getActiveRides() {
        return activeRides;
    }

    public void setActiveRides(long activeRides) {
        this.activeRides = activeRides;
    }

    public long getCompletedRides() {
        return completedRides;
    }

    public void setCompletedRides(long completedRides) {
        this.completedRides = completedRides;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getCompletedBookings() {
        return completedBookings;
    }

    public void setCompletedBookings(long completedBookings) {
        this.completedBookings = completedBookings;
    }

    public double getTotalPlatformVolume() {
        return totalPlatformVolume;
    }

    public void setTotalPlatformVolume(double totalPlatformVolume) {
        this.totalPlatformVolume = totalPlatformVolume;
    }

    public List<UserDto> getRecentUsers() {
        return recentUsers;
    }

    public void setRecentUsers(List<UserDto> recentUsers) {
        this.recentUsers = recentUsers;
    }

    public List<DriverDto> getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(List<DriverDto> pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public List<BookingDto> getRecentBookings() {
        return recentBookings;
    }

    public void setRecentBookings(List<BookingDto> recentBookings) {
        this.recentBookings = recentBookings;
    }
}
