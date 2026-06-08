package com.angel.autonow.chatbot;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ChatRole {
	USER,
	ASSISTANT;

	@JsonValue
	public String toJson() {
		return name().toLowerCase();
	}

	@JsonCreator
	public static ChatRole fromJson(String value) {
		if (value == null) {
			throw new IllegalArgumentException("role must not be null");
		}
		return ChatRole.valueOf(value.trim().toUpperCase());
	}
}
