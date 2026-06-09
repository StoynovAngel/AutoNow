package com.angel.autonow.pricing;

import com.angel.autonow.order.OrderEstimateRequestDTO;
import com.angel.autonow.order.OrderEstimateResponseDTO;
import com.angel.autonow.vehicle.VehicleClass;
import com.angel.autonow.vehicle.VehicleType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.LocalTime;
import java.time.ZoneId;

@Service
public class PricingService {

	private final PricingProperties pricingProperties;
	private final Clock zonedClock;

	@Autowired
	public PricingService(PricingProperties pricingProperties) {
		this(pricingProperties, Clock.systemDefaultZone());
	}

	PricingService(PricingProperties pricingProperties, Clock clock) {
		this.pricingProperties = pricingProperties;
		this.zonedClock = clock.withZone(ZoneId.of(pricingProperties.timezone()));
	}

	public OrderEstimateResponseDTO estimate(OrderEstimateRequestDTO request) {
		double price = calculatePrice(request.distanceKm(), request.vehicleType(), request.vehicleClass());

		return OrderEstimateResponseDTO.builder()
				.estimatedPrice(round(price))
				.currency(pricingProperties.currency())
				.distanceKm(request.distanceKm())
				.build();
	}

	public double calculatePrice(double distanceKm, VehicleType vehicleType, VehicleClass vehicleClass) {
		if (distanceKm < 0) {
			throw new IllegalArgumentException("distanceKm must not be negative: " + distanceKm);
		}

		double base = vehicleType == VehicleType.AMBULANCE
				? pricingProperties.ambulanceBaseFare()
				: pricingProperties.baseFare();
		double rate = pricingProperties.ratePerKm();
		double classMultiplier = multiplierFor(vehicleClass);
		double timeMultiplier = isNight() ? pricingProperties.nightMultiplier() : 1.0;

		return base + distanceKm * rate * classMultiplier * timeMultiplier;
	}

	public double calculatePrice(double distanceKm, VehicleClass vehicleClass) {
		return calculatePrice(distanceKm, null, vehicleClass);
	}

	private double multiplierFor(VehicleClass vehicleClass) {
		if (vehicleClass == null) {
			return 1.0;
		}

		return switch (vehicleClass) {
			case XL -> pricingProperties.xlMultiplier();
			case STANDARD -> 1.0;
		};
	}

	private boolean isNight() {
		int hour = LocalTime.now(zonedClock).getHour();
		int start = pricingProperties.nightStartHour();
		int end = pricingProperties.nightEndHour();

		// Night window may wrap past midnight. Two cases:
		//   start=22, end=6  → night is [22..23] ∪ [0..5]; 23h=night, 5h=night, 6h=day, 21h=day
		//   start=1,  end=5  → night is [1..4];           2h=night, 5h=day, 0h=day
		// End hour is exclusive in both cases (so end=6 means 06:00 sharp is already day).
		if (start < end) {
			return hour >= start && hour < end;
		}

		return hour >= start || hour < end;
	}

	private double round(double value) {
		return BigDecimal.valueOf(value)
				.setScale(2, RoundingMode.HALF_UP)
				.doubleValue();
	}
}
