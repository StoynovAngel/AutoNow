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
	private static final String USER_ID = "id";
	private static final String COMPANY_ID = "companyId";

	@Value("${jwt.secret}")
	private String secret;

	@Value("${jwt.expiration}")
	private long expiration;

	public String generateToken(Long userId, String email, Collection<String> authorities, Long companyId) {
		Algorithm signHMAC256 = Algorithm.HMAC256(secret);

		Date issuedAt = new Date();
		Date expiresAt = new Date(System.currentTimeMillis() + expiration);

		var builder = JWT.create()
				.withSubject(email)
				.withIssuedAt(issuedAt)
				.withExpiresAt(expiresAt)
				.withClaim(USER_ID, userId);

		if (authorities != null && !authorities.isEmpty()) {
			builder.withArrayClaim(AUTHORITIES, authorities.toArray(String[]::new));
		}

		if (companyId != null) {
			builder.withClaim(COMPANY_ID, companyId);
		}

		return builder.sign(signHMAC256);
	}
}
