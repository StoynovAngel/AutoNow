package com.angel.autonow.chatbot;

import com.angel.autonow.vehicle.VehicleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static org.hamcrest.Matchers.nullValue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class ChatbotControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@MockitoBean
	private LlmClient llmClient;

	@BeforeEach
	void resetMock() {
		org.mockito.Mockito.reset(llmClient);
	}

	@Test
	void recommendEndpointIsPubliclyAccessibleAndReturnsService() throws Exception {
		when(llmClient.recommend(any(), any(), any()))
				.thenReturn(ChatbotResponseDTO.builder()
						.reply("Try a taxi.")
						.recommendedService(VehicleType.TAXI)
						.build());

		String body = objectMapper.writeValueAsString(
				new ChatbotRequestDTO("I need to get to the airport", List.of())
		);

		mockMvc.perform(post("/api/chatbots/recommend")
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.reply").value("Try a taxi."))
				.andExpect(jsonPath("$.recommendedService").value("TAXI"));
	}

	@Test
	void recommendEndpointReturnsFallbackWhenLlmFails() throws Exception {
		when(llmClient.recommend(any(), any(), any()))
				.thenThrow(new IllegalStateException("boom"));

		String body = objectMapper.writeValueAsString(
				new ChatbotRequestDTO("hello", List.of())
		);

		mockMvc.perform(post("/api/chatbots/recommend")
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.recommendedService").value(nullValue()));
	}

	@Test
	void recommendEndpointValidatesEmptyMessage() throws Exception {
		String body = objectMapper.writeValueAsString(
				new ChatbotRequestDTO("", List.of())
		);

		mockMvc.perform(post("/api/chatbots/recommend")
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isBadRequest());
	}

	@Test
	void recommendEndpointRejectsOversizedHistory() throws Exception {
		List<ChatbotMessage> oversized = java.util.stream.IntStream.range(0, 51)
				.mapToObj(i -> new ChatbotMessage(ChatRole.USER, "msg " + i))
				.toList();
		String body = objectMapper.writeValueAsString(
				new ChatbotRequestDTO("hi", oversized)
		);

		mockMvc.perform(post("/api/chatbots/recommend")
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isBadRequest());
	}

	@Test
	void recommendEndpointValidatesNestedHistoryMessages() throws Exception {
		String body = objectMapper.writeValueAsString(
				new ChatbotRequestDTO("hi", List.of(new ChatbotMessage("", "content")))
		);

		mockMvc.perform(post("/api/chatbots/recommend")
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isBadRequest());
	}
}
