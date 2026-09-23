package com.angel.autonow.pricing;

import com.angel.autonow.order.OrderEstimateRequestDTO;
import com.angel.autonow.order.OrderEstimateResponseDTO;
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
	private final PricingResolver pricingResolver;
	private final Clock zonedClock;

	@Autowired
	public PricingService(PricingProperties pricingProperties, PricingResolver pricingResolver) {
		this(pricingProperties, pricingResolver, Clock.systemDefaultZone());
	}

	PricingService(PricingProperties pricingProperties, PricingResolver pricingResolver, Clock clock) {
		this.pricingProperties = pricingProperties;
		this.pricingResolver = pricingResolver;
		this.zonedClock = clock.withZone(ZoneId.of(pricingProperties.timezone()));
	}

	public OrderEstimateResponseDTO estimate(OrderEstimateRequestDTO request) {
		ResolvedPricing pricing = pricingResolver.resolve(request.companyId());

		double price = switch (request.vehicleType()) {
			case TAXI -> calculateForTaxi(request.distanceKm(), pricing);
			case AMBULANCE -> calculateForAmbulance(request.distanceKm(), pricing);
			case LOGISTICS -> calculateForLogistics(request.distanceKm(), request.weightKg(), pricing);
			default -> throw new IllegalArgumentException("Unsupported vehicle type for estimate: " + request.vehicleType());
		};

		return OrderEstimateResponseDTO.builder()
				.estimatedPrice(round(price))
				.currency(pricingProperties.currency())
				.distanceKm(request.distanceKm())
				.build();
	}

	public RentalEstimate estimateRental(Double vehicleRentalPricePerDay, Double securityDepositAmount, long days) {
		if (days <= 0) {
			throw new IllegalArgumentException("days must be positive: " + days);
		}

		Double fallback = pricingProperties.rentalRatePerDay();
		if (vehicleRentalPricePerDay == null && fallback == null) {
			throw new IllegalArgumentException("No rental price configured for this vehicle");
		}

		double pricePerDay = vehicleRentalPricePerDay != null ? vehicleRentalPricePerDay : fallback;
		double total = round(days * pricePerDay);
		double deposit = securityDepositAmount != null ? round(securityDepositAmount) : 0.0;

		return new RentalEstimate(total, deposit, pricingProperties.currency(), days, pricePerDay);
	}

	private double calculateForTaxi(double distanceKm, ResolvedPricing pricing) {
		return pricing.baseFare() + distanceKm * effectiveRatePerKm(pricing);
	}

	private double calculateForAmbulance(double distanceKm, ResolvedPricing pricing) {
		return pricing.ambulanceBaseFare() + distanceKm * 2 * effectiveRatePerKm(pricing);
	}

	private double effectiveRatePerKm(ResolvedPricing pricing) {
		double timeMultiplier = isNight(pricing) ? pricing.nightMultiplier() : 1.0;
		return pricing.ratePerKm() * timeMultiplier;
	}

	private double calculateForLogistics(double distanceKm, Double weightKg, ResolvedPricing pricing) {
		if (distanceKm < 0) {
			throw new IllegalArgumentException("distanceKm must not be negative: " + distanceKm);
		}

		double base = pricing.logisticsBaseFare();
		double distanceCost = distanceKm * pricing.ratePerKm();
		double weightCost = weightKg != null ? weightKg * pricing.logisticsRatePerKg() : 0.0;

		return base + distanceCost + weightCost;
	}

	private boolean isNight(ResolvedPricing pricing) {
		int hour = LocalTime.now(zonedClock).getHour();
		int start = pricing.nightStartHour();
		int end = pricing.nightEndHour();

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
