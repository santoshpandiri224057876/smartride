package com.smartride.repository;

import com.smartride.entity.Ride;
import com.smartride.entity.RideStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RideRepository extends JpaRepository<Ride, Long> {
    List<Ride> findByDriverIdOrderByDepartureDateDescDepartureTimeDesc(Long driverId);
    List<Ride> findByDriverIdAndStatus(Long driverId, RideStatus status);
    long countByStatus(RideStatus status);

    @Query("SELECT r FROM Ride r WHERE r.status = 'ACTIVE' " +
           "AND (:source IS NULL OR LOWER(r.source) LIKE LOWER(CONCAT('%', :source, '%'))) " +
           "AND (:destination IS NULL OR LOWER(r.destination) LIKE LOWER(CONCAT('%', :destination, '%'))) " +
           "AND (:departureDate IS NULL OR r.departureDate = :departureDate) " +
           "AND (:minSeats IS NULL OR r.availableSeats >= :minSeats) " +
           "ORDER BY r.departureDate ASC, r.departureTime ASC")
    List<Ride> searchRides(
            @Param("source") String source,
            @Param("destination") String destination,
            @Param("departureDate") LocalDate departureDate,
            @Param("minSeats") Integer minSeats
    );
}
