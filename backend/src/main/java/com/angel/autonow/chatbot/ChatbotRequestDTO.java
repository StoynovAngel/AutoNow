package com.angel.autonow.chatbot;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ChatbotRequestDTO(
		@NotBlank
		@Size(max = 500)
		String message,
		List<ChatbotMessage> history
) {}
