package com.angel.autonow.vehicle;

import lombok.Builder;

@Builder
public record VehicleResponseDTO(
		Long id,
		String brand,
		String model,
		String licensePlate,
		String imageURL,
		boolean airConditioning,
		Integer numberOfSeats,
		Double trunkCapacity,
		VehicleType vehicleType,
		Long companyId
) {

}
