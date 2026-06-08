package com.angel.autonow.chatbot;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
public class ChatbotController {

	private final ChatbotService chatbotService;

	@PostMapping("/recommend")
	public ResponseEntity<ChatbotResponseDTO> recommend(@Valid @RequestBody ChatbotRequestDTO request) {
		return ResponseEntity.ok(chatbotService.recommend(request));
	}
}
