package com.angel.autonow.rating;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ratings")
public class RatingController {

	private final RatingService ratingService;

	@PostMapping
	public ResponseEntity<RatingResponseDTO> createRating(@Valid @RequestBody RatingRequestDTO request) {
		return ratingService.createRating(request)
				.map(rating -> ResponseEntity.status(HttpStatus.CREATED).body(rating))
				.orElse(ResponseEntity.badRequest().build());
	}

	@GetMapping("/{id}")
	public ResponseEntity<RatingResponseDTO> getRatingById(@PathVariable Long id) {
		return ResponseEntity.ok(ratingService.getRatingById(id).orElse(null));
	}

	@GetMapping("/order/{orderId}")
	public ResponseEntity<RatingResponseDTO> getRatingByOrderId(@PathVariable Long orderId) {
		return ResponseEntity.ok(ratingService.getRatingByOrderId(orderId).orElse(null));
	}

	@GetMapping
	public List<RatingResponseDTO> getAllRatings() {
		return ratingService.getAllRatings();
	}
}
