package com.angel.autonow.src.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import javax.crypto.spec.SecretKeySpec;
import java.util.Date;

@RequiredArgsConstructor
public class JwtService {

	private final JwtProperties properties;

	@Bean
	public JwtDecoder jwtDecoder() {
		byte[] bytes = properties.getSecret().getBytes();
		String algorithm = properties.getAlgorithm();

		SecretKeySpec secretKeySpec = new SecretKeySpec(bytes, algorithm);

		return NimbusJwtDecoder.withSecretKey(secretKeySpec).build();
	}

	@Bean
	public String generateToken(String email) {
		Algorithm algorithm = Algorithm.HMAC256(properties.getSecret());

		Date issuedAt = new Date();
		Date expiresAt = new Date(System.currentTimeMillis() + properties.getExpiration());

		return JWT.create()
				.withSubject(email)
				.withIssuedAt(issuedAt)
				.withExpiresAt(expiresAt)
				.sign(algorithm);
	}
}
