package com.angel.autonow.vehicle;

public record VehicleDTO(
		String brand,
		String model,
		String imageURL,
		boolean airConditioning,
		int numberOfSeats,
		double trunkCapacity,
		VehicleType vehicleType
) {

}
