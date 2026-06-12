package com.angel.autonow.rentalorder;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record RentalOrderRequestDTO(

		@NotNull(message = "User ID is required")
		Long userId,

		Long companyId,

		Long vehicleId,

		@NotNull(message = "Rental start date is required")
		LocalDateTime rentalStartDate,

		@NotNull(message = "Rental end date is required")
		LocalDateTime rentalEndDate,

		String specialRequirements
) {
}
