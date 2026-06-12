package com.angel.autonow.driver;

import com.angel.autonow.company.CompanyType;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
@RequestMapping("/api/drivers")
public class DriverController {

	private final DriverService driverService;

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<DriverResponseDTO> createDriver(@Valid @RequestBody DriverRequestDTO request, Authentication authentication) {
		return driverService.createDriver(request, authentication.getName())
				.map(driver -> ResponseEntity.status(HttpStatus.CREATED).body(driver))
				.orElse(ResponseEntity.badRequest().build());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER', 'COMPANY_ADMIN')")
	public DriverResponseDTO getDriverById(@PathVariable Long id) {
		return driverService.getDriverById(id).orElse(null);
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN', 'CUSTOMER', 'DRIVER')")
	public List<DriverResponseDTO> getAllDrivers() {
		return driverService.getAllDrivers();
	}

	@GetMapping("/company/{companyId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public List<DriverResponseDTO> getDriversByCompanyId(@PathVariable Long companyId) {
		return driverService.getDriversByCompanyId(companyId);
	}

	@GetMapping("/company/types/{companyType}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public List<DriverResponseDTO> getDriversByCompanyType(@PathVariable CompanyType companyType) {
		return driverService.getDriversByCompanyType(companyType);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<DriverResponseDTO> updateDriver(@PathVariable Long id, @Valid @RequestBody DriverRequestDTO request, Authentication authentication) {
		return driverService.updateDriver(id, request, authentication.getName())
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<Void> deleteDriver(@PathVariable Long id, Authentication authentication) {
		return driverService.deleteDriver(id, authentication.getName())
				? ResponseEntity.noContent().build()
				: ResponseEntity.badRequest().build();
	}

	@PutMapping("/{id}/vehicles/{vehicleId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<DriverResponseDTO> assignVehicle(@PathVariable Long id, @PathVariable Long vehicleId) {
		return driverService.assignVehicle(id, vehicleId)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}

	@DeleteMapping("/{id}/vehicles/{vehicleId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<DriverResponseDTO> unassignVehicle(@PathVariable Long id, @PathVariable Long vehicleId) {
		return driverService.unassignVehicle(id, vehicleId)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.notFound().build());
	}
}
