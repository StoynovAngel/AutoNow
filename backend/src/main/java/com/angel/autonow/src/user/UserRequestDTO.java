package com.angel.autonow.src.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public class UserRequestDTO {

	private static final String PASSWORD_REGEX = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$";

	@Email
	private final String email;

	@Pattern(regexp = PASSWORD_REGEX)
	private final String password;
}
