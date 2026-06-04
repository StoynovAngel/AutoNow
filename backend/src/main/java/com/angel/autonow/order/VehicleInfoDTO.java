package com.angel.autonow.order;

import lombok.Builder;

@Builder
public record VehicleInfoDTO(
		Long id,
		String licensePlate,
		String brand,
		String model,
		String imageUrl
) {
}
