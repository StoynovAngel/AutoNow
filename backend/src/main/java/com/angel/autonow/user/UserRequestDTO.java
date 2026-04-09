package com.angel.autonow.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;

public record UserRequestDTO(

		@Email(message = "Email must be valid")
		String email,

		@Pattern(regexp = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$",
				message = "Password must have at least 8 characters, one digit, one lowercase and one uppercase letter")
		String password
) {

}
