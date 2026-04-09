package com.angel.autonow.driver;

import com.angel.autonow.vehicle.VehicleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface DriverMapper {

	@Mapping(source = "vehicles", target = "vehicleIds", qualifiedByName = "vehiclesToIds")
	DriverResponseDTO toDTO(DriverEntity driver);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "vehicles", ignore = true)
	DriverEntity toEntity(DriverRequestDTO request);

	@Named("vehiclesToIds")
	default Set<Long> vehiclesToIds(Set<VehicleEntity> vehicles) {
		if (vehicles == null) {
			return Collections.emptySet();
		}

		return vehicles.stream()
				.map(VehicleEntity::getId)
				.collect(Collectors.toSet());
	}
}
