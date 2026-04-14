package com.angel.autonow;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
		"cors.allowed.origins=http://localhost:8080,http://localhost:8081"
})
class AutoNowApplicationTests {

	@Test
	void contextLoads() {
	}

}
