package com.angel.autonow.rating;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ratings")
public class RatingController {

	private final RatingService ratingService;

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public ResponseEntity<RatingResponseDTO> createRating(@Valid @RequestBody RatingRequestDTO request) {
		return ratingService.createRating(request)
				.map(rating -> ResponseEntity.status(HttpStatus.CREATED).body(rating))
				.orElse(ResponseEntity.badRequest().build());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER')")
	public RatingResponseDTO getRatingById(@PathVariable Long id) {
		return ratingService.getRatingById(id).orElse(null);
	}

	@GetMapping("/order/{orderId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER')")
	public RatingResponseDTO getRatingByOrderId(@PathVariable Long orderId) {
		return ratingService.getRatingByOrderId(orderId).orElse(null);
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER')")
	public List<RatingResponseDTO> getAllRatings() {
		return ratingService.getAllRatings();
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public ResponseEntity<RatingResponseDTO> updateRating(@PathVariable Long id, @Valid @RequestBody RatingRequestDTO request) {
		return ratingService.updateRating(id, request)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public ResponseEntity<Void> deleteRating(@PathVariable Long id) {
		return ratingService.deleteRating(id)
				? ResponseEntity.noContent().build()
				: ResponseEntity.badRequest().build();
	}
}
