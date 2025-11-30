package com.angel.autonow.src.auth;

import com.angel.autonow.src.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

	private static final String USER_READ_AUTHORITY = "user.read";
	private static final String EMAIL_REGEX = "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,63}$";
	private static final String PASSWORD_REGEX = "^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$";

	private final AuthRepository authRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;

	private final Set<GrantedAuthority> defaultAuthorities = Set.of(new SimpleGrantedAuthority(USER_READ_AUTHORITY));

	public String register(AuthRequestDTO request) {
		String email = request.email();
		String password = request.password();

		if (!email.matches(EMAIL_REGEX)) {
			throw new AuthUserException("Email standards not met.");
		}

		if (!password.matches(PASSWORD_REGEX)) {
			throw new AuthUserException("Password standards not met.");
		}

		if (authRepository.findByEmail(email).isPresent()){
			throw new AuthUserException("Account with this email already exists.");
		}

		AuthUser newUser = AuthUser.builder()
				.email(email)
				.password(passwordEncoder.encode(password))
				.authorities(defaultAuthorities)
				.build();

		authRepository.save(newUser);

		return jwtService.generateToken(email);
	}
}
