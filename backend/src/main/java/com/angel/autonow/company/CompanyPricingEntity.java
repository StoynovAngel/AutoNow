package com.angel.autonow.company;

import jakarta.persistence.*;
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
@Table(name = "company_pricing")
public class CompanyPricingEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotNull(message = "Company is required")
	@OneToOne
	@JoinColumn(name = "company_id", nullable = false, unique = true)
	private CompanyEntity company;

	@Column(name = "base_fare")
	private Double baseFare;

	@Column(name = "rate_per_km")
	private Double ratePerKm;

	@Column(name = "premium_multiplier")
	private Double premiumMultiplier;

	@Column(name = "night_multiplier")
	private Double nightMultiplier;

	@Column(name = "night_start_hour")
	private Integer nightStartHour;

	@Column(name = "night_end_hour")
	private Integer nightEndHour;

	@Column(name = "ambulance_base_fare")
	private Double ambulanceBaseFare;

	@Column(name = "logistics_base_fare")
	private Double logisticsBaseFare;

	@Column(name = "logistics_rate_per_kg")
	private Double logisticsRatePerKg;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
