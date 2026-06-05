package com.angel.autonow.rating;

import java.io.Serial;

public class RatingConflictException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1L;

	public RatingConflictException(String message) {
		super(message);
	}
}
