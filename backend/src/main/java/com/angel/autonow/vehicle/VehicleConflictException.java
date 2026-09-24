package com.angel.autonow.vehicle;

import java.io.Serial;

public class VehicleConflictException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1L;

	public VehicleConflictException(String message) {
		super(message);
	}
}
