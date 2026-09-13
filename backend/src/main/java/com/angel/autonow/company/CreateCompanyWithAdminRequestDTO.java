package com.angel.autonow.company;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record CreateCompanyWithAdminRequestDTO(

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

		@Size(max = 1000, message = "Description must not exceed 1000 characters")
		String description,

		@NotNull(message = "Company type is required")
		CompanyType companyType,

		@NotBlank(message = "Admin email is required")
		@Email(message = "Admin email must be valid")
		String adminEmail,

		@NotBlank(message = "Admin password is required")
		@Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$",
				message = "Password must have at least 8 characters, one digit, one lowercase and one uppercase letter")
		String adminPassword
) {

	public CompanyRequestDTO toCompanyRequest() {
		return CompanyRequestDTO.builder()
				.name(name)
				.address(address)
				.phone(phone)
				.email(email)
				.description(description)
				.companyType(companyType)
				.build();
	}
}
