package com.angel.autonow.vehicle;

import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

	VehicleDTO toDTO(VehicleEntity vehicle);
	VehicleEntity toEntity(VehicleDTO vehicleDTO);
}
