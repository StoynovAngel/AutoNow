package com.angel.autonow.order;

import lombok.Builder;

@Builder
public record DriverInfoDTO(
		Long id,
		String firstName,
		String lastName,
		String phoneNumber,
		String imageUrl
) {
}
