package com.angel.autonow.order;

import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Data
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "orders")
@Inheritance(strategy = InheritanceType.JOINED)
@DiscriminatorColumn(name = "order_type", discriminatorType = DiscriminatorType.STRING)
@DiscriminatorValue("BASE")
public class OrderEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "User is required")
	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private UserEntity user;

	@ManyToOne
	@JoinColumn(name = "driver_id")
	private DriverEntity driver;

	@ManyToOne
	@JoinColumn(name = "vehicle_id")
	private VehicleEntity vehicle;

	@NotNull(message = "Vehicle type is required")
	@Enumerated(EnumType.STRING)
	@Column(name = "vehicle_type", nullable = false)
	private VehicleType vehicleType;

	@NotBlank(message = "Pickup address is required")
	@Column(name = "pickup_address", nullable = false)
	private String pickupAddress;

	@NotNull(message = "Pickup latitude is required")
	@Column(name = "pickup_latitude", nullable = false)
	private Double pickupLatitude;

	@NotNull(message = "Pickup longitude is required")
	@Column(name = "pickup_longitude", nullable = false)
	private Double pickupLongitude;

	@NotBlank(message = "Dropoff address is required")
	@Column(name = "dropoff_address", nullable = false)
	private String dropoffAddress;

	@NotNull(message = "Dropoff latitude is required")
	@Column(name = "dropoff_latitude", nullable = false)
	private Double dropoffLatitude;

	@NotNull(message = "Dropoff longitude is required")
	@Column(name = "dropoff_longitude", nullable = false)
	private Double dropoffLongitude;

	@NotNull(message = "Status is required")
	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private OrderStatus status;

	@Positive(message = "Estimated price must be positive")
	@Column(name = "estimated_price")
	private Double estimatedPrice;

	@Positive(message = "Final price must be positive")
	@Column(name = "final_price")
	private Double finalPrice;

	@Positive(message = "Distance must be positive")
	@Column(name = "distance_km")
	private Double distanceKm;

	@Positive(message = "Estimated duration must be positive")
	@Column(name = "estimated_duration_minutes")
	private Integer estimatedDurationMinutes;

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
		if (status == null) status = OrderStatus.CREATED;
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
