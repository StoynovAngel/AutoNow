package com.angel.autonow.vehicle;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

	@Column(name = "brand", nullable = false)
	private String brand;

	@Column(name = "model", nullable = false)
	private String model;

	@Column(name = "image_url")
	private String imageURL;

	@Column(name = "air_conditioning")
	private boolean airConditioning = true;

	@Column(name = "number_of_seats")
	private int numberOfSeats = 5;

	@Column(name = "trunk_capacity")
	private double trunkCapacity;

	@Column(name = "vehicle_type")
	private VehicleType vehicleType;
}
