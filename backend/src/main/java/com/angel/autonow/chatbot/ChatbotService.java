package com.angel.autonow.chatbot;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChatbotService {

	private final LlmClient llmClient;

	public ChatbotResponseDTO recommend(ChatbotRequestDTO request) {
		try {
			return llmClient.recommend(ChatBotInstruction.SYSTEM_PROMPT, request.history(), request.message());
		} catch (Exception e) {
			log.error("Chatbot failed", e);

			return ChatbotResponseDTO.builder()
					.reply("Sorry, the assistant is unavailable right now. Please pick a service from the menu.")
					.recommendedService(null)
					.build();
		}
	}
}
