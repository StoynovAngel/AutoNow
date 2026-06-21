package com.angel.autonow.driver;

import lombok.Builder;

import java.util.Set;

@Builder
public record DriverResponseDTO(
		Long id,
		String firstName,
		String lastName,
		String phoneNumber,
		Set<DriverExpertiseType> driverExpertiseType,
		boolean available,
		String imageUrl,
		Long companyId,
		Set<Long> vehicleIds
) {

}
