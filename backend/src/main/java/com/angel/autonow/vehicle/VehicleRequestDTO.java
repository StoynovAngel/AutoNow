package com.angel.autonow.vehicle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record VehicleRequestDTO(

		@NotBlank(message = "Brand is required")
		String brand,

		@NotBlank(message = "Model is required")
		String model,

		String imageURL,

		boolean airConditioning,

		@Positive(message = "Number of seats must be positive")
		Integer numberOfSeats,

		@Positive(message = "Trunk capacity must be positive")
		Double trunkCapacity,

		@NotNull(message = "Vehicle type is required")
		VehicleType vehicleType
) {

}
