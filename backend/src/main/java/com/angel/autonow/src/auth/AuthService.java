package com.angel.autonow.src.auth;

import com.angel.autonow.src.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

	private static final String USER_READ_AUTHORITY = "user.read";

	private final AuthRepository authRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;

	private final Set<GrantedAuthority> defaultAuthorities = Set.of(new SimpleGrantedAuthority(USER_READ_AUTHORITY));

	public String register(AuthRequestDTO request) {
		String email = request.email();
		String password = request.password();

		if (authRepository.findByEmail(email).isPresent()){
			String message = "Account with this email already exists.";
			log.debug(message);
			throw new AuthUserException(message);
		}

		AuthUser newUser = AuthUser.builder()
				.email(email)
				.password(passwordEncoder.encode(password))
				.authorities(defaultAuthorities)
				.build();

		log.info("User created");

		authRepository.save(newUser);

		return jwtService.generateToken(email);
	}
}
