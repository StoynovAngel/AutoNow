package com.angel.autonow.rentalorder;

import lombok.Builder;

@Builder
public record RentalVehicleInfoDTO(
		Long id,
		String licensePlate,
		String brand,
		String model,
		String imageUrl
) {
}
