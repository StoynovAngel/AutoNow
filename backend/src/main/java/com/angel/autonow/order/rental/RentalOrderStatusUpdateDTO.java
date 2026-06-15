package com.angel.autonow.order.rental;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record RentalOrderStatusUpdateDTO(
		RentalOrderStatus status
) {
}
