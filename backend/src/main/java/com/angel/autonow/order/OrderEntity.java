package com.angel.autonow.order;

import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.vehicle.VehicleType;
import jakarta.persistence.*;
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
@Table(name = "orders")
public class OrderEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "user_id", nullable = false)
	private UserEntity user;

	@ManyToOne
	@JoinColumn(name = "driver_id")
	private DriverEntity driver;

	@Enumerated(EnumType.STRING)
	@Column(name = "vehicle_type", nullable = false)
	private VehicleType vehicleType;

	@Column(name = "pickup_address", nullable = false)
	private String pickupAddress;

	@Column(name = "pickup_latitude", nullable = false)
	private Double pickupLatitude;

	@Column(name = "pickup_longitude", nullable = false)
	private Double pickupLongitude;

	@Column(name = "dropoff_address", nullable = false)
	private String dropoffAddress;

	@Column(name = "dropoff_latitude", nullable = false)
	private Double dropoffLatitude;

	@Column(name = "dropoff_longitude", nullable = false)
	private Double dropoffLongitude;

	@Enumerated(EnumType.STRING)
	@Column(name = "status", nullable = false)
	private OrderStatus status;

	@Column(name = "estimated_price")
	private Double estimatedPrice;

	@Column(name = "final_price")
	private Double finalPrice;

	@Column(name = "distance_km")
	private Double distanceKm;

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
