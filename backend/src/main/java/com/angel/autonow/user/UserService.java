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
		String email = request.getEmail();
		String password = request.getPassword();

		if (userRepository.findByEmail(email).isPresent()) {
			throw new UserException("Account with this email already exists.");
		}

		UserEntity newUser = UserEntity.builder()
				.email(email)
				.password(passwordEncoder.encode(password))
				.authorities(defaultAuthorities)
				.build();

		userRepository.save(newUser);

		return jwtService.generateToken(email, newUser.getAuthorities());
	}

	public String login(UserRequestDTO request) {
		String email = request.getEmail();
		String password = request.getPassword();

		UserEntity user = userRepository.findByEmail(email).orElseThrow(() -> new UserException("Invalid credentials"));

		if (!passwordEncoder.matches(password, user.getPassword())) {
			throw new UserException("Invalid credentials");
		}

		return jwtService.generateToken(email, user.getAuthorities());
	}
}
