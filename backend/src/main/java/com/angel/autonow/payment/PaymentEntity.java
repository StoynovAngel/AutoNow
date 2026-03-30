package com.angel.autonow.payment;

import com.angel.autonow.order.OrderEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "payments")
public class PaymentEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "Order is required")
	@OneToOne
	@JoinColumn(name = "order_id", nullable = false, unique = true)
	private OrderEntity order;

	@NotNull(message = "Amount is required")
	@Positive(message = "Amount must be positive")
	@Column(name = "amount", nullable = false)
	private Double amount;

	@NotNull(message = "Payment method is required")
	@Enumerated(EnumType.STRING)
	@Column(name = "payment_method", nullable = false)
	private PaymentMethod paymentMethod;

	@NotNull(message = "Status is required")
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private PaymentStatus status;

	@Column(name = "transaction_id", unique = true)
	private String transactionId;

	@NotBlank(message = "Currency is required")
	@Size(min = 3, max = 3, message = "Currency must be a 3-letter code")
	@Column(name = "currency", nullable = false)
	private String currency;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
		if (status == null) status = PaymentStatus.PENDING;
		if (currency == null) currency = "EUR";
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
