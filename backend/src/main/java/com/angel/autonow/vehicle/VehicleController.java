package com.angel.autonow.vehicle;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vehicles")
public class VehicleController {

	private final VehicleService vehicleService;

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<VehicleResponseDTO> createVehicle(@Valid @RequestBody VehicleRequestDTO request) {
		return vehicleService.createVehicle(request)
				.map(vehicle -> ResponseEntity.status(HttpStatus.CREATED).body(vehicle))
				.orElse(ResponseEntity.badRequest().build());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER', 'GUEST', 'COMPANY_ADMIN')")
	public VehicleResponseDTO getVehicleById(@PathVariable Long id) {
		return vehicleService.getVehicleById(id).orElse(null);
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'CUSTOMER', 'DRIVER', 'GUEST')")
	public List<VehicleResponseDTO> getAllVehicles() {
		return vehicleService.getAllVehicles();
	}

	@GetMapping("/company/{companyId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public List<VehicleResponseDTO> getVehiclesByCompanyId(@PathVariable Long companyId) {
		return vehicleService.getVehiclesByCompanyId(companyId);
	}

	@GetMapping("/my")
	@PreAuthorize("hasRole('COMPANY_ADMIN')")
	public ResponseEntity<List<VehicleResponseDTO>> getMyVehicles(Authentication authentication) {
		JwtAuthenticationToken jwt = (JwtAuthenticationToken) authentication;
		Long companyId = jwt.getToken().getClaim("companyId");
		if (companyId == null) {
			return ResponseEntity.badRequest().build();
		}
		return ResponseEntity.ok(vehicleService.getVehiclesByCompanyId(companyId));
	}

	@GetMapping("/public/company/{companyId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER', 'GUEST')")
	public List<PublicVehicleResponseDTO> getPublicVehiclesByCompanyId(
			@PathVariable Long companyId,
			@RequestParam(name = "vehicleType", required = false) VehicleType vehicleType) {
		return vehicleService.getPublicVehiclesByCompanyAndType(companyId, vehicleType);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<VehicleResponseDTO> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequestDTO request) {
		return vehicleService.updateVehicle(id, request)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
		return vehicleService.deleteVehicle(id)
				? ResponseEntity.noContent().build()
				: ResponseEntity.badRequest().build();
	}
}
