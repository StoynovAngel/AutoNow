package com.angel.autonow.rating;

import java.time.LocalDateTime;

public record RatingResponseDTO(
		Long id,
		Long orderId,
		Integer rating,
		String comment,
		LocalDateTime createdAt
) {

}
