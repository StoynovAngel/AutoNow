package com.angel.autonow.vehicle;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

	private final VehicleRepository vehicleRepository;
	private final VehicleMapper vehicleMapper;

	public Optional<VehicleDTO> createVehicle(VehicleDTO vehicleDTO) {
		if (vehicleDTO == null) {
			throw new IllegalArgumentException("Vehicle cannot be null");
		}

		VehicleEntity vehicle = vehicleMapper.toEntity(vehicleDTO);
		vehicleRepository.save(vehicle);

		return Optional.of(vehicleMapper.toDTO(vehicle));
	}
}
