package com.angel.autonow.rentalorder;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record RentalOrderEstimateRequestDTO(

		@NotNull(message = "Vehicle ID is required")
		Long vehicleId,

		@NotNull(message = "Rental start date is required")
		LocalDateTime rentalStartDate,

		@NotNull(message = "Rental end date is required")
		LocalDateTime rentalEndDate
) {
}
