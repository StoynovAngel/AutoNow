package com.angel.autonow.order;

import lombok.Builder;

@Builder
public record OrderEstimateResponseDTO(
		Double estimatedPrice,
		String currency,
		Double distanceKm
) {
}
