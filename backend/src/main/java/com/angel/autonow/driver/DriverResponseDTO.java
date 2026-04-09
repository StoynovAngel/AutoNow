package com.angel.autonow.driver;

import com.angel.autonow.expertise.ExpertiseType;
import lombok.Builder;

import java.util.Set;

@Builder
public record DriverResponseDTO(
		Long id,
		String firstName,
		String lastName,
		String phoneNumber,
		String licenseNumber,
		ExpertiseType expertiseType,
		boolean available,
		String imageUrl,
		Set<Long> vehicleIds
) {

}
