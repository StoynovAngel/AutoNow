package com.angel.autonow.vehicle;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record VehicleDTO(

		@NotBlank(message = "Brand is mandatory")
		@NotNull(message = "Invalid brand: brand is null")
		String brand,

		@NotBlank(message = "Model is mandatory")
		@NotNull(message = "Invalid model: model is null")
		String model,

		String imageURL,

		boolean airConditioning,

		@Positive
		Integer numberOfSeats,

		@Positive
		double trunkCapacity,

		@Enumerated(EnumType.STRING)
		VehicleType vehicleType
) {

}
