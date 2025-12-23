package com.angel.autonow.vehicle;

public record VehicleDTO (
	String brand,
	String model,
	String imageURL,
	Boolean airConditioning,
	int numberOfSeats,
	double trunkCapacity,
	VehicleType vehicleType
) { }
