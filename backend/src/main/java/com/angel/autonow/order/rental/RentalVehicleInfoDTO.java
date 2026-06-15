package com.angel.autonow.order.rental;

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
