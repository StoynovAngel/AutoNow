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
		Set<ExpertiseType> expertiseType,
		boolean available,
		String imageUrl,
		Long companyId,
		Set<Long> vehicleIds
) {

}
