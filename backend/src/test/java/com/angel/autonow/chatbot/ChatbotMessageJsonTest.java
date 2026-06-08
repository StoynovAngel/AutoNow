package com.angel.autonow.chatbot;

import org.junit.jupiter.api.Test;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.exc.ValueInstantiationException;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ChatbotMessageJsonTest {

	private final ObjectMapper objectMapper = new ObjectMapper();

	@Test
	void deserializesLowercaseUserRole() throws Exception {
		ChatbotMessage msg = objectMapper.readValue(
				"{\"role\":\"user\",\"content\":\"hi\"}", ChatbotMessage.class);

		assertThat(msg.role()).isEqualTo(ChatRole.USER);
		assertThat(msg.content()).isEqualTo("hi");
	}

	@Test
	void deserializesLowercaseAssistantRole() throws Exception {
		ChatbotMessage msg = objectMapper.readValue(
				"{\"role\":\"assistant\",\"content\":\"hello\"}", ChatbotMessage.class);

		assertThat(msg.role()).isEqualTo(ChatRole.ASSISTANT);
	}

	@Test
	void deserializesMixedCaseRole() throws Exception {
		ChatbotMessage msg = objectMapper.readValue(
				"{\"role\":\"User\",\"content\":\"hi\"}", ChatbotMessage.class);

		assertThat(msg.role()).isEqualTo(ChatRole.USER);
	}

	@Test
	void rejectsSystemRole() {
		assertThatThrownBy(() -> objectMapper.readValue(
				"{\"role\":\"system\",\"content\":\"hi\"}", ChatbotMessage.class))
				.isInstanceOf(ValueInstantiationException.class);
	}

	@Test
	void rejectsUnknownRole() {
		assertThatThrownBy(() -> objectMapper.readValue(
				"{\"role\":\"admin\",\"content\":\"hi\"}", ChatbotMessage.class))
				.isInstanceOf(ValueInstantiationException.class);
	}

	@Test
	void serializesRoleAsLowercase() throws Exception {
		String json = objectMapper.writeValueAsString(
				new ChatbotMessage(ChatRole.USER, "hi"));

		assertThat(json).contains("\"role\":\"user\"");
	}
}
