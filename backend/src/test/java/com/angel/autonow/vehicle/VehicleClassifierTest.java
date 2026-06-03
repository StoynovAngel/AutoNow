package com.angel.autonow.vehicle;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class VehicleClassifierTest {

	private final VehicleClassifier classifier = new VehicleClassifier();

	@Test
	void classesFor_basicSedan_returnsStandard() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(4)
				.vehicleTier(VehicleTier.BASIC)
				.build();

		var classes = classifier.classesFor(vehicle);

		assertEquals(1, classes.size());
		assertTrue(classes.contains(VehicleClass.STANDARD));
	}

	@Test
	void classesFor_nullTier_treatedAsBasic() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(5)
				.vehicleTier(null)
				.build();

		var classes = classifier.classesFor(vehicle);

		assertTrue(classes.contains(VehicleClass.STANDARD));
		assertFalse(classes.contains(VehicleClass.PREMIUM));
	}

	@Test
	void classesFor_sixSeats_returnsXl() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(6)
				.vehicleTier(VehicleTier.BASIC)
				.build();

		var classes = classifier.classesFor(vehicle);

		assertTrue(classes.contains(VehicleClass.XL));
		assertTrue(classes.contains(VehicleClass.STANDARD));
	}

	@Test
	void classesFor_premiumFourSeater_returnsPremiumOnly() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(4)
				.vehicleTier(VehicleTier.PREMIUM)
				.build();

		var classes = classifier.classesFor(vehicle);

		assertEquals(1, classes.size());
		assertTrue(classes.contains(VehicleClass.PREMIUM));
		assertFalse(classes.contains(VehicleClass.STANDARD));
	}

	@Test
	void classesFor_sevenSeatPremium_returnsXlAndPremium() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(7)
				.vehicleTier(VehicleTier.PREMIUM)
				.build();

		var classes = classifier.classesFor(vehicle);

		assertEquals(2, classes.size());
		assertTrue(classes.contains(VehicleClass.XL));
		assertTrue(classes.contains(VehicleClass.PREMIUM));
		assertFalse(classes.contains(VehicleClass.STANDARD));
	}

	@Test
	void classesFor_threeSeats_returnsEmpty() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(3)
				.vehicleTier(VehicleTier.BASIC)
				.build();

		var classes = classifier.classesFor(vehicle);

		assertTrue(classes.isEmpty());
	}

	@Test
	void classesFor_nullSeats_returnsEmptyForBasic() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(null)
				.vehicleTier(VehicleTier.BASIC)
				.build();

		var classes = classifier.classesFor(vehicle);

		assertTrue(classes.isEmpty());
	}

	@Test
	void classesFor_nullSeatsPremium_returnsPremiumOnly() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(null)
				.vehicleTier(VehicleTier.PREMIUM)
				.build();

		var classes = classifier.classesFor(vehicle);

		assertEquals(1, classes.size());
		assertTrue(classes.contains(VehicleClass.PREMIUM));
	}

	@Test
	void matches_premiumVehicleAgainstStandardRequest_false() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(4)
				.vehicleTier(VehicleTier.PREMIUM)
				.build();

		assertFalse(classifier.matches(vehicle, VehicleClass.STANDARD));
		assertTrue(classifier.matches(vehicle, VehicleClass.PREMIUM));
	}

	@Test
	void matches_xlVehicleAgainstXlRequest_true() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.numberOfSeats(8)
				.vehicleTier(VehicleTier.BASIC)
				.build();

		assertTrue(classifier.matches(vehicle, VehicleClass.XL));
		assertTrue(classifier.matches(vehicle, VehicleClass.STANDARD));
		assertFalse(classifier.matches(vehicle, VehicleClass.PREMIUM));
	}
}
