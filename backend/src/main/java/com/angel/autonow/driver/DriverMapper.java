package com.angel.autonow.driver;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface DriverMapper {

	@Mapping(source = "company.id", target = "companyId")
	DriverResponseDTO toDTO(DriverEntity driver);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	DriverEntity toEntity(DriverRequestDTO request);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	void updateEntity(DriverRequestDTO request, @MappingTarget DriverEntity entity);
}
