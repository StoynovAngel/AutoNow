package com.angel.autonow.company;

public class PricingNotFoundException extends RuntimeException {
	public PricingNotFoundException(Long companyId) {
		super("No pricing exists for company " + companyId);
	}
}
