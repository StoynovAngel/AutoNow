package com.angel.autonow.rentalorder;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record RentalOrderStatusUpdateDTO(
		RentalOrderStatus status
) {
}
