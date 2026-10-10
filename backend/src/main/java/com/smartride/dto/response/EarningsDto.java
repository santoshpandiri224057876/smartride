package com.smartride.dto.response;

import java.util.ArrayList;
import java.util.List;

public class EarningsDto {
    private Double totalEarnings = 0.0;
    private Double thisMonthEarnings = 0.0;
    private Double thisWeekEarnings = 0.0;
    private Integer completedRides = 0;
    private List<EarningsItemDto> earningsHistory = new ArrayList<>();

    public EarningsDto() {}

    public static class EarningsItemDto {
        private Long rideId;
        private String source;
        private String destination;
        private String date;
        private Integer passengerCount;
        private Integer seatsSold;
        private Double amount;
        private String status;

        public EarningsItemDto() {}

        public Long getRideId() {
            return rideId;
        }

        public void setRideId(Long rideId) {
            this.rideId = rideId;
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

        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Integer getPassengerCount() {
            return passengerCount;
        }

        public void setPassengerCount(Integer passengerCount) {
            this.passengerCount = passengerCount;
        }

        public Integer getSeatsSold() {
            return seatsSold;
        }

        public void setSeatsSold(Integer seatsSold) {
            this.seatsSold = seatsSold;
        }

        public Double getAmount() {
            return amount;
        }

        public void setAmount(Double amount) {
            this.amount = amount;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    public Double getTotalEarnings() {
        return totalEarnings;
    }

    public void setTotalEarnings(Double totalEarnings) {
        this.totalEarnings = totalEarnings;
    }

    public Double getThisMonthEarnings() {
        return thisMonthEarnings;
    }

    public void setThisMonthEarnings(Double thisMonthEarnings) {
        this.thisMonthEarnings = thisMonthEarnings;
    }

    public Double getThisWeekEarnings() {
        return thisWeekEarnings;
    }

    public void setThisWeekEarnings(Double thisWeekEarnings) {
        this.thisWeekEarnings = thisWeekEarnings;
    }

    public Integer getCompletedRides() {
        return completedRides;
    }

    public void setCompletedRides(Integer completedRides) {
        this.completedRides = completedRides;
    }

    public List<EarningsItemDto> getEarningsHistory() {
        return earningsHistory;
    }

    public void setEarningsHistory(List<EarningsItemDto> earningsHistory) {
        this.earningsHistory = earningsHistory;
    }
}
