package com.angel.autonow.vehicle;

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

	public VehicleResponseDTO createVehicle(VehicleRequestDTO request) {
		VehicleEntity vehicle = vehicleMapper.toEntity(request);
		VehicleEntity saved = vehicleRepository.save(vehicle);
		return vehicleMapper.toDTO(saved);
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
		return vehicleRepository.findById(id)
				.map(vehicle -> {
					vehicleMapper.updateEntity(request, vehicle);
					return vehicleMapper.toDTO(vehicleRepository.save(vehicle));
				});
	}

	public boolean deleteVehicle(Long id) {
		if (!vehicleRepository.existsById(id)) {
			return false;
		}

		vehicleRepository.deleteById(id);

		return true;
	}
}
