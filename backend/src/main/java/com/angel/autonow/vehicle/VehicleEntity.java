package com.angel.autonow.vehicle;

import com.angel.autonow.company.CompanyEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "vehicle")
public class VehicleEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Brand is required")
	@Column(name = "brand", nullable = false)
	private String brand;

	@NotBlank(message = "Model is required")
	@Column(name = "model", nullable = false)
	private String model;

	@NotBlank(message = "License plate is required")
	@Column(name = "license_plate", unique = true, nullable = false)
	private String licensePlate;

	@URL(message = "Image URL must be valid")
	@Column(name = "image_url")
	private String imageUrl;

	@Column(name = "air_conditioning")
	private boolean airConditioning;

	@Positive(message = "Number of seats must be positive")
	@Column(name = "number_of_seats")
	private Integer numberOfSeats;

	@Positive(message = "Trunk capacity must be positive")
	@Column(name = "trunk_capacity")
	private Double trunkCapacity;

	@NotNull(message = "Vehicle type is required")
	@Enumerated(EnumType.STRING)
	@Column(name = "vehicle_type")
	private VehicleType vehicleType;

	@Enumerated(EnumType.STRING)
	@Column(name = "vehicle_tier")
	private VehicleTier vehicleTier;

	@ManyToOne
	@JoinColumn(name = "company_id")
	private CompanyEntity company;
}
