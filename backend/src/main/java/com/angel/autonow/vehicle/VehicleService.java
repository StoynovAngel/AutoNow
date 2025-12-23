package com.angel.autonow.vehicle;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VehicleService {

	private final VehicleRepository vehicleRepository;
	private final VehicleMapper vehicleMapper;

	public VehicleDTO createVehicle(VehicleDTO vehicleDTO) {
		if (vehicleDTO == null) {
			throw new IllegalArgumentException("Vehicle cannot be null");
		}

		VehicleEntity vehicle = vehicleMapper.toEntity(vehicleDTO);
		vehicleRepository.save(vehicle);

		return vehicleMapper.toDTO(vehicle);
	}
}
