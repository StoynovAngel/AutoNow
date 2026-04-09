package com.angel.autonow.rating;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record RatingResponseDTO(
		Long id,
		Long orderId,
		Integer rating,
		String comment,
		LocalDateTime createdAt
) {

}
