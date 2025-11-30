package com.angel.autonow.src.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expiration}")
	private long expiration;

	public String generateToken(String email) {
		Algorithm signHMAC256 = Algorithm.HMAC256(secret);

		Date issuedAt = new Date();
		Date expiresAt = new Date(System.currentTimeMillis() + expiration);

		return JWT.create()
				.withSubject(email)
				.withIssuedAt(issuedAt)
				.withExpiresAt(expiresAt)
				.sign(signHMAC256);
	}
}
