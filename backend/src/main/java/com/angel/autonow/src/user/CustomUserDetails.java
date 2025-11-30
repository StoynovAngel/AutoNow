package com.angel.autonow.src.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Builder
@AllArgsConstructor
public class CustomUserDetails implements UserDetails {

	private final String email;
	private final String password;
	private final Set<GrantedAuthority> authorities;

	public CustomUserDetails(UserEntity entity) {
		this.email = entity.getEmail();
		this.password = entity.getPassword();
		this.authorities = entity.getAuthorities().stream()
				.map(SimpleGrantedAuthority::new)
				.collect(Collectors.toSet());
	}

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
