package com.angel.autonow.order.rental;

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
