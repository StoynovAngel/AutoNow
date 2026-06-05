package com.angel.autonow.order;

import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record OrderAssignmentRequestDTO(

		@NotNull(message = "Driver ID is required")
		Long driverId,

		@NotNull(message = "Vehicle ID is required")
		Long vehicleId
) {
}
