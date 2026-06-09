package com.angel.autonow.vehicle;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class VehicleClassifierTest {

	private final VehicleClassifier classifier = new VehicleClassifier();

	@Test
	void classesFor_fourSeats_returnsStandard() {
		VehicleEntity vehicle = VehicleEntity.builder().numberOfSeats(4).build();

		var classes = classifier.classesFor(vehicle);

		assertEquals(1, classes.size());
		assertTrue(classes.contains(VehicleClass.STANDARD));
	}

	@Test
	void classesFor_fiveSeats_returnsStandard() {
		VehicleEntity vehicle = VehicleEntity.builder().numberOfSeats(5).build();

		var classes = classifier.classesFor(vehicle);

		assertEquals(1, classes.size());
		assertTrue(classes.contains(VehicleClass.STANDARD));
	}

	@Test
	void classesFor_sixSeats_returnsXlOnly() {
		VehicleEntity vehicle = VehicleEntity.builder().numberOfSeats(6).build();

		var classes = classifier.classesFor(vehicle);

		assertEquals(1, classes.size());
		assertTrue(classes.contains(VehicleClass.XL));
		assertFalse(classes.contains(VehicleClass.STANDARD));
	}

	@Test
	void classesFor_threeSeats_returnsEmpty() {
		VehicleEntity vehicle = VehicleEntity.builder().numberOfSeats(3).build();

		var classes = classifier.classesFor(vehicle);

		assertTrue(classes.isEmpty());
	}

	@Test
	void classesFor_nullSeats_returnsEmpty() {
		VehicleEntity vehicle = VehicleEntity.builder().numberOfSeats(null).build();

		var classes = classifier.classesFor(vehicle);

		assertTrue(classes.isEmpty());
	}

	@Test
	void matches_xlVehicleAgainstXlRequest_true() {
		VehicleEntity vehicle = VehicleEntity.builder().numberOfSeats(8).build();

		assertTrue(classifier.matches(vehicle, VehicleClass.XL));
		assertFalse(classifier.matches(vehicle, VehicleClass.STANDARD));
	}

	@Test
	void matches_smallVehicleAgainstXlRequest_false() {
		VehicleEntity vehicle = VehicleEntity.builder().numberOfSeats(4).build();

		assertFalse(classifier.matches(vehicle, VehicleClass.XL));
		assertTrue(classifier.matches(vehicle, VehicleClass.STANDARD));
	}
}
