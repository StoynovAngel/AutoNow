package com.angel.autonow.order;

import com.angel.autonow.vehicle.VehicleClass;
import com.angel.autonow.vehicle.VehicleType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record OrderEstimateRequestDTO(

		@NotNull(message = "Vehicle type is required")
		VehicleType vehicleType,

		@NotNull(message = "Distance is required")
		@Positive(message = "Distance must be positive")
		Double distanceKm,

		VehicleClass vehicleClass
) {
}
