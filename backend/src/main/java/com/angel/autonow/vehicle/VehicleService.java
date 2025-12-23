package com.angel.autonow.vehicle;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.NotImplementedException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VehicleService {

	private final VehicleRepository vehicleRepository;

	public VehicleDTO createVehicle(VehicleDTO vehicleDTO) {
		if (vehicleDTO == null) {
			throw new IllegalArgumentException("Vehicle cannot be null");
		}

		throw new NotImplementedException();
	}
}
