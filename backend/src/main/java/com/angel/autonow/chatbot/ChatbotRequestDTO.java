package com.angel.autonow.chatbot;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ChatbotRequestDTO(
		@NotBlank
		@Size(max = 500)
		String message,
		@Valid
		@Size(max = 50)
		List<ChatbotMessage> history
) {}
