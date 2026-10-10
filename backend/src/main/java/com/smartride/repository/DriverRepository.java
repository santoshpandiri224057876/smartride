package com.smartride.repository;

import com.smartride.entity.Driver;
import com.smartride.entity.DriverStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<Driver, Long> {
    Optional<Driver> findByUserId(Long userId);
    Optional<Driver> findByUserEmail(String email);
    Boolean existsByUserId(Long userId);
    List<Driver> findByVerificationStatus(DriverStatus status);
    long countByVerificationStatus(DriverStatus status);
}
