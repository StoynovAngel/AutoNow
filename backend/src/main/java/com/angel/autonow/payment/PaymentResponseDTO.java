package com.angel.autonow.payment;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PaymentResponseDTO(
		Long id,
		Long orderId,
		Double amount,
		PaymentMethod paymentMethod,
		PaymentStatus status,
		String transactionId,
		String currency,
		LocalDateTime createdAt,
		LocalDateTime updatedAt
) {

}
