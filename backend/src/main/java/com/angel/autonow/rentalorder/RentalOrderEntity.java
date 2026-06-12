package com.angel.autonow.rentalorder;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.vehicle.VehicleEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
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
@Table(name = "rental_orders")
public class RentalOrderEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "User is required")
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private UserEntity user;

	@ManyToOne
	@JoinColumn(name = "company_id")
	private CompanyEntity company;

	@ManyToOne
	@JoinColumn(name = "vehicle_id")
	private VehicleEntity vehicle;

	@NotNull(message = "Rental start date is required")
	@Column(name = "rental_start_date", nullable = false)
	private LocalDateTime rentalStartDate;

	@NotNull(message = "Rental end date is required")
	@Column(name = "rental_end_date", nullable = false)
	private LocalDateTime rentalEndDate;

	@NotNull(message = "Status is required")
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private RentalOrderStatus status;

	@Column(name = "total_price")
	private Double totalPrice;

	@Column(name = "special_requirements")
	private String specialRequirements;

	@Column(name = "cancellation_reason")
	private String cancellationReason;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
		if (status == null) status = RentalOrderStatus.CREATED;
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
