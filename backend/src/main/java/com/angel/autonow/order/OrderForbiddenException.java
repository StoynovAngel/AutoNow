package com.angel.autonow.order;

import java.io.Serial;

public class OrderForbiddenException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1L;

	public OrderForbiddenException(String message) {
		super(message);
	}
}
