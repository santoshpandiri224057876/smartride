package com.smartride.controller;

import com.smartride.dto.response.ApiResponse;
import com.smartride.dto.response.RideDto;
import com.smartride.service.RideService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
public class PassengerRideController {

    private final RideService rideService;

    public PassengerRideController(RideService rideService) {
        this.rideService = rideService;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<RideDto>>> searchRides(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false, defaultValue = "1") Integer seats,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String vehicleType) {

        List<RideDto> results = rideService.searchRides(from, to, date, seats, maxPrice, vehicleType);
        return ResponseEntity.ok(ApiResponse.success("Rides found: " + results.size(), results));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RideDto>> getRideDetails(@PathVariable Long id) {
        RideDto ride = rideService.getRideById(id);
        return ResponseEntity.ok(ApiResponse.success("Ride details retrieved", ride));
    }
}
