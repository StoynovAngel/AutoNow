package com.angel.autonow.data;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRequestDTO;
import com.angel.autonow.company.CompanyResponseDTO;
import com.angel.autonow.company.CompanyType;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRequestDTO;
import com.angel.autonow.driver.DriverResponseDTO;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRequestDTO;
import com.angel.autonow.order.OrderResponseDTO;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.rentalorder.RentalOrderEntity;
import com.angel.autonow.rentalorder.RentalOrderRequestDTO;
import com.angel.autonow.rentalorder.RentalOrderStatus;
import com.angel.autonow.rating.RatingEntity;
import com.angel.autonow.rating.RatingRequestDTO;
import com.angel.autonow.rating.RatingResponseDTO;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.role.Role;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRequestDTO;
import com.angel.autonow.vehicle.VehicleResponseDTO;
import com.angel.autonow.vehicle.VehicleType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

public final class TestData {

	public static final long NON_EXISTENT_ID = 999L;
	public static final String DEFAULT_PICKUP_ADDRESS = "123 Main St";
	public static final String DEFAULT_DROPOFF_ADDRESS = "456 Oak Ave";
	public static final double DEFAULT_PICKUP_LAT = 42.6977;
	public static final double DEFAULT_PICKUP_LNG = 23.3219;
	public static final double DEFAULT_DROPOFF_LAT = 42.7105;
	public static final double DEFAULT_DROPOFF_LNG = 23.3238;

	private TestData() {
	}

	public static RequestPostProcessor customerJwt() {
		return jwt().authorities(new SimpleGrantedAuthority(Role.CUSTOMER.getAuthority()));
	}

	public static RequestPostProcessor customerJwt(String email) {
		return jwt().jwt(j -> j.subject(email))
				.authorities(new SimpleGrantedAuthority(Role.CUSTOMER.getAuthority()));
	}

	public static RequestPostProcessor adminJwt() {
		return jwt().authorities(new SimpleGrantedAuthority(Role.ADMIN.getAuthority()));
	}

	public static RequestPostProcessor adminJwt(String email) {
		return jwt().jwt(j -> j.subject(email))
				.authorities(new SimpleGrantedAuthority(Role.ADMIN.getAuthority()));
	}

	public static RequestPostProcessor driverJwt() {
		return jwt().authorities(new SimpleGrantedAuthority(Role.DRIVER.getAuthority()));
	}

	public static RequestPostProcessor guestJwt() {
		return jwt().authorities(new SimpleGrantedAuthority(Role.GUEST.getAuthority()));
	}

	public static RequestPostProcessor companyAdminJwt() {
		return jwt().authorities(new SimpleGrantedAuthority(Role.COMPANY_ADMIN.getAuthority()));
	}

	public static RequestPostProcessor companyAdminJwt(Long companyId) {
		return jwt().jwt(j -> j.claim("companyId", companyId))
				.authorities(new SimpleGrantedAuthority(Role.COMPANY_ADMIN.getAuthority()));
	}

	public static UserEntity createUserEntity() {
		return UserEntity.builder()
				.email("test@example.com")
				.password("encodedPassword")
				.authorities(Set.of(Role.CUSTOMER.getAuthority()))
				.build();
	}

	public static OrderEntity createOrderEntity(UserEntity user) {
		return OrderEntity.builder()
				.user(user)
				.vehicleType(VehicleType.TAXI)
				.pickupAddress(DEFAULT_PICKUP_ADDRESS)
				.pickupLatitude(DEFAULT_PICKUP_LAT)
				.pickupLongitude(DEFAULT_PICKUP_LNG)
				.dropoffAddress(DEFAULT_DROPOFF_ADDRESS)
				.dropoffLatitude(DEFAULT_DROPOFF_LAT)
				.dropoffLongitude(DEFAULT_DROPOFF_LNG)
				.status(OrderStatus.COMPLETED)
				.build();
	}

	public static OrderRequestDTO createOrderRequest(Long userId) {
		return OrderRequestDTO.builder()
				.userId(userId)
				.vehicleType(VehicleType.TAXI)
				.pickupAddress(DEFAULT_PICKUP_ADDRESS)
				.pickupLatitude(DEFAULT_PICKUP_LAT)
				.pickupLongitude(DEFAULT_PICKUP_LNG)
				.dropoffAddress(DEFAULT_DROPOFF_ADDRESS)
				.dropoffLatitude(DEFAULT_DROPOFF_LAT)
				.dropoffLongitude(DEFAULT_DROPOFF_LNG)
				.estimatedPrice(15.50)
				.distanceKm(5.2)
				.estimatedDurationMinutes(15)
				.build();
	}

	public static OrderResponseDTO createOrderResponse(Long id, Long userId, OrderStatus status, LocalDateTime createdAt) {
		return OrderResponseDTO.builder()
				.id(id)
				.userId(userId)
				.vehicleType(VehicleType.TAXI)
				.pickupAddress(DEFAULT_PICKUP_ADDRESS)
				.pickupLatitude(DEFAULT_PICKUP_LAT)
				.pickupLongitude(DEFAULT_PICKUP_LNG)
				.dropoffAddress(DEFAULT_DROPOFF_ADDRESS)
				.dropoffLatitude(DEFAULT_DROPOFF_LAT)
				.dropoffLongitude(DEFAULT_DROPOFF_LNG)
				.status(status)
				.estimatedPrice(15.50)
				.distanceKm(5.2)
				.estimatedDurationMinutes(15)
				.createdAt(createdAt)
				.build();
	}

