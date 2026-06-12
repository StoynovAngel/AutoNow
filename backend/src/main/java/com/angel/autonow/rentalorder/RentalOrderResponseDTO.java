package com.angel.autonow.rentalorder;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder(toBuilder = true)
public record RentalOrderResponseDTO(
		Long id,
		Long userId,
		Long companyId,
		Long vehicleId,
		RentalVehicleInfoDTO vehicle,
		LocalDateTime rentalStartDate,
		LocalDateTime rentalEndDate,
		RentalOrderStatus status,
		Double totalPrice,
		String specialRequirements,
		String cancellationReason,
		LocalDateTime createdAt,
		LocalDateTime updatedAt
) {
}
