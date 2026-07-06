package com.angel.autonow.pricing;

public class PricingNotFoundException extends RuntimeException {
	public PricingNotFoundException(Long companyId) {
		super("No pricing exists for company " + companyId);
	}
}
