package com.angel.autonow.pricing;

public record ResolvedPricing(
		double baseFare,
		double ambulanceBaseFare,
		double ratePerKm,
		double nightMultiplier,
		int nightStartHour,
		int nightEndHour,
		double logisticsBaseFare,
		double logisticsRatePerKg
) {
}
