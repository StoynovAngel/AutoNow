package com.angel.autonow.company;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record CompanyRequestDTO(

		@NotBlank(message = "Company name is required")
		String name,

		@NotBlank(message = "Address is required")
		String address,

		@NotBlank(message = "Phone is required")
		@Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must be valid")
		String phone,

		@NotBlank(message = "Email is required")
		@Email(message = "Email must be valid")
		String email,

		String logoUrl,

		@jakarta.validation.constraints.Size(max = 1000, message = "Description must not exceed 1000 characters")
		String description
) { }
