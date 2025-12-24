package com.angel.autonow.vehicle;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/vehicle")
public class VehicleController {

	private final VehicleService vehicleService;

	@PostMapping("/create")
	public ResponseEntity<VehicleDTO> createVehicle(@RequestBody VehicleDTO vehicleDTO) {
		return vehicleService.createVehicle(vehicleDTO)
				.map(vehicle -> ResponseEntity.status(HttpStatus.CREATED).body(vehicle))
				.orElse(ResponseEntity.badRequest().build());
	}
}
