package com.angel.autonow.driver;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DriverMapper {

	@Mapping(source = "company.id", target = "companyId")
	@Mapping(source = "preferredVehicle.id", target = "preferredVehicleId")
	DriverResponseDTO toDTO(DriverEntity driver);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	@Mapping(target = "preferredVehicle", ignore = true)
	DriverEntity toEntity(DriverRequestDTO request);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	@Mapping(target = "preferredVehicle", ignore = true)
	void updateEntity(DriverRequestDTO request, @MappingTarget DriverEntity entity);
}
