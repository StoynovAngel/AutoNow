package com.angel.autonow.company;

public class PricingAlreadyExistsException extends RuntimeException {
	public PricingAlreadyExistsException(Long companyId) {
		super("Pricing already exists for company " + companyId);
	}
}
