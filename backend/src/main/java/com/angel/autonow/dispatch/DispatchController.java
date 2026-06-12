package com.angel.autonow.dispatch;

import com.angel.autonow.order.OrderResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/dispatch")
public class DispatchController {

	private final DispatchService dispatchService;

	@PostMapping("/{orderId}/auto-assign")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<OrderResponseDTO> autoAssign(@PathVariable Long orderId) {
		return dispatchService.autoAssign(orderId)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
}
