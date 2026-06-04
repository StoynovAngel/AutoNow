package com.angel.autonow.order;

import com.angel.autonow.vehicle.VehicleClass;
import com.angel.autonow.vehicle.VehicleType;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record OrderResponseDTO(
		Long id,
		Long userId,
		Long driverId,
		Long vehicleId,
		DriverInfoDTO driver,
		VehicleInfoDTO vehicle,
		VehicleType vehicleType,
		String pickupAddress,
		Double pickupLatitude,
		Double pickupLongitude,
		String dropoffAddress,
		Double dropoffLatitude,
		Double dropoffLongitude,
		OrderStatus status,
		Double estimatedPrice,
		Double finalPrice,
		Double distanceKm,
		Integer estimatedDurationMinutes,
		String specialRequirements,
		Integer passengerCount,
		Integer luggageCount,
		VehicleClass vehicleClass,
		Boolean requiresAirConditioning,
		String cancellationReason,
		LocalDateTime createdAt,
		LocalDateTime updatedAt
) {

}
