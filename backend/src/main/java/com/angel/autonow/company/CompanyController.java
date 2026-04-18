package com.angel.autonow.company;

import com.angel.autonow.security.jwt.JwtResponse;
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
@RequestMapping("/api/companies")
public class CompanyController {

	private final CompanyService companyService;

	@PostMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'COMPANY_ADMIN')")
	public ResponseEntity<CompanyResponseDTO> createCompany(@Valid @RequestBody CompanyRequestDTO request) {
		return companyService.createCompany(request)
				.map(company -> ResponseEntity.status(HttpStatus.CREATED).body(company))
				.orElse(ResponseEntity.badRequest().build());
	}

	@PostMapping("/{id}/join")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'COMPANY_ADMIN')")
	public ResponseEntity<JwtResponse> joinCompany(@PathVariable Long id, Authentication authentication) {
		return companyService.joinCompany(id, authentication.getName())
				.map(token -> ResponseEntity.ok(new JwtResponse(token)))
				.orElse(ResponseEntity.badRequest().build());
	}

	@GetMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER', 'COMPANY_ADMIN')")
	public CompanyResponseDTO getCompanyById(@PathVariable Long id) {
		return companyService.getCompanyById(id).orElse(null);
	}

	@GetMapping
	@PreAuthorize("hasAnyRole('ADMIN', 'CUSTOMER', 'DRIVER', 'COMPANY_ADMIN')")
	public List<CompanyResponseDTO> getAllCompanies() {
		return companyService.getAllCompanies();
	}

	@PutMapping("/{id}")
	@PreAuthorize("hasAnyRole('ADMIN', 'COMPANY_ADMIN')")
	public ResponseEntity<CompanyResponseDTO> updateCompany(@PathVariable Long id, @Valid @RequestBody CompanyRequestDTO request, Authentication authentication) {
		return companyService.updateCompany(id, request, authentication.getName())
				.map(ResponseEntity::ok)
				.orElse(ResponseEntity.badRequest().build());
	}

	@DeleteMapping("/{id}")
	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<Void> deleteCompany(@PathVariable Long id) {
		return companyService.deleteCompany(id)
				? ResponseEntity.noContent().build()
				: ResponseEntity.badRequest().build();
	}
}
