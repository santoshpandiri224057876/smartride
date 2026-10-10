package com.smartride.config;

import com.smartride.entity.*;
import com.smartride.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           DriverRepository driverRepository,
                           RideRepository rideRepository,
                           BookingRepository bookingRepository,
                           ReviewRepository reviewRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.rideRepository = rideRepository;
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        // Check if database already has Indian cities
        boolean hasIndianData = rideRepository.findAll().stream()
                .anyMatch(r -> "Hyderabad".equalsIgnoreCase(r.getSource()) || "Bengaluru".equalsIgnoreCase(r.getSource()));

        if (hasIndianData) {
            logger.info("Database is already loaded with Indian data.");
            return;
        }

        logger.info("Migrating SmartRide database to Indian carpooling ecosystem...");

        // Clear existing test entries if they contain non-Indian data
        reviewRepository.deleteAllInBatch();
        bookingRepository.deleteAllInBatch();
        rideRepository.deleteAllInBatch();
        driverRepository.deleteAllInBatch();
        userRepository.deleteAllInBatch();

        // 1. Admin User
        User admin = new User("System Administrator", "admin@smartride.com", passwordEncoder.encode("admin123"), "+91 9876543210", Role.ADMIN);
        userRepository.save(admin);

        // 2. Demo Passenger: Rahul Sharma (Hyderabad)
        User passenger = new User("Rahul Sharma", "passenger@smartride.com", passwordEncoder.encode("pass123"), "+91 9849012345", Role.USER);
        userRepository.save(passenger);

        // 3. Approved Driver 1: Vikram Reddy (Telangana - Hyderabad)
        User userVikram = new User("Vikram Reddy", "alex@smartride.com", passwordEncoder.encode("driver123"), "+91 9885067890", Role.USER);
        userRepository.save(userVikram);

        Driver driverVikram = new Driver();
        driverVikram.setUser(userVikram);
        driverVikram.setLicenseNumber("TS09 20180012345");
        driverVikram.setLicenseExpiry(LocalDate.now().plusYears(4));
        driverVikram.setVehicleType("SUV");
        driverVikram.setVehicleMake("Tata");
        driverVikram.setVehicleModel("Nexon EV");
        driverVikram.setVehicleNumber("TS09AB1234");
        driverVikram.setVehicleColor("Daytona Grey");
        driverVikram.setFuelType("Electric");
        driverVikram.setTotalSeats(4);
        driverVikram.setVerificationStatus(DriverStatus.APPROVED);
        driverVikram.setProfilePhoto("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150");
        driverRepository.save(driverVikram);

        // 4. Approved Driver 2: Ananya Iyer (Karnataka - Bengaluru)
        User userAnanya = new User("Ananya Iyer", "sarah@smartride.com", passwordEncoder.encode("driver123"), "+91 9940123456", Role.USER);
        userRepository.save(userAnanya);

        Driver driverAnanya = new Driver();
        driverAnanya.setUser(userAnanya);
        driverAnanya.setLicenseNumber("KA01 20190054321");
        driverAnanya.setLicenseExpiry(LocalDate.now().plusYears(3));
        driverAnanya.setVehicleType("Sedan");
        driverAnanya.setVehicleMake("Maruti Suzuki");
        driverAnanya.setVehicleModel("Swift Dzire");
        driverAnanya.setVehicleNumber("KA01MN1234");
        driverAnanya.setVehicleColor("Magma Grey");
        driverAnanya.setFuelType("CNG");
        driverAnanya.setTotalSeats(4);
        driverAnanya.setVerificationStatus(DriverStatus.APPROVED);
        driverAnanya.setProfilePhoto("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        driverRepository.save(driverAnanya);

        // 5. Approved Driver 3: Rajesh Patil (Maharashtra - Mumbai)
        User userRajesh = new User("Rajesh Patil", "marcus@smartride.com", passwordEncoder.encode("driver123"), "+91 9820011223", Role.USER);
        userRepository.save(userRajesh);

        Driver driverRajesh = new Driver();
        driverRajesh.setUser(userRajesh);
        driverRajesh.setLicenseNumber("MH12 20170098765");
        driverRajesh.setLicenseExpiry(LocalDate.now().plusYears(3));
        driverRajesh.setVehicleType("SUV");
        driverRajesh.setVehicleMake("Hyundai");
        driverRajesh.setVehicleModel("Creta SX");
        driverRajesh.setVehicleNumber("MH12XY5678");
        driverRajesh.setVehicleColor("Polar White");
        driverRajesh.setFuelType("Diesel");
        driverRajesh.setTotalSeats(4);
        driverRajesh.setVerificationStatus(DriverStatus.APPROVED);
        driverRajesh.setProfilePhoto("https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150");
        driverRepository.save(driverRajesh);

        // 6. Pending Driver: Priya Verma (Delhi NCR) - For testing Admin Approval Flow!
        User userPriya = new User("Priya Verma", "elena@smartride.com", passwordEncoder.encode("driver123"), "+91 9811223344", Role.USER);
        userRepository.save(userPriya);

        Driver driverPriya = new Driver();
        driverPriya.setUser(userPriya);
        driverPriya.setLicenseNumber("DL01 20210045678");
        driverPriya.setLicenseExpiry(LocalDate.now().plusYears(2));
        driverPriya.setVehicleType("Hatchback");
        driverPriya.setVehicleMake("Hyundai");
        driverPriya.setVehicleModel("i20 Asta");
        driverPriya.setVehicleNumber("DL01AB1234");
        driverPriya.setVehicleColor("Titan Grey");
        driverPriya.setFuelType("Petrol");
        driverPriya.setTotalSeats(3);
        driverPriya.setVerificationStatus(DriverStatus.PENDING);
        driverRepository.save(driverPriya);

        // 7. Seed Authentic Indian Active Carpooling Rides
        LocalDate today = LocalDate.now();

        // Ride 1: Hyderabad → Bengaluru (NH44 via Kurnool / Anantapur)
        Ride ride1 = new Ride();
        ride1.setDriver(driverVikram);
        ride1.setSource("Hyderabad");
        ride1.setDestination("Bengaluru");
        ride1.setDepartureDate(today.plusDays(1));
        ride1.setDepartureTime(LocalTime.of(6, 30));
        ride1.setTotalSeats(4);
        ride1.setAvailableSeats(3);
        ride1.setPricePerSeat(650.00); // ₹650
        ride1.setVehicleName("Tata Nexon EV (Electric)");
        ride1.setDescription("Traveling via NH44. Pickup at Gachibowli ORR junction or Shamshabad Airport approach. Drop at Hebbal / Silk Board. Smooth zero-emission drive with AC and mobile fast chargers.");
        ride1.setStatus(RideStatus.ACTIVE);
        rideRepository.save(ride1);

        // Ride 2: Hyderabad → Vijayawada (Via Suryapet Highway)
        Ride ride2 = new Ride();
        ride2.setDriver(driverVikram);
        ride2.setSource("Hyderabad");
        ride2.setDestination("Vijayawada");
        ride2.setDepartureDate(today.plusDays(2));
        ride2.setDepartureTime(LocalTime.of(8, 0));
        ride2.setTotalSeats(4);
        ride2.setAvailableSeats(4);
        ride2.setPricePerSeat(380.00); // ₹380
        ride2.setVehicleName("Tata Nexon EV");
        ride2.setDescription("Direct highway ride. Pickup at LB Nagar Metro station / Ramoji Film City toll. Drop at Benz Circle, Vijayawada. 1 medium luggage per traveler allowed.");
        ride2.setStatus(RideStatus.ACTIVE);
        rideRepository.save(ride2);

        // Ride 3: Hyderabad → Warangal (Via Uppal - Yadadri)
        Ride ride3 = new Ride();
        ride3.setDriver(driverVikram);
        ride3.setSource("Hyderabad");
        ride3.setDestination("Warangal");
        ride3.setDepartureDate(today.plusDays(1));
        ride3.setDepartureTime(LocalTime.of(16, 0));
        ride3.setTotalSeats(4);
        ride3.setAvailableSeats(4);
        ride3.setPricePerSeat(180.00); // ₹180
        ride3.setVehicleName("Tata Nexon EV");
        ride3.setDescription("Weekend visit to Warangal. Pickup at Uppal Circle. Drop at Hanamkonda Bus Station. Punctual departure.");
        ride3.setStatus(RideStatus.ACTIVE);
        rideRepository.save(ride3);

        // Ride 4: Hyderabad → Pune (Via Solapur)
        Ride ride4 = new Ride();
        ride4.setDriver(driverRajesh);
        ride4.setSource("Hyderabad");
        ride4.setDestination("Pune");
        ride4.setDepartureDate(today.plusDays(3));
        ride4.setDepartureTime(LocalTime.of(5, 30));
        ride4.setTotalSeats(4);
        ride4.setAvailableSeats(4);
        ride4.setPricePerSeat(750.00); // ₹750
        ride4.setVehicleName("Hyundai Creta SX (Diesel)");
        ride4.setDescription("Early morning departure via Patancheru and Solapur highway. Comfortable SUV with ample boot space. Breakfast stop on the highway.");
        ride4.setStatus(RideStatus.ACTIVE);
        rideRepository.save(ride4);

        // Ride 5: Bengaluru → Chennai (Via Hosur - Krishnagiri - Vellore)
        Ride ride5 = new Ride();
        ride5.setDriver(driverAnanya);
        ride5.setSource("Bengaluru");
        ride5.setDestination("Chennai");
        ride5.setDepartureDate(today.plusDays(1));
        ride5.setDepartureTime(LocalTime.of(7, 0));
        ride5.setTotalSeats(4);
        ride5.setAvailableSeats(4);
        ride5.setPricePerSeat(450.00); // ₹450
        ride5.setVehicleName("Maruti Suzuki Swift Dzire (CNG)");
        ride5.setDescription("Pickup at Electronic City Toll Plaza. Drop at Koyambedu / Guindy, Chennai. AC, soothing music, clean sedan.");
        ride5.setStatus(RideStatus.ACTIVE);
        rideRepository.save(ride5);

        // Ride 6: Mumbai → Pune (Via Mumbai-Pune Expressway)
        Ride ride6 = new Ride();
        ride6.setDriver(driverRajesh);
        ride6.setSource("Mumbai");
        ride6.setDestination("Pune");
        ride6.setDepartureDate(today.plusDays(1));
        ride6.setDepartureTime(LocalTime.of(10, 0));
        ride6.setTotalSeats(4);
        ride6.setAvailableSeats(3);
        ride6.setPricePerSeat(250.00); // ₹250
        ride6.setVehicleName("Hyundai Creta SX");
        ride6.setDescription("Smooth expressway cruise. Pickup at Vashi Plaza / Kharghar. Drop at Wakad Bridge / Hinjawadi Flyover, Pune.");
        ride6.setStatus(RideStatus.ACTIVE);
        rideRepository.save(ride6);

        // Ride 7: Delhi → Jaipur (Via Delhi-Jaipur Highway / Expressway)
        Ride ride7 = new Ride();
        ride7.setDriver(driverVikram);
        ride7.setSource("Delhi");
        ride7.setDestination("Jaipur");
        ride7.setDepartureDate(today.plusDays(2));
        ride7.setDepartureTime(LocalTime.of(7, 30));
        ride7.setTotalSeats(4);
        ride7.setAvailableSeats(4);
        ride7.setPricePerSeat(350.00); // ₹350
        ride7.setVehicleName("Tata Nexon EV");
        ride7.setDescription("Pickup at Dhaula Kuan / IFFCO Chowk, Gurugram. Drop at Sindhi Camp / 200 Feet Bypass, Jaipur.");
        ride7.setStatus(RideStatus.ACTIVE);
        rideRepository.save(ride7);

        // Ride 8: Completed Past Ride (Vijayawada → Hyderabad)
        Ride completedRide = new Ride();
        completedRide.setDriver(driverVikram);
        completedRide.setSource("Vijayawada");
        completedRide.setDestination("Hyderabad");
        completedRide.setDepartureDate(today.minusDays(3));
        completedRide.setDepartureTime(LocalTime.of(14, 0));
        completedRide.setTotalSeats(4);
        completedRide.setAvailableSeats(2);
        completedRide.setPricePerSeat(380.00);
        completedRide.setVehicleName("Tata Nexon EV");
        completedRide.setDescription("Completed highway journey back to Hyderabad.");
        completedRide.setStatus(RideStatus.COMPLETED);
        rideRepository.save(completedRide);

        // 8. Sample Bookings for Passenger Rahul Sharma
        Booking booking1 = new Booking();
        booking1.setPassenger(passenger);
        booking1.setRide(ride1);
        booking1.setSeatsBooked(1);
        booking1.setTotalPrice(650.00);
        booking1.setBookingStatus(BookingStatus.CONFIRMED);
        bookingRepository.save(booking1);

        Booking pastBooking = new Booking();
        pastBooking.setPassenger(passenger);
        pastBooking.setRide(completedRide);
        pastBooking.setSeatsBooked(2);
        pastBooking.setTotalPrice(760.00);
        pastBooking.setBookingStatus(BookingStatus.COMPLETED);
        bookingRepository.save(pastBooking);

        // 9. Driver Reviews
        Review review1 = new Review();
        review1.setDriver(driverVikram);
        review1.setPassenger(passenger);
        review1.setRide(completedRide);
        review1.setRating(5);
        review1.setComment("Vikram was extremely punctual and polite. Very smooth and quiet drive in his Nexon EV, and great conversation about tech!");
        reviewRepository.save(review1);

        Review review2 = new Review();
        review2.setDriver(driverAnanya);
        review2.setPassenger(passenger);
        review2.setRating(5);
        review2.setComment("Ananya drove safely along the Bengaluru-Chennai highway. The car was spotless and comfortable.");
        reviewRepository.save(review2);

        logger.info("SmartRide Indian carpooling database successfully initialized!");
    }
}
