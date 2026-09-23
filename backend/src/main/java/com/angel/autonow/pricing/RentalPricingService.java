package com.angel.autonow.pricing;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class RentalPricingService {

	private final PricingProperties pricingProperties;

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

	private double round(double value) {
		return BigDecimal.valueOf(value)
				.setScale(2, RoundingMode.HALF_UP)
				.doubleValue();
	}
}
