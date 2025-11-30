package com.angel.autonow.src.auth;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;
import jakarta.validation.constraints.Email;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;

@Builder
public class AuthUser implements UserDetails {

	private static final String PASSWORD_REGEX = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$";

	@Email(message = "Email should be valid")
	private final String email;

	@Pattern(regexp = PASSWORD_REGEX)
	@NotEmpty(message = "Password cannot be empty")
	private final String password;

	private final Set<GrantedAuthority> authorities;

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	@Override
	public String getPassword() {
		return password;
	}

	@Override
	public String getUsername() {
		return email; // authentication is being done with email
	}
}
