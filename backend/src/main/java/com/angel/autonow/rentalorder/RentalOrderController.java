package com.angel.autonow.rentalorder;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/rental-orders")
public class RentalOrderController {

	private final RentalOrderService rentalOrderService;

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public ResponseEntity<RentalOrderResponseDTO> createRentalOrder(@Valid @RequestBody RentalOrderRequestDTO request) {
		return rentalOrderService.createRentalOrder(request)
				.map(order -> ResponseEntity.status(HttpStatus.CREATED).body(order))
				.orElse(ResponseEntity.badRequest().build());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'CUSTOMER')")
	public ResponseEntity<RentalOrderResponseDTO> getRentalOrderById(@PathVariable Long id) {
		return rentalOrderService.getRentalOrderById(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@GetMapping("/user/{userId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public List<RentalOrderResponseDTO> getRentalOrdersByUserId(@PathVariable Long userId) {
		return rentalOrderService.getRentalOrdersByUserId(userId);
	}

	@GetMapping("/company/{companyId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public List<RentalOrderResponseDTO> getRentalOrdersByCompanyId(@PathVariable Long companyId) {
		return rentalOrderService.getRentalOrdersByCompanyId(companyId);
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<RentalOrderResponseDTO> getAllRentalOrders() {
		return rentalOrderService.getAllRentalOrders();
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public ResponseEntity<RentalOrderResponseDTO> updateRentalOrder(@PathVariable Long id, @Valid @RequestBody RentalOrderRequestDTO request) {
		return rentalOrderService.updateRentalOrder(id, request)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@PatchMapping("/{id}/status")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<RentalOrderResponseDTO> updateRentalOrderStatus(@PathVariable Long id, @Valid @RequestBody RentalOrderStatusUpdateDTO request) {
		return rentalOrderService.updateRentalOrderStatus(id, request.status())
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping("/{id}/cancel")
	@PreAuthorize("hasRole('CUSTOMER')")
	public ResponseEntity<RentalOrderResponseDTO> cancelRentalOrder(@PathVariable Long id, Authentication authentication) {
		return rentalOrderService.cancelRentalOrder(id, authentication.getName())
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PostMapping("/{id}/admin-cancel")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<RentalOrderResponseDTO> adminCancelRentalOrder(@PathVariable Long id) {
		return rentalOrderService.adminCancelRentalOrder(id)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteRentalOrder(@PathVariable Long id) {
		return rentalOrderService.deleteRentalOrder(id)
				? ResponseEntity.noContent().build()
				: ResponseEntity.badRequest().build();
	}
}
