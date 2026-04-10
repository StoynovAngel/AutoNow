package com.angel.autonow.vehicle;

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
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vehicles")
public class VehicleController {

	private final VehicleService vehicleService;

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public VehicleResponseDTO createVehicle(@Valid @RequestBody VehicleRequestDTO request) {
		return vehicleService.createVehicle(request);
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER', 'GUEST')")
	public VehicleResponseDTO getVehicleById(@PathVariable Long id) {
		return vehicleService.getVehicleById(id).orElse(null);
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER', 'GUEST')")
	public List<VehicleResponseDTO> getAllVehicles() {
		return vehicleService.getAllVehicles();
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<VehicleResponseDTO> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequestDTO request) {
		return vehicleService.updateVehicle(id, request)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
		return vehicleService.deleteVehicle(id)
				? ResponseEntity.noContent().build()
				: ResponseEntity.badRequest().build();
	}
}
