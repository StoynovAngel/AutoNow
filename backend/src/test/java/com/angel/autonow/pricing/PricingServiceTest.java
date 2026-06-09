package com.angel.autonow.pricing;

import com.angel.autonow.order.OrderEstimateRequestDTO;
import com.angel.autonow.order.OrderEstimateResponseDTO;
import com.angel.autonow.vehicle.VehicleClass;
import com.angel.autonow.vehicle.VehicleType;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class PricingServiceTest {

	private static final ZoneId SOFIA = ZoneId.of("Europe/Sofia");

	private static final PricingProperties PROPERTIES = new PricingProperties(
			2.50, 60.00, 1.20, 1.30, 1.60, 1.20, 22, 6, "Europe/Sofia", "EUR"
	);

	private PricingService serviceAt(int hour) {
		Instant instant = LocalDateTime.of(2026, 6, 4, hour, 0).atZone(SOFIA).toInstant();
		return new PricingService(PROPERTIES, Clock.fixed(instant, SOFIA));
	}

	@Test
	void calculatePrice_standardDayTime() {
		PricingService service = serviceAt(14);
		double price = service.calculatePrice(10.0, VehicleClass.STANDARD);
		assertEquals(2.50 + 10.0 * 1.20, price, 0.001);
	}

	@Test
	void calculatePrice_negativeDistance_throwsIllegalArgument() {
		PricingService service = serviceAt(14);
		IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
				() -> service.calculatePrice(-1.0, VehicleClass.STANDARD));
		assertEquals(true, ex.getMessage().contains("-1.0"));
	}

	@Test
	void calculatePrice_xlDayTime() {
		PricingService service = serviceAt(14);
		double price = service.calculatePrice(10.0, VehicleClass.XL);
		assertEquals(2.50 + 10.0 * 1.20 * 1.30, price, 0.001);
	}

	@Test
	void calculatePrice_nullClass_treatedAsStandard() {
		PricingService service = serviceAt(14);
		double price = service.calculatePrice(10.0, null);
		assertEquals(2.50 + 10.0 * 1.20, price, 0.001);
	}

	@Test
	void calculatePrice_standardAtNight_appliesNightMultiplier() {
		PricingService service = serviceAt(23);
		double price = service.calculatePrice(10.0, VehicleClass.STANDARD);
		assertEquals(2.50 + 10.0 * 1.20 * 1.20, price, 0.001);
	}

	@Test
	void calculatePrice_xlAtNight_multipliersCompose() {
		PricingService service = serviceAt(23);
		double price = service.calculatePrice(10.0, VehicleClass.XL);
		assertEquals(2.50 + 10.0 * 1.20 * 1.30 * 1.20, price, 0.001);
	}

	@Test
	void calculatePrice_atNightStartBoundary_isNight() {
		PricingService service = serviceAt(22);
		double price = service.calculatePrice(10.0, VehicleClass.STANDARD);
		assertEquals(2.50 + 10.0 * 1.20 * 1.20, price, 0.001);
	}

	@Test
	void calculatePrice_atNightEndBoundary_isDay() {
		PricingService service = serviceAt(6);
		double price = service.calculatePrice(10.0, VehicleClass.STANDARD);
		assertEquals(2.50 + 10.0 * 1.20, price, 0.001);
	}

	@Test
	void calculatePrice_pastMidnight_isNight() {
		PricingService service = serviceAt(3);
		double price = service.calculatePrice(10.0, VehicleClass.STANDARD);
		assertEquals(2.50 + 10.0 * 1.20 * 1.20, price, 0.001);
	}

	@Test
	void estimate_returnsRoundedPriceAndCurrency() {
		PricingService service = serviceAt(14);
		OrderEstimateRequestDTO request = OrderEstimateRequestDTO.builder()
				.vehicleType(VehicleType.TAXI)
				.distanceKm(7.3)
				.vehicleClass(VehicleClass.STANDARD)
				.build();

		OrderEstimateResponseDTO result = service.estimate(request);

		assertEquals(round(2.50 + 7.3 * 1.20), result.estimatedPrice(), 0.001);
		assertEquals("EUR", result.currency());
		assertEquals(7.3, result.distanceKm(), 0.001);
	}

	@Test
	void calculatePrice_ambulanceDayTime_usesAmbulanceBaseFare() {
		PricingService service = serviceAt(14);
		double price = service.calculatePrice(10.0, VehicleType.AMBULANCE, null);
		assertEquals(60.00 + 10.0 * 1.20, price, 0.001);
	}

	@Test
	void calculatePrice_ambulanceNight_appliesNightMultiplier() {
		PricingService service = serviceAt(23);
		double price = service.calculatePrice(10.0, VehicleType.AMBULANCE, null);
		assertEquals(60.00 + 10.0 * 1.20 * 1.20, price, 0.001);
	}

	@Test
	void calculatePrice_ambulanceZeroDistance_returnsBaseFareOnly() {
		PricingService service = serviceAt(14);
		double price = service.calculatePrice(0.0, VehicleType.AMBULANCE, null);
		assertEquals(60.00, price, 0.001);
	}

	private static double round(double value) {
		return Math.round(value * 100.0) / 100.0;
	}
}
