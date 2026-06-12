package com.angel.autonow.vehicle;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface VehicleMapper {

	@Mapping(source = "company.id", target = "companyId")
	VehicleResponseDTO toDTO(VehicleEntity vehicle);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	VehicleEntity toEntity(VehicleRequestDTO request);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	void updateEntity(VehicleRequestDTO request, @MappingTarget VehicleEntity entity);
}
