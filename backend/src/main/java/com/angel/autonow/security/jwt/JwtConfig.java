package com.angel.autonow.security.jwt;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;

import javax.crypto.spec.SecretKeySpec;

@Configuration
public class JwtConfig {

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.algorithm:HmacSHA256}")
	private String algorithm;

	@Bean
	public JwtDecoder jwtDecoder() {
		byte[] bytes = secret.getBytes();
		SecretKeySpec secretKeySpec = new SecretKeySpec(bytes, algorithm);
		return NimbusJwtDecoder
				.withSecretKey(secretKeySpec)
				.macAlgorithm(MacAlgorithm.HS256)
				.build();
	}
}
