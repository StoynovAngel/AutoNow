package com.angel.autonow.company;

import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.security.jwt.JwtService;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.user.role.Role;
import com.angel.autonow.vehicle.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyService {

	private final CompanyRepository companyRepository;
	private final CompanyMapper companyMapper;
	private final UserRepository userRepository;
	private final JwtService jwtService;
	private final DriverRepository driverRepository;
	private final VehicleRepository vehicleRepository;

	@Transactional
	public CompanyResponseDTO createCompany(CompanyRequestDTO request) {
		CompanyEntity company = companyMapper.toEntity(request);
		CompanyEntity saved = companyRepository.save(company);
		return companyMapper.toDTO(saved);
	}

	@Transactional
	public Optional<String> joinCompany(Long companyId, String userEmail) {
		Optional<CompanyEntity> companyOpt = companyRepository.findById(companyId);
		Optional<UserEntity> userOpt = userRepository.findByEmail(userEmail);

		if (companyOpt.isEmpty() || userOpt.isEmpty()) {
			return Optional.empty();
		}

		CompanyEntity company = companyOpt.get();
		UserEntity user = userOpt.get();
		user.setCompany(company);
		user.getAuthorities().add(Role.COMPANY_ADMIN.getAuthority());
		userRepository.save(user);

		return Optional.of(jwtService.generateToken(user.getId(), user.getEmail(), user.getAuthorities(), company.getId()));
	}

	public Optional<CompanyResponseDTO> getCompanyById(Long id) {
		return companyRepository.findById(id).map(companyMapper::toDTO);
	}

	public List<CompanyResponseDTO> getAllCompanies() {
		return companyRepository.findAll().stream()
				.map(companyMapper::toDTO)
				.toList();
	}

	public List<CompanyResponseDTO> getAllCompaniesByCompanyType(String companyType) {
		CompanyType type = CompanyType.valueOf(companyType.toUpperCase().trim());
		return companyRepository.findByCompanyType(type).stream()
				.map(companyMapper::toDTO)
				.toList();
	}

	@Transactional
	public Optional<CompanyResponseDTO> updateCompany(Long id, CompanyRequestDTO request, String userEmail) {
		UserEntity user = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));

		boolean isAdmin = user.getAuthorities().contains(Role.ADMIN.getAuthority());
		boolean isOwner = user.getCompany() != null && user.getCompany().getId().equals(id);
		if (!isAdmin && !isOwner) {
			throw new AuthorizationDeniedException("Not authorized to update company " + id);
		}

		return companyRepository.findById(id).map(company -> {
			companyMapper.updateEntity(request, company);
			return companyMapper.toDTO(companyRepository.save(company));
		});
	}

	public boolean deleteCompany(Long id) {
		if (!companyRepository.existsById(id)) {
			return false;
		}

		boolean hasDependents = userRepository.existsByCompanyId(id)
				|| driverRepository.existsByCompanyId(id)
				|| vehicleRepository.existsByCompanyId(id);

		if (hasDependents) {
			return false;
		}

		companyRepository.deleteById(id);

		return true;
	}
}
