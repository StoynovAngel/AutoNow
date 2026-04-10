package com.angel.autonow.vehicle;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

	private final VehicleRepository vehicleRepository;
	private final VehicleMapper vehicleMapper;
	private final CompanyRepository companyRepository;

	public Optional<VehicleResponseDTO> createVehicle(VehicleRequestDTO request) {
		VehicleEntity vehicle = vehicleMapper.toEntity(request);

		if (request.companyId() != null) {
			var company = companyRepository.findById(request.companyId());
			if (company.isEmpty()) {
				return Optional.empty();
			}
			vehicle.setCompany(company.get());
		}

		VehicleEntity saved = vehicleRepository.save(vehicle);
		return Optional.of(vehicleMapper.toDTO(saved));
	}

	public Optional<VehicleResponseDTO> getVehicleById(Long id) {
		return vehicleRepository.findById(id)
				.map(vehicleMapper::toDTO);
	}

	public List<VehicleResponseDTO> getAllVehicles() {
		return vehicleRepository.findAll().stream()
				.map(vehicleMapper::toDTO)
				.toList();
	}

	@Transactional
	public Optional<VehicleResponseDTO> updateVehicle(Long id, VehicleRequestDTO request) {
		Optional<VehicleEntity> existing = vehicleRepository.findById(id);

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

		VehicleEntity vehicle = existing.get();
		vehicleMapper.updateEntity(request, vehicle);
		vehicle.setCompany(company);

		return Optional.of(vehicleMapper.toDTO(vehicleRepository.save(vehicle)));
	}

	public List<VehicleResponseDTO> getVehiclesByCompanyId(Long companyId) {
		return vehicleRepository.findByCompanyId(companyId).stream()
				.map(vehicleMapper::toDTO)
				.toList();
	}

	public boolean deleteVehicle(Long id) {
		if (!vehicleRepository.existsById(id)) {
			return false;
		}

		vehicleRepository.deleteById(id);

		return true;
	}
}
