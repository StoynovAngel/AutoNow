package com.angel.autonow.order;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface OrderMapper {

	@Mapping(source = "user.id", target = "userId")
	@Mapping(source = "driver.id", target = "driverId")
	@Mapping(source = "vehicle.id", target = "vehicleId")
	OrderResponseDTO toDTO(OrderEntity order);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "driver", ignore = true)
	@Mapping(target = "vehicle", ignore = true)
	@Mapping(target = "status", ignore = true)
	@Mapping(target = "finalPrice", ignore = true)
	@Mapping(target = "cancellationReason", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	OrderEntity toEntity(OrderRequestDTO request);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "driver", ignore = true)
	@Mapping(target = "vehicle", ignore = true)
	@Mapping(target = "status", ignore = true)
	@Mapping(target = "finalPrice", ignore = true)
	@Mapping(target = "cancellationReason", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	void updateEntity(OrderRequestDTO request, @MappingTarget OrderEntity entity);
}
