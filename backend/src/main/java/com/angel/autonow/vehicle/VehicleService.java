package com.angel.autonow.vehicle;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
}
