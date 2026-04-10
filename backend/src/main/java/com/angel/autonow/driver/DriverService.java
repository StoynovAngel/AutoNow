package com.angel.autonow.driver;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
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

	public Optional<DriverResponseDTO> createDriver(DriverRequestDTO request) {
		DriverEntity driver = driverMapper.toEntity(request);

		if (request.companyId() != null) {
			var company = companyRepository.findById(request.companyId());
			if (company.isEmpty()) {
				return Optional.empty();
			}
			driver.setCompany(company.get());
		}

		DriverEntity saved = driverRepository.save(driver);
		return Optional.of(driverMapper.toDTO(saved));
	}

	public Optional<DriverResponseDTO> getDriverById(Long id) {
		return driverRepository.findById(id).map(driverMapper::toDTO);
	}

	public Optional<DriverResponseDTO> getDriverByLicenseNumber(String licenseNumber) {
		return driverRepository.findByLicenseNumber(licenseNumber).map(driverMapper::toDTO);
	}

	public List<DriverResponseDTO> getAllDrivers() {
		return driverRepository.findAll().stream()
				.map(driverMapper::toDTO)
				.toList();
	}

	@Transactional
	public Optional<DriverResponseDTO> updateDriver(Long id, DriverRequestDTO request) {
		Optional<DriverEntity> existing = driverRepository.findById(id);

		if (existing.isEmpty()) {
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

		DriverEntity driver = existing.get();
		driverMapper.updateEntity(request, driver);
		driver.setCompany(company);

		return Optional.of(driverMapper.toDTO(driverRepository.save(driver)));
	}

	public List<DriverResponseDTO> getDriversByCompanyId(Long companyId) {
		return driverRepository.findByCompanyId(companyId).stream()
				.map(driverMapper::toDTO)
				.toList();
	}

	public boolean deleteDriver(Long id) {
		if (!driverRepository.existsById(id)) {
			return false;
		}

		driverRepository.deleteById(id);

		return true;
	}
}
