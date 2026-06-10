package com.angel.autonow.order;

import com.angel.autonow.vehicle.VehicleClass;
import com.angel.autonow.vehicle.VehicleType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
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

		VehicleClass vehicleClass,

		@DecimalMin(value = "0.1", message = "Weight must be at least 0.1 kg")
		@DecimalMax(value = "5000.0", message = "Weight cannot exceed 5000 kg")
		Double weightKg
) {
}
