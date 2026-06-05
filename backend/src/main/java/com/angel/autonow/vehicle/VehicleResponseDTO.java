package com.angel.autonow.vehicle;

import lombok.Builder;

import java.util.Set;

@Builder
public record VehicleResponseDTO(
		Long id,
		String brand,
		String model,
		String licensePlate,
		String imageUrl,
		boolean airConditioning,
		Integer numberOfSeats,
		Double trunkCapacity,
		VehicleType vehicleType,
		Set<VehicleClass> vehicleClasses,
		Long companyId
) {

}
