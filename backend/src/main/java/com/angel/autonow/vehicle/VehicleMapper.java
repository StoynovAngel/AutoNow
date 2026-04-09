package com.angel.autonow.vehicle;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

	VehicleResponseDTO toDTO(VehicleEntity vehicle);

	@Mapping(target = "id", ignore = true)
	VehicleEntity toEntity(VehicleRequestDTO request);
}
