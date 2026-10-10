package com.smartride.controller;

import com.smartride.dto.request.CreateBookingRequest;
import com.smartride.dto.response.ApiResponse;
import com.smartride.dto.response.BookingDto;
import com.smartride.security.UserPrincipal;
import com.smartride.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingDto>> createBooking(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @Valid @RequestBody CreateBookingRequest request) {
        BookingDto booking = bookingService.createBooking(currentUser.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Booking confirmed successfully!", booking));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingDto>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal currentUser) {
        List<BookingDto> bookings = bookingService.getMyBookings(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Bookings retrieved", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingDto>> getBookingById(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        BookingDto booking = bookingService.getBookingById(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Booking details retrieved", booking));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingDto>> cancelBooking(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @PathVariable Long id) {
        BookingDto cancelledBooking = bookingService.cancelBooking(currentUser.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", cancelledBooking));
    }
}
