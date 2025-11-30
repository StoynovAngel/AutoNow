package com.angel.autonow.src.auth;

import java.io.Serial;

public class AuthUserException extends RuntimeException {

	@Serial
	private static final long serialVersionUID = 1;

	public AuthUserException(String message) {
		super(message);
	}
}
