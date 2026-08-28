package com.angel.autonow.user;

import java.io.Serial;

public class WebAccessDeniedException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1L;

	public WebAccessDeniedException(String message) {
		super(message);
	}
}
