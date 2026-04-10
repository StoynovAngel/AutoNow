package com.angel.autonow.driver;

import com.angel.autonow.expertise.ExpertiseType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record DriverRequestDTO(

		@NotBlank(message = "First name is required")
		String firstName,

		@NotBlank(message = "Last name is required")
		String lastName,

		@NotBlank(message = "Phone number is required")
		@Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must be valid")
		String phoneNumber,

		@NotBlank(message = "License number is required")
		String licenseNumber,

		@NotNull(message = "Expertise type is required")
		ExpertiseType expertiseType,

		boolean available,

		String imageUrl,

		Long companyId
) {

}
