package com.angel.autonow.rentalorder;

import lombok.Builder;

@Builder
public record RentalOrderEstimateResponseDTO(
		Double totalPrice,
		Double securityDeposit,
		String currency,
		long rentalDays,
		Double pricePerDay
) {
}
