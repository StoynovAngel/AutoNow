package com.angel.autonow.user;

import com.angel.autonow.security.jwt.JwtService;
import com.angel.autonow.user.role.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

	private static final String TEST_EMAIL = "test@example.com";
	private static final String TEST_PASSWORD = "Password1";
	private static final String ENCODED_PASSWORD = "encodedPassword";
	private static final String TEST_TOKEN = "jwt-token";

	@Mock
	private UserRepository userRepository;

	@Mock
	private JwtService jwtService;

	@Mock
	private PasswordEncoder passwordEncoder;

	@InjectMocks
	private UserService userService;

	@Test
	void register_returnToken() {
		UserRequestDTO request = new UserRequestDTO(TEST_EMAIL, TEST_PASSWORD);

		when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());
		when(passwordEncoder.encode(TEST_PASSWORD)).thenReturn(ENCODED_PASSWORD);
		when(jwtService.generateToken(any(), eq(TEST_EMAIL), any())).thenReturn(TEST_TOKEN);

		var result = userService.register(request);

		assertEquals(TEST_TOKEN, result);
		verify(userRepository).save(any(UserEntity.class));
	}

	@Test
	void register_duplicateEmail_throws() {
		UserRequestDTO request = new UserRequestDTO(TEST_EMAIL, TEST_PASSWORD);
		UserEntity existing = UserEntity.builder().email(TEST_EMAIL).build();

		when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(existing));

		assertThrows(UserException.class, () -> userService.register(request));
		verify(userRepository, never()).save(any());
	}

	@Test
	void login_returnToken() {
		UserRequestDTO request = new UserRequestDTO(TEST_EMAIL, TEST_PASSWORD);
		Set<String> authorities = Set.of(Role.CUSTOMER.getAuthority());
		UserEntity user = UserEntity.builder()
				.email(TEST_EMAIL)
				.password(ENCODED_PASSWORD)
				.authorities(authorities)
				.build();

		when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(user));
		when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(true);
		when(jwtService.generateToken(any(), eq(TEST_EMAIL), eq(authorities))).thenReturn(TEST_TOKEN);

		var result = userService.login(request);

		assertEquals(TEST_TOKEN, result);
	}

	@Test
	void login_wrongPassword_throws() {
		UserRequestDTO request = new UserRequestDTO(TEST_EMAIL, TEST_PASSWORD);
		UserEntity user = UserEntity.builder()
				.email(TEST_EMAIL)
				.password(ENCODED_PASSWORD)
				.build();

		when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.of(user));
		when(passwordEncoder.matches(TEST_PASSWORD, ENCODED_PASSWORD)).thenReturn(false);

		assertThrows(UserException.class, () -> userService.login(request));
	}

	@Test
	void login_userNotFound_throws() {
		UserRequestDTO request = new UserRequestDTO(TEST_EMAIL, TEST_PASSWORD);

		when(userRepository.findByEmail(TEST_EMAIL)).thenReturn(Optional.empty());

		assertThrows(UserException.class, () -> userService.login(request));
	}
}
