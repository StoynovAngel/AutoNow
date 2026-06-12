package com.angel.autonow.order;

import com.angel.autonow.vehicle.VehicleType;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record OrderRequestDTO(

		@NotNull(message = "User ID is required")
		Long userId,

		Long companyId,

		Long driverId,

		Long vehicleId,

		@NotNull(message = "Vehicle type is required")
		VehicleType vehicleType,

		@NotBlank(message = "Pickup address is required")
		String pickupAddress,

		@NotNull(message = "Pickup latitude is required")
		Double pickupLatitude,

		@NotNull(message = "Pickup longitude is required")
		Double pickupLongitude,

		@NotBlank(message = "Dropoff address is required")
		String dropoffAddress,

		@NotNull(message = "Dropoff latitude is required")
		Double dropoffLatitude,

		@NotNull(message = "Dropoff longitude is required")
		Double dropoffLongitude,

		@Positive(message = "Estimated price must be positive")
		Double estimatedPrice,

		@Positive(message = "Distance must be positive")
		Double distanceKm,

		@Positive(message = "Estimated duration must be positive")
		Integer estimatedDurationMinutes,

		String specialRequirements,

		@DecimalMin(value = "0.1", message = "Weight must be at least 0.1 kg")
		@DecimalMax(value = "5000.0", message = "Weight cannot exceed 5000 kg")
		Double weightKg
) {

}
