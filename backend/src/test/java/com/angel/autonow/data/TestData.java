package com.angel.autonow.data;

import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.rating.RatingEntity;
import com.angel.autonow.rating.RatingRequest;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.vehicle.VehicleType;

import java.util.Set;

public final class TestData {

	private TestData() {
	}

	public static UserEntity createUserEntity() {
		return UserEntity.builder()
				.email("test@example.com")
				.password("encodedPassword")
				.authorities(Set.of("ROLE_USER"))
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

	public static RatingRequest createRatingRequest(Long orderId) {
		return new RatingRequest(orderId, 5, "Excellent service!");
	}

	public static RatingRequest createRatingRequest(Long orderId, int rating, String comment) {
		return new RatingRequest(orderId, rating, comment);
	}
}
