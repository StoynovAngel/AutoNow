package com.angel.autonow.user.role;

public enum Role {
	ADMIN,
	DRIVER,
	CUSTOMER,
	GUEST;

	private static final String ROLE_PREFIX = "ROLE_";

	public String getAuthority() {
		return ROLE_PREFIX + name();
	}
}
