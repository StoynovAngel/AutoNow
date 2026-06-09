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
			2.50, 1.20, 1.30, 1.60, 1.20, 22, 6, "Europe/Sofia", "EUR", 5.00, 0.05
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
	void calculateForLogistics_withWeight() {
		PricingService service = serviceAt(14);
		double price = service.calculateForLogistics(10.0, 100.0);
		// base=5.00 + distance=10*1.20 + weight=100*0.05
		assertEquals(5.00 + 10.0 * 1.20 + 100.0 * 0.05, price, 0.001);
	}

	@Test
	void calculateForLogistics_noWeight_omitsWeightCost() {
		PricingService service = serviceAt(14);
		double price = service.calculateForLogistics(10.0, null);
		assertEquals(5.00 + 10.0 * 1.20, price, 0.001);
	}

	@Test
	void calculateForLogistics_zeroDistance_chargesBaseAndWeightOnly() {
		PricingService service = serviceAt(14);
		double price = service.calculateForLogistics(0.0, 50.0);
		assertEquals(5.00 + 50.0 * 0.05, price, 0.001);
	}

	@Test
	void calculateForLogistics_negativeDistance_throwsIllegalArgument() {
		PricingService service = serviceAt(14);
		assertThrows(IllegalArgumentException.class,
				() -> service.calculateForLogistics(-1.0, 10.0));
	}

	@Test
	void estimate_logistics_routesToLogisticsCalculation() {
		PricingService service = serviceAt(14);
		OrderEstimateRequestDTO request = OrderEstimateRequestDTO.builder()
				.vehicleType(VehicleType.LOGISTICS)
				.distanceKm(10.0)
				.weightKg(100.0)
				.build();
		OrderEstimateResponseDTO result = service.estimate(request);
		assertEquals(round(5.00 + 10.0 * 1.20 + 100.0 * 0.05), result.estimatedPrice(), 0.001);
	}

	private static double round(double value) {
		return Math.round(value * 100.0) / 100.0;
	}
}
