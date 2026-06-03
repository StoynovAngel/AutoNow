package com.angel.autonow.user;

import com.angel.autonow.security.jwt.JwtService;
import com.angel.autonow.user.role.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;
	private final JwtService jwtService;
	private final PasswordEncoder passwordEncoder;

	private final Set<String> defaultAuthorities = Set.of(Role.CUSTOMER.getAuthority());

	public String register(UserRequestDTO request) {
		String email = request.email();
		String password = request.password();

		if (userRepository.findByEmail(email).isPresent()) {
			log.warn("Registration failed: email already exists");
			throw new UserException("Account with this email already exists.");
		}

		UserEntity newUser = UserEntity.builder()
				.email(email)
				.password(passwordEncoder.encode(password))
				.authorities(defaultAuthorities)
				.build();

		userRepository.save(newUser);
		log.info("User registered successfully [{}]", email);

		return jwtService.generateToken(newUser.getId(), email, newUser.getAuthorities());
	}

	public String login(UserRequestDTO request) {
		String email = request.email();
		String password = request.password();

		UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> {
			log.warn("Login failed: user not found [{}]", email);
			return new UserException("Invalid credentials");
		});

		if (!passwordEncoder.matches(password, user.getPassword())) {
			log.warn("Login failed: invalid password [{}]", email);
			throw new UserException("Invalid credentials");
		}

		log.info("User logged in successfully [{}]", email);
		return jwtService.generateToken(user.getId(), email, user.getAuthorities());
	}
}
