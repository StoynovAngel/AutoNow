package com.angel.autonow.chatbot;

import java.util.List;

public interface LlmClient {
	ChatbotResponseDTO recommend(String systemPrompt, List<ChatbotMessage> history, String userMessage);
}
