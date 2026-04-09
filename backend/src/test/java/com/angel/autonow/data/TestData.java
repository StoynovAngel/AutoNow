package com.angel.autonow.data;

import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRequestDTO;
import com.angel.autonow.driver.DriverResponseDTO;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRequestDTO;
import com.angel.autonow.order.OrderResponseDTO;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.payment.PaymentEntity;
import com.angel.autonow.payment.PaymentMethod;
import com.angel.autonow.payment.PaymentRequestDTO;
import com.angel.autonow.payment.PaymentResponseDTO;
import com.angel.autonow.payment.PaymentStatus;
import com.angel.autonow.rating.RatingEntity;
import com.angel.autonow.rating.RatingRequestDTO;
import com.angel.autonow.rating.RatingResponseDTO;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.role.Role;
import com.angel.autonow.vehicle.VehicleType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Set;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

public final class TestData {

	public static final long NON_EXISTENT_ID = 999L;
	public static final String DEFAULT_CURRENCY = "EUR";
	public static final double DEFAULT_AMOUNT = 16.00;
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

	public static RequestPostProcessor adminJwt() {
		return jwt().authorities(new SimpleGrantedAuthority(Role.ADMIN.getAuthority()));
	}

	public static RequestPostProcessor driverJwt() {
		return jwt().authorities(new SimpleGrantedAuthority(Role.DRIVER.getAuthority()));
	}

	public static RequestPostProcessor guestJwt() {
		return jwt().authorities(new SimpleGrantedAuthority(Role.GUEST.getAuthority()));
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
		return new OrderRequestDTO(
				userId,
				null,
				null,
				VehicleType.TAXI,
				DEFAULT_PICKUP_ADDRESS,
				DEFAULT_PICKUP_LAT,
				DEFAULT_PICKUP_LNG,
				DEFAULT_DROPOFF_ADDRESS,
				DEFAULT_DROPOFF_LAT,
				DEFAULT_DROPOFF_LNG,
				15.50,
				5.2,
				15,
				null
		);
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

	public static DriverRequestDTO createDriverRequest() {
		return new DriverRequestDTO("Michael", "Johnson", "+1234567890", "DL-TEST-001", ExpertiseType.B, true, null);
	}

	public static DriverEntity createDriverEntity() {
		return DriverEntity.builder()
				.firstName("Michael")
				.lastName("Johnson")
				.phoneNumber("+1234567890")
				.licenseNumber("DL-TEST-001")
				.expertiseType(ExpertiseType.B)
				.available(true)
				.build();
	}

	public static DriverResponseDTO createDriverResponse(Long id) {
		return DriverResponseDTO.builder()
				.id(id)
				.firstName("Michael")
				.lastName("Johnson")
				.phoneNumber("+1234567890")
				.licenseNumber("DL-TEST-001")
				.expertiseType(ExpertiseType.B)
				.available(true)
				.vehicleIds(Collections.emptySet())
				.build();
	}

	public static PaymentRequestDTO createPaymentRequest(Long orderId) {
		return new PaymentRequestDTO(orderId, DEFAULT_AMOUNT, PaymentMethod.CREDIT_CARD, "TXN-TEST-001", DEFAULT_CURRENCY);
	}

	public static PaymentEntity createPaymentEntity(OrderEntity order, double amount, PaymentMethod method, PaymentStatus status) {
		return PaymentEntity.builder()
				.order(order)
				.amount(amount)
				.paymentMethod(method)
				.status(status)
				.currency(DEFAULT_CURRENCY)
				.build();
	}

	public static PaymentResponseDTO createPaymentResponse(Long id, Long orderId, double amount, PaymentMethod method, PaymentStatus status, LocalDateTime createdAt) {
		return PaymentResponseDTO.builder()
				.id(id)
				.orderId(orderId)
				.amount(amount)
				.paymentMethod(method)
				.status(status)
				.currency(DEFAULT_CURRENCY)
				.createdAt(createdAt)
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
		return new RatingRequestDTO(orderId, 5, "Excellent service!");
	}

	public static RatingRequestDTO createRatingRequest(Long orderId, int rating, String comment) {
		return new RatingRequestDTO(orderId, rating, comment);
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
}
