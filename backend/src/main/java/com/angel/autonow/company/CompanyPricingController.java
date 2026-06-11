package com.angel.autonow.company;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/companies/{id}/pricing")
public class CompanyPricingController {

	private final CompanyPricingService pricingService;

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER', 'COMPANY_ADMIN')")
	public ResponseEntity<CompanyPricingResponseDTO> getPricing(@PathVariable Long id) {
		return pricingService.getPricing(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<CompanyPricingResponseDTO> createPricing(
			@PathVariable Long id,
			@RequestBody @Valid CompanyPricingRequestDTO request,
			Authentication authentication) {
		return pricingService.createPricing(id, request, authentication.getName())
				.map(dto -> ResponseEntity.status(HttpStatus.CREATED).body(dto))
				.orElse(ResponseEntity.badRequest().build());
	}

	@PutMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<CompanyPricingResponseDTO> updatePricing(
			@PathVariable Long id,
			@RequestBody @Valid CompanyPricingRequestDTO request,
			Authentication authentication) {
		return pricingService.updatePricing(id, request, authentication.getName())
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}
}
