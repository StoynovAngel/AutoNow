package com.angel.autonow.pricing;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "pricing")
public record PricingProperties(
		Double baseFare,
		Double ratePerKm,
		Double xlMultiplier,
		Double premiumMultiplier,
		Double nightMultiplier,
		Integer nightStartHour,
		Integer nightEndHour,
		String timezone,
		String currency,
		Double logisticsBaseFare,
		Double logisticsRatePerKg
) {
}
