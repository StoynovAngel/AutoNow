package com.angel.autonow.driver;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.user.role.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DriverService {

	private final DriverRepository driverRepository;
	private final DriverMapper driverMapper;
	private final CompanyRepository companyRepository;
	private final UserRepository userRepository;

	public Optional<DriverResponseDTO> createDriver(DriverRequestDTO request, String userEmail) {
		Optional<UserEntity> userOpt = userRepository.findByEmail(userEmail);
		if (userOpt.isEmpty()) {
			return Optional.empty();
		}

		UserEntity user = userOpt.get();
		DriverEntity driver = driverMapper.toEntity(request);

		if (request.companyId() != null) {
			if (!canManageCompany(user, request.companyId())) {
				return Optional.empty();
			}
			companyRepository.findById(request.companyId()).ifPresent(driver::setCompany);
		}

		DriverEntity saved = driverRepository.save(driver);
		return Optional.of(driverMapper.toDTO(saved));
	}

	@Transactional(readOnly = true)
	public Optional<DriverResponseDTO> getDriverById(Long id) {
		return driverRepository.findById(id).map(driverMapper::toDTO);
	}

	@Transactional(readOnly = true)
	public Optional<DriverResponseDTO> getDriverByLicenseNumber(String licenseNumber) {
		return driverRepository.findByLicenseNumber(licenseNumber).map(driverMapper::toDTO);
	}

	@Transactional(readOnly = true)
	public List<DriverResponseDTO> getAllDrivers() {
		return driverRepository.findAll().stream()
				.map(driverMapper::toDTO)
				.toList();
	}

	@Transactional
	public Optional<DriverResponseDTO> updateDriver(Long id, DriverRequestDTO request, String userEmail) {
		Optional<UserEntity> userOpt = userRepository.findByEmail(userEmail);
		if (userOpt.isEmpty()) {
			return Optional.empty();
		}

		Optional<DriverEntity> existing = driverRepository.findById(id);
		if (existing.isEmpty()) {
			return Optional.empty();
		}

		UserEntity user = userOpt.get();
		DriverEntity driver = existing.get();

		Long driverCompanyId = driver.getCompany() != null ? driver.getCompany().getId() : null;
		Long targetCompanyId = request.companyId() != null ? request.companyId() : driverCompanyId;

		if (targetCompanyId != null && !canManageCompany(user, targetCompanyId)) {
			return Optional.empty();
		}

		CompanyEntity company = null;
		if (request.companyId() != null) {
			var companyOpt = companyRepository.findById(request.companyId());
			if (companyOpt.isEmpty()) {
				return Optional.empty();
			}
			company = companyOpt.get();
		}

		driverMapper.updateEntity(request, driver);
		driver.setCompany(company);

		return Optional.of(driverMapper.toDTO(driverRepository.save(driver)));
	}

	@Transactional(readOnly = true)
	public List<DriverResponseDTO> getDriversByCompanyId(Long companyId) {
		return driverRepository.findByCompanyId(companyId).stream()
				.map(driverMapper::toDTO)
				.toList();
	}

	public boolean deleteDriver(Long id, String userEmail) {
		Optional<UserEntity> userOpt = userRepository.findByEmail(userEmail);
		if (userOpt.isEmpty()) {
			return false;
		}

		Optional<DriverEntity> driverOpt = driverRepository.findById(id);
		if (driverOpt.isEmpty()) {
			return false;
		}

		DriverEntity driver = driverOpt.get();
		if (driver.getCompany() != null && !canManageCompany(userOpt.get(), driver.getCompany().getId())) {
			return false;
		}

		driverRepository.deleteById(id);
		return true;
	}

	private boolean canManageCompany(UserEntity user, Long companyId) {
		boolean isAdmin = user.getAuthorities().contains(Role.ADMIN.getAuthority());
		boolean isOwner = user.getCompany() != null && user.getCompany().getId().equals(companyId);
		return isAdmin || isOwner;
	}
}
