package com.smartride.dto.response;

import java.util.ArrayList;
import java.util.List;

public class DriverDashboardDto {
    private long activeRides;
    private long completedRides;
    private long totalPassengers;
    private double totalEarnings;
    private String verificationStatus;
    private List<RideDto> recentRides = new ArrayList<>();

    public DriverDashboardDto() {}

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

    public long getTotalPassengers() {
        return totalPassengers;
    }

    public void setTotalPassengers(long totalPassengers) {
        this.totalPassengers = totalPassengers;
    }

    public double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public String getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(String verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public List<RideDto> getRecentRides() {
        return recentRides;
    }

    public void setRecentRides(List<RideDto> recentRides) {
        this.recentRides = recentRides;
    }
}
