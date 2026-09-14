package com.angel.autonow.vehicle;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import lombok.Builder;
import org.hibernate.validator.constraints.URL;

@Builder
public record VehicleRequestDTO(

		@NotBlank(message = "Brand is required")
		String brand,

		@NotBlank(message = "Model is required")
		String model,

		@NotBlank(message = "License plate is required")
		@Pattern(regexp = "^[A-Z]{1,2}[0-9]{4}[A-Z]{2}$", message = "License plate must be valid (e.g. CB1234AB)")
		String licensePlate,

		@URL(message = "Image URL must be valid")
		String imageUrl,

		boolean airConditioning,

		@Min(value = 1, message = "Number of seats must be at least 1")
		@Max(value = 9, message = "Number of seats cannot exceed 9")
		Integer numberOfSeats,

		@Positive(message = "Trunk capacity must be positive")
		@DecimalMax(value = "5000.0", message = "Trunk capacity cannot exceed 5000 L")
		Double trunkCapacity,

		@Positive(message = "Rental price per day must be positive")
		Double rentalPricePerDay,

		@Positive(message = "Security deposit amount must be positive")
		Double securityDepositAmount,

		@NotNull(message = "Vehicle type is required")
		VehicleType vehicleType,

		Long companyId
) {

}
