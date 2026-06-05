package com.angel.autonow.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class JwtServiceTest {

	@Autowired
	private JwtService jwtService;

	@Value("${jwt.secret}")
	private String secret;

	@Test
	void generateToken_containsSubjectAndAuthorities() {
		String token = jwtService.generateToken(7L, "user@test.com", List.of("ROLE_CUSTOMER"), null);

		DecodedJWT decoded = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);

		assertEquals("user@test.com", decoded.getSubject());
		assertEquals(7L, decoded.getClaim("id").asLong());
		assertNotNull(decoded.getIssuedAt());
		assertNotNull(decoded.getExpiresAt());
		assertTrue(decoded.getExpiresAt().after(decoded.getIssuedAt()));

		String[] authorities = decoded.getClaim("authorities").asArray(String.class);
		assertArrayEquals(new String[]{"ROLE_CUSTOMER"}, authorities);
	}

	@Test
	void generateToken_multipleAuthorities() {
		String token = jwtService.generateToken(1L, "admin@test.com", List.of("ROLE_ADMIN", "ROLE_CUSTOMER"), null);

		DecodedJWT decoded = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);

		String[] authorities = decoded.getClaim("authorities").asArray(String.class);
		assertEquals(2, authorities.length);
	}

	@Test
	void generateToken_emptyAuthorities_noAuthoritiesClaim() {
		String token = jwtService.generateToken(1L, "user@test.com", Collections.emptyList(), null);
		DecodedJWT decoded = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
		assertTrue(decoded.getClaim("authorities").isMissing() || decoded.getClaim("authorities").isNull());
	}

	@Test
	void generateToken_nullAuthorities_noAuthoritiesClaim() {
		String token = jwtService.generateToken(1L, "user@test.com", null, null);
		DecodedJWT decoded = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
		assertTrue(decoded.getClaim("authorities").isMissing() || decoded.getClaim("authorities").isNull());
	}

	@Test
	void generateToken_isVerifiable() {
		String token = jwtService.generateToken(1L, "user@test.com", List.of("ROLE_CUSTOMER"), null);
		assertDoesNotThrow(() -> JWT.require(Algorithm.HMAC256(secret)).build().verify(token));
	}

	@Test
	void generateToken_invalidSecret_failsVerification() {
		String token = jwtService.generateToken(1L, "user@test.com", List.of("ROLE_CUSTOMER"), null);
		var verifier = JWT.require(Algorithm.HMAC256("wrong-secret")).build();
		assertThrows(Exception.class, () -> verifier.verify(token));
	}

	@Test
	void generateToken_withCompanyId_containsCompanyIdClaim() {
		String token = jwtService.generateToken(1L, "user@test.com", List.of("ROLE_COMPANY_ADMIN"), 42L);
		DecodedJWT decoded = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
		assertEquals(42L, decoded.getClaim("companyId").asLong());
	}

	@Test
	void generateToken_nullCompanyId_noCompanyIdClaim() {
		String token = jwtService.generateToken(1L, "user@test.com", List.of("ROLE_CUSTOMER"), null);
		DecodedJWT decoded = JWT.require(Algorithm.HMAC256(secret)).build().verify(token);
		assertTrue(decoded.getClaim("companyId").isMissing() || decoded.getClaim("companyId").isNull());
	}
}
