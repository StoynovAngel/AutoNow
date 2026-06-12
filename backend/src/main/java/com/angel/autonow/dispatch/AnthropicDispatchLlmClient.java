package com.angel.autonow.dispatch;

import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.order.OrderResponseDTO;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AnthropicDispatchLlmClient implements DispatchLlmClient {

	private static final String SYSTEM_PROMPT = """
			You are a dispatcher. Pick the best available driver for the order.
			Return only the driverId from the list provided. No explanation needed.
			""";

	private final ChatClient chatClient;

	public AnthropicDispatchLlmClient(ChatClient.Builder builder) {
		this.chatClient = builder.build();
	}

	@Override
	public DispatchSuggestionDTO suggestDriver(OrderResponseDTO order, List<DriverEntity> candidates) {
		String context = "Order: type=%s pickup=\"%s\" requirements=\"%s\"\n\nDrivers:\n%s".formatted(
				order.vehicleType(),
				order.pickupAddress(),
				order.specialRequirements() != null ? order.specialRequirements() : "none",
				candidates.stream()
						.map(d -> "id=%d name=%s %s expertise=%s".formatted(
								d.getId(), d.getFirstName(), d.getLastName(), d.getExpertiseType()))
						.collect(Collectors.joining("\n"))
		);

		return chatClient.prompt()
				.messages(List.of(new SystemMessage(SYSTEM_PROMPT), new UserMessage(context)))
				.call()
				.entity(DispatchSuggestionDTO.class);
	}
}