	public static RentalOrderRequestDTO createRentalOrderRequest(Long userId) {
		return RentalOrderRequestDTO.builder()
				.userId(userId)
				.rentalStartDate(LocalDateTime.now().plusDays(1))
				.rentalEndDate(LocalDateTime.now().plusDays(4))
				.build();
	}

	public static RentalOrderEntity createRentalOrderEntity(UserEntity user) {
		return RentalOrderEntity.builder()
				.user(user)
				.rentalStartDate(LocalDateTime.now().plusDays(1))
				.rentalEndDate(LocalDateTime.now().plusDays(4))
				.status(RentalOrderStatus.CREATED)
				.build();
	}

	public static VehicleRequestDTO createVehicleRequest() {
		return VehicleRequestDTO.builder()
				.brand("Toyota")
				.model("Camry")
				.licensePlate("CB1234AB")
				.airConditioning(true)
				.numberOfSeats(5)
				.trunkCapacity(450.0)
				.vehicleType(VehicleType.TAXI)
				
				.build();
	}

	public static VehicleEntity createVehicleEntity() {
		return VehicleEntity.builder()
				.brand("Toyota")
				.model("Camry")
				.licensePlate("CB1234AB")
				.airConditioning(true)
				.numberOfSeats(5)
				.trunkCapacity(450.0)
				.vehicleType(VehicleType.TAXI)
				.imageUrl("https://example.com/vehicle.jpg")
				.build();
	}

	public static VehicleResponseDTO createVehicleResponse(Long id) {
		return VehicleResponseDTO.builder()
				.id(id)
				.brand("Toyota")
				.model("Camry")
				.licensePlate("CB1234AB")
				.airConditioning(true)
				.numberOfSeats(5)
				.trunkCapacity(450.0)
				.vehicleType(VehicleType.TAXI)
				.build();
	}

	public static DriverRequestDTO createDriverRequest() {
		return DriverRequestDTO.builder()
				.firstName("Michael")
				.lastName("Johnson")
				.phoneNumber("+359888100200")
				.expertiseType(Set.of(ExpertiseType.B))
				.available(true)
				.build();
	}

	public static DriverEntity createDriverEntity() {
		return DriverEntity.builder()
				.firstName("Michael")
				.lastName("Johnson")
				.phoneNumber("+359888100200")
				.expertiseType(Set.of(ExpertiseType.B))
				.available(true)
				.build();
	}

	public static DriverResponseDTO createDriverResponse(Long id) {
		return DriverResponseDTO.builder()
				.id(id)
				.firstName("Michael")
				.lastName("Johnson")
				.phoneNumber("+359888100200")
				.expertiseType(Set.of(ExpertiseType.B))
				.available(true)
				.vehicleIds(Collections.emptySet())
				.build();
	}

	public static RatingEntity createRatingEntity(OrderEntity order, int rating, String comment) {
		return RatingEntity.builder()
				.order(order)
				.rating(rating)
				.comment(comment)
				.build();
	}

	public static RatingRequestDTO createRatingRequest(Long orderId) {
		return RatingRequestDTO.builder()
				.orderId(orderId)
				.rating(5)
				.comment("Excellent service!")
				.build();
	}

	public static RatingRequestDTO createRatingRequest(Long orderId, int rating, String comment) {
		return RatingRequestDTO.builder()
				.orderId(orderId)
				.rating(rating)
				.comment(comment)
				.build();
	}

	public static RatingResponseDTO createRatingResponse(Long id, Long orderId, int rating, String comment, LocalDateTime createdAt) {
		return RatingResponseDTO.builder()
				.id(id)
				.orderId(orderId)
				.rating(rating)
				.comment(comment)
				.createdAt(createdAt)
				.build();
	}

	public static CompanyEntity createCompanyEntity() {
		return CompanyEntity.builder()
				.name("Test Fleet Co")
				.address("123 Test St")
				.phone("+359888300100")
				.email("test@fleet.com")
				.companyType(CompanyType.TAXI)
				.build();
	}

	public static CompanyEntity createAnotherCompanyEntity() {
		return CompanyEntity.builder()
				.name("Test Fleet Co 2")
				.address("456 Another St")
				.phone("+359888300101")
				.email("test2@fleet.com")
				.companyType(CompanyType.TAXI)
				.build();
	}

	public static CompanyRequestDTO createCompanyRequest() {
		return CompanyRequestDTO.builder()
				.name("Test Fleet Co")
				.address("123 Test St")
				.phone("+359888300100")
				.email("test@fleet.com")
				.companyType(CompanyType.TAXI)
				.build();
	}

	public static CompanyResponseDTO createCompanyResponse(Long id) {
		return CompanyResponseDTO.builder()
				.id(id)
				.name("Test Fleet Co")
				.address("123 Test St")
				.phone("+359888300100")
				.email("test@fleet.com")
				.companyType(CompanyType.TAXI)
				.build();
	}
}
