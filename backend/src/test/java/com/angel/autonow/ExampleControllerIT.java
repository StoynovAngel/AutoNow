package com.angel.autonow;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ExampleControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Test
	@DisplayName("GET /api/test should return hello")
	void shouldReturnHello() throws Exception {
		mockMvc.perform(get("/api/test"))
				.andExpect(status().isOk())
				.andExpect(content().string("hello"));
	}
}
