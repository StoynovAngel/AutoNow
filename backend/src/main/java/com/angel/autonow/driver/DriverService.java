package com.angel.autonow.driver;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DriverService {

	private final DriverRepository driverRepository;
	private final DriverMapper driverMapper;

	public Optional<DriverResponseDTO> createDriver(DriverRequestDTO request) {
		DriverEntity driver = driverMapper.toEntity(request);
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
}
