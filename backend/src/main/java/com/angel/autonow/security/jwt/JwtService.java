package com.angel.autonow.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {

	private static final String AUTHORITIES = "authorities";

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expiration}")
	private long expiration;

	public String generateToken(String email, Collection<String> authorities) {
		Algorithm signHMAC256 = Algorithm.HMAC256(secret);

		Date issuedAt = new Date();
		Date expiresAt = new Date(System.currentTimeMillis() + expiration);

		var builder = JWT.create()
				.withSubject(email)
				.withIssuedAt(issuedAt)
				.withExpiresAt(expiresAt);

		if (authorities != null && !authorities.isEmpty()) {
			builder.withArrayClaim(AUTHORITIES, authorities.toArray(String[]::new));
		}

		return builder.sign(signHMAC256);
	}
}
