package com.angel.autonow.driver;

import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.vehicle.VehicleEntity;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "drivers")
public class DriverEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "first_name", nullable = false)
	private String firstName;

	@Column(name = "last_name", nullable = false)
	private String lastName;

	@Column(name = "phone_number", unique = true, nullable = false)
	private String phoneNumber;

	@Column(name = "license_number", unique = true, nullable = false)
	private String licenseNumber;

	@ElementCollection
	@CollectionTable(name = "driver_expertise", joinColumns = @JoinColumn(name = "driver_id"))
	@Enumerated(EnumType.STRING)
	@Column(name = "expertise_type")
	private Set<ExpertiseType> expertise;

	@Column(name = "rating")
	private Double rating;

	@Column(name = "total_rides")
	private int totalRides;

	@Column(name = "is_available")
	private boolean isAvailable;

	@Column(name = "current_latitude")
	private Double currentLatitude;

	@Column(name = "current_longitude")
	private Double currentLongitude;

	@ManyToOne
	@JoinColumn(name = "vehicle_id")
	private VehicleEntity vehicle;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
		if (rating == null) {
			rating = 5.0;
		}
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
