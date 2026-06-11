package com.angel.autonow.company;

import lombok.Builder;

@Builder
public record CompanyPricingRequestDTO(
		Double baseFare,
		Double ratePerKm,
		Double premiumMultiplier,
		Double nightMultiplier,
		Integer nightStartHour,
		Integer nightEndHour,
		Double ambulanceBaseFare,
		Double logisticsBaseFare,
		Double logisticsRatePerKg
) {
}
