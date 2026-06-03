package com.angel.autonow.vehicle;

import org.springframework.stereotype.Component;

import java.util.EnumSet;
import java.util.Set;

@Component
public class VehicleClassifier {

	static final int XL_MIN_SEATS = 6;
	static final int STANDARD_MIN_SEATS = 4;

	public Set<VehicleClass> classesFor(VehicleEntity vehicle) {
		EnumSet<VehicleClass> classes = EnumSet.noneOf(VehicleClass.class);

		Integer seats = vehicle.getNumberOfSeats();
		VehicleTier tier = vehicle.getVehicleTier() == null ? VehicleTier.BASIC : vehicle.getVehicleTier();

		if (seats != null && seats >= XL_MIN_SEATS) {
			classes.add(VehicleClass.XL);
		}

		if (tier == VehicleTier.PREMIUM) {
			classes.add(VehicleClass.PREMIUM);
		}

		if (seats != null && seats >= STANDARD_MIN_SEATS && tier == VehicleTier.BASIC) {
			classes.add(VehicleClass.STANDARD);
		}

		return classes;
	}

	public boolean matches(VehicleEntity vehicle, VehicleClass requested) {
		return classesFor(vehicle).contains(requested);
	}
}
