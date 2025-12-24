package com.angel.autonow.user;

import com.angel.autonow.security.jwt.JwtResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class UserController {

	private final UserService userService;

	@PostMapping("/register")
	public ResponseEntity<JwtResponse> register(@Valid @RequestBody UserRequestDTO request) {
		String token = userService.register(request);
		return ResponseEntity.ok(new JwtResponse(token));
	}

	@PostMapping("/login")
	public ResponseEntity<JwtResponse> login(@Valid @RequestBody UserRequestDTO request) {
		String token = userService.login(request);
		return ResponseEntity.ok(new JwtResponse(token));
	}
}
