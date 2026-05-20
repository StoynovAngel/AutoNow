package com.angel.autonow.order;

import jakarta.validation.constraints.NotNull;

public record OrderStatusUpdateDTO(
		@NotNull(message = "Status is required")
		OrderStatus status
) {
}
