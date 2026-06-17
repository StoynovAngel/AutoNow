package com.angel.autonow.pricing;

public record RentalEstimate(
		double totalPrice,
		double securityDeposit,
		String currency,
		long rentalDays,
		double pricePerDay
) {
}
