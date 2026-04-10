package com.angel.autonow.payment;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Builder;

@Builder
public record PaymentRequestDTO(

		@NotNull(message = "Order ID is required")
		Long orderId,

		@NotNull(message = "Amount is required")
		@Positive(message = "Amount must be positive")
		Double amount,

		@NotNull(message = "Payment method is required")
		PaymentMethod paymentMethod,

		String transactionId,

		String currency
) {

}
