package com.smartride.repository;

import com.smartride.entity.Booking;
import com.smartride.entity.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByPassengerIdOrderByBookedAtDesc(Long passengerId);
    List<Booking> findByRideIdOrderByBookedAtDesc(Long rideId);
    List<Booking> findByRideDriverIdOrderByBookedAtDesc(Long driverId);
    long countByBookingStatus(BookingStatus bookingStatus);

    @Query("SELECT COUNT(DISTINCT b.passenger.id) FROM Booking b WHERE b.ride.driver.id = :driverId AND b.bookingStatus = 'CONFIRMED'")
    long countDistinctPassengersByDriverId(@Param("driverId") Long driverId);

    @Query("SELECT COALESCE(SUM(b.totalPrice), 0.0) FROM Booking b WHERE b.ride.driver.id = :driverId AND b.bookingStatus = 'CONFIRMED'")
    Double calculateTotalEarningsByDriverId(@Param("driverId") Long driverId);

    List<Booking> findAllByOrderByBookedAtDesc();
}
