package com.angel.autonow.company;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record CompanyResponseDTO(
		Long id,
		String name,
		String address,
		String phone,
		String email,
		String logoUrl,
		String description,
		CompanyType companyType,
		LocalDateTime createdAt,
		LocalDateTime updatedAt
) {

}
