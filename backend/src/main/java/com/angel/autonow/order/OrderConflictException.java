package com.angel.autonow.order;

import java.io.Serial;

public class OrderConflictException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1L;

	public OrderConflictException(String message) {
		super(message);
	}
}
