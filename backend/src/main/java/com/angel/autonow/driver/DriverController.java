package com.angel.autonow.driver;

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
@RequestMapping("/api/drivers")
public class DriverController {

	private final DriverService driverService;

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<DriverResponseDTO> createDriver(@Valid @RequestBody DriverRequestDTO request) {
		return driverService.createDriver(request)
				.map(driver -> ResponseEntity.status(HttpStatus.CREATED).body(driver))
				.orElse(ResponseEntity.badRequest().build());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER')")
	public DriverResponseDTO getDriverById(@PathVariable Long id) {
		return driverService.getDriverById(id).orElse(null);
	}

	@GetMapping("/license/{licenseNumber}")
	@PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
	public DriverResponseDTO getDriverByLicenseNumber(@PathVariable String licenseNumber) {
		return driverService.getDriverByLicenseNumber(licenseNumber).orElse(null);
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER')")
	public List<DriverResponseDTO> getAllDrivers() {
		return driverService.getAllDrivers();
	}

	@GetMapping("/company/{companyId}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public List<DriverResponseDTO> getDriversByCompanyId(@PathVariable Long companyId) {
		return driverService.getDriversByCompanyId(companyId);
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<DriverResponseDTO> updateDriver(@PathVariable Long id, @Valid @RequestBody DriverRequestDTO request) {
		return driverService.updateDriver(id, request)
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<Void> deleteDriver(@PathVariable Long id) {
		return driverService.deleteDriver(id)
				? ResponseEntity.noContent().build()
				: ResponseEntity.badRequest().build();
	}
}
