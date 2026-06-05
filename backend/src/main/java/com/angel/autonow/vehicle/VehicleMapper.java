package com.angel.autonow.vehicle;

import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;

@Mapper(componentModel = "spring")
public abstract class VehicleMapper {

	@Autowired
	protected VehicleClassifier vehicleClassifier;

	@Mapping(source = "company.id", target = "companyId")
	@Mapping(target = "vehicleClasses", ignore = true)
	public abstract VehicleResponseDTO toDTO(VehicleEntity vehicle);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	public abstract VehicleEntity toEntity(VehicleRequestDTO request);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	public abstract void updateEntity(VehicleRequestDTO request, @MappingTarget VehicleEntity entity);

	@AfterMapping
	protected void populateVehicleClasses(VehicleEntity source, @MappingTarget VehicleResponseDTO.VehicleResponseDTOBuilder target) {
		target.vehicleClasses(vehicleClassifier.classesFor(source));
	}
}
