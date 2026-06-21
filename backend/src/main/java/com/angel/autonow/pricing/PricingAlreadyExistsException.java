package com.angel.autonow.pricing;

public class PricingAlreadyExistsException extends RuntimeException {
	public PricingAlreadyExistsException(Long companyId) {
		super("Pricing already exists for company " + companyId);
	}
}
