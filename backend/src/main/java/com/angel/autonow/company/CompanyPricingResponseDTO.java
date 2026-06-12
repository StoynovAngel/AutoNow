package com.angel.autonow.company;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record CompanyPricingResponseDTO(
		Long id,
		Long companyId,
		Double baseFare,
		Double ratePerKm,
		Double premiumMultiplier,
		Double nightMultiplier,
		Integer nightStartHour,
		Integer nightEndHour,
		Double ambulanceBaseFare,
		Double logisticsBaseFare,
		Double logisticsRatePerKg,
		LocalDateTime createdAt,
		LocalDateTime updatedAt
) {
}
