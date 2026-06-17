package com.angel.autonow.order.rental;

import lombok.Builder;

@Builder
public record RentalOrderStatusUpdateDTO(
		RentalOrderStatus status
) {
}
