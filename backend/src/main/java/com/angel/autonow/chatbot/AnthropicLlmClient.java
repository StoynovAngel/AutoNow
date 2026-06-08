package com.angel.autonow.chatbot;

import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class AnthropicLlmClient implements LlmClient {

	private final ChatClient chatClient;

	public AnthropicLlmClient(ChatClient.Builder chatClientBuilder) {
		this.chatClient = chatClientBuilder.build();
	}

	@Override
	public ChatbotResponseDTO recommend(String systemPrompt, List<ChatbotMessage> history, String userMessage) {
		List<Message> messages = new ArrayList<>();
		messages.add(new SystemMessage(systemPrompt));

		if (history == null) {
			history = List.of();
		}

		for (var message : history) {
			if ("user".equalsIgnoreCase(message.role())) {
				messages.add(new UserMessage(message.content()));
			} else {
				messages.add(new AssistantMessage(message.content()));
			}
		}

		messages.add(new UserMessage(userMessage));

		return chatClient.prompt()
				.messages(messages)
				.call()
				.entity(ChatbotResponseDTO.class);
	}
}
