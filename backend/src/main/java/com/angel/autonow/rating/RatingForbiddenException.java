package com.angel.autonow.rating;

import java.io.Serial;

public class RatingForbiddenException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1L;

	public RatingForbiddenException(String message) {
		super(message);
	}
}
