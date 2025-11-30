package com.angel.autonow.src.user;

import com.angel.autonow.src.jwt.JwtService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

	private static final String USER_READ_AUTHORITY = "user.read";

	private final UserRepository userRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;

	private final Set<String> defaultAuthorities = Set.of(USER_READ_AUTHORITY);

	public String register(UserRequestDTO request) {
		String email = request.getEmail();
		String password = request.getPassword();

		UserEntity newUser = UserEntity.builder()
				.email(email)
				.password(passwordEncoder.encode(password))
				.authorities(defaultAuthorities)
				.build();

		log.info("User created");

		userRepository.save(newUser);

		return jwtService.generateToken(email);
	}
}
