package com.angel.autonow.chatbot;

import com.angel.autonow.vehicle.VehicleType;
import lombok.Builder;

@Builder
public record ChatbotResponseDTO(
		String reply,
		VehicleType recommendedService
) {}
