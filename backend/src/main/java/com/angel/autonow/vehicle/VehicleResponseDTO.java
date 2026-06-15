package com.angel.autonow.vehicle;

import lombok.Builder;

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
		Double rentalPricePerDay,
		Double securityDepositAmount,
		VehicleType vehicleType,
		Long companyId
) {

}
