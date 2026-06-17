package com.angel.autonow.order.rental;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record RentalOrderRequestDTO(
		Long companyId,
		Long vehicleId,

		@NotNull(message = "Rental start date is required")
		LocalDateTime rentalStartDate,

		@NotNull(message = "Rental end date is required")
		LocalDateTime rentalEndDate,

		String specialRequirements
) {
}
