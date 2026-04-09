package com.angel.autonow.data;

import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.rating.RatingEntity;
import com.angel.autonow.rating.RatingRequestDTO;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.role.Role;
import com.angel.autonow.vehicle.VehicleType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

import java.util.Set;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;

public final class TestData {

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
				.pickupAddress("123 Main St")
				.pickupLatitude(42.6977)
				.pickupLongitude(23.3219)
				.dropoffAddress("456 Oak Ave")
				.dropoffLatitude(42.7105)
				.dropoffLongitude(23.3238)
				.status(OrderStatus.COMPLETED)
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
}
