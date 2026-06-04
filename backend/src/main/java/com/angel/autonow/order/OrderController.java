package com.angel.autonow.order;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/orders")
public class OrderController {

	private final OrderService orderService;

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public ResponseEntity<OrderResponseDTO> createOrder(@Valid @RequestBody OrderRequestDTO request) {
		return orderService.createOrder(request)
				.map(order -> ResponseEntity.status(HttpStatus.CREATED).body(order))
				.orElse(ResponseEntity.badRequest().build());
	}

	@PostMapping("/estimate")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public OrderEstimateResponseDTO estimate(@Valid @RequestBody OrderEstimateRequestDTO request) {
		return orderService.estimate(request);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER')")
	public OrderResponseDTO getOrderById(@PathVariable Long id) {
		return orderService.getOrderById(id).orElse(null);
	}

	@GetMapping("/user/{userId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public List<OrderResponseDTO> getOrdersByUserId(@PathVariable Long userId) {
		return orderService.getOrdersByUserId(userId);
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<OrderResponseDTO> getAllOrders() {
		return orderService.getAllOrders();
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public ResponseEntity<OrderResponseDTO> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderRequestDTO request) {
		return orderService.updateOrder(id, request)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@PatchMapping("/{id}/status")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER')")
	public ResponseEntity<OrderResponseDTO> updateOrderStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateDTO request) {
		return orderService.updateOrderStatus(id, request.status())
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@PatchMapping("/{id}/assign")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<OrderResponseDTO> assignOrder(@PathVariable Long id, @Valid @RequestBody OrderAssignmentRequestDTO request) {
		return orderService.assignOrder(id, request)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
		return orderService.deleteOrder(id)
				? ResponseEntity.noContent().build()
				: ResponseEntity.badRequest().build();
	}
}
