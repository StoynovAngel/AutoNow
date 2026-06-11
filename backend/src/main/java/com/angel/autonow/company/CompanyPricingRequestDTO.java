package com.angel.autonow.company;

import com.angel.autonow.annotation.NightHoursNotEqual;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
@NightHoursNotEqual
public record CompanyPricingRequestDTO(
		@Positive Double baseFare,
		@Positive Double ratePerKm,
		@Positive Double premiumMultiplier,
		@Positive Double nightMultiplier,
		@Min(0) @Max(23) Integer nightStartHour,
		@Min(0) @Max(23) Integer nightEndHour,
		@Positive Double ambulanceBaseFare,
		@Positive Double logisticsBaseFare,
		@Positive Double logisticsRatePerKg
) {
}
