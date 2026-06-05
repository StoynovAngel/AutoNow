package com.angel.autonow.vehicle;

import lombok.Builder;

@Builder
public record PublicVehicleResponseDTO(
		Long id,
		String brand,
		String model,
		String licensePlate,
		String imageUrl,
		Integer numberOfSeats,
		VehicleType vehicleType,
		Long companyId,
		String driverPhoneNumber
) {

}
