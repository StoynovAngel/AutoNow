package com.angel.autonow.chatbot;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;

public record ChatbotMessage(
		@NotNull ChatRole role,
		@NotBlank String content
) {}
