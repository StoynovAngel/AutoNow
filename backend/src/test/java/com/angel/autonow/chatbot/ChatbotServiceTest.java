package com.angel.autonow.chatbot;

import com.angel.autonow.vehicle.VehicleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ChatbotServiceTest {

	@Mock
	private LlmClient llmClient;

	@InjectMocks
	private ChatbotService service;

	@Test
	void returnsResponseFromLlmClient() {
		ChatbotResponseDTO expected = ChatbotResponseDTO.builder()
				.reply("A taxi is the best fit.")
				.recommendedService(VehicleType.TAXI)
				.build();

		when(llmClient.recommend(eq(ChatBotInstruction.SYSTEM_PROMPT), any(), eq("I need a ride to the airport")))
				.thenReturn(expected);

		ChatbotResponseDTO response = service.recommend(
				new ChatbotRequestDTO("I need a ride to the airport", List.of())
		);

		assertThat(response.reply()).isEqualTo("A taxi is the best fit.");
		assertThat(response.recommendedService()).isEqualTo(VehicleType.TAXI);
	}

	@Test
	void returnsResponseWithNullService() {
		ChatbotResponseDTO expected = ChatbotResponseDTO.builder()
				.reply("Could you tell me more?")
				.recommendedService(null)
				.build();

		when(llmClient.recommend(any(), any(), any())).thenReturn(expected);

		ChatbotResponseDTO response = service.recommend(new ChatbotRequestDTO("hi", List.of()));

		assertThat(response.reply()).isEqualTo("Could you tell me more?");
		assertThat(response.recommendedService()).isNull();
	}

	@Test
	void returnsFallbackWhenLlmClientThrows() {
		when(llmClient.recommend(any(), any(), any()))
				.thenThrow(new IllegalStateException("LLM unavailable"));

		ChatbotResponseDTO response = service.recommend(new ChatbotRequestDTO("hello", List.of()));

		assertThat(response.recommendedService()).isNull();
		assertThat(response.reply()).contains("unavailable");
	}
}
