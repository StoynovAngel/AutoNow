package com.angel.autonow.payment;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payments")
public class PaymentController {

	private final PaymentService paymentService;

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public ResponseEntity<PaymentResponseDTO> createPayment(@Valid @RequestBody PaymentRequestDTO request) {
		return paymentService.createPayment(request)
				.map(payment -> ResponseEntity.status(HttpStatus.CREATED).body(payment))
				.orElse(ResponseEntity.badRequest().build());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public PaymentResponseDTO getPaymentById(@PathVariable Long id) {
		return paymentService.getPaymentById(id).orElse(null);
	}

	@GetMapping("/order/{orderId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER')")
	public PaymentResponseDTO getPaymentByOrderId(@PathVariable Long orderId) {
		return paymentService.getPaymentByOrderId(orderId).orElse(null);
	}

	@GetMapping
	@PreAuthorize("hasRole('ADMIN')")
	public List<PaymentResponseDTO> getAllPayments() {
		return paymentService.getAllPayments();
	}
}
