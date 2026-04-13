package com.angel.autonow.user;

import com.angel.autonow.user.role.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private CustomUserDetailsService customUserDetailsService;

	@Test
	void loadUserByUsername_returnsUserDetails() {
		UserEntity entity = UserEntity.builder()
				.email("user@test.com")
				.password("encodedPassword")
				.authorities(Set.of(Role.CUSTOMER.getAuthority()))
				.build();

		when(userRepository.findByEmail("user@test.com")).thenReturn(Optional.of(entity));

		UserDetails result = customUserDetailsService.loadUserByUsername("user@test.com");

		assertEquals("user@test.com", result.getUsername());
		assertEquals("encodedPassword", result.getPassword());
		assertEquals(1, result.getAuthorities().size());
	}

	@Test
	void loadUserByUsername_multipleAuthorities() {
		UserEntity entity = UserEntity.builder()
				.email("admin@test.com")
				.password("encodedPassword")
				.authorities(Set.of(Role.ADMIN.getAuthority(), Role.CUSTOMER.getAuthority()))
				.build();

		when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(entity));

		UserDetails result = customUserDetailsService.loadUserByUsername("admin@test.com");

		assertEquals(2, result.getAuthorities().size());
	}

	@Test
	void loadUserByUsername_notFound_throwsException() {
		when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());
		assertThrows(UsernameNotFoundException.class, () -> customUserDetailsService.loadUserByUsername("unknown@test.com"));
	}
}
