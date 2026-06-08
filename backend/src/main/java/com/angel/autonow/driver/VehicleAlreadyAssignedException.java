package com.angel.autonow.driver;

import java.io.Serial;

public class VehicleAlreadyAssignedException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1L;

	public VehicleAlreadyAssignedException(String message) {
		super(message);
	}
}
