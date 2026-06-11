package com.angel.autonow.order;

import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.vehicle.VehicleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface OrderMapper {

	@Mapping(source = "user.id", target = "userId")
	@Mapping(source = "driver.id", target = "driverId")
	@Mapping(source = "vehicle.id", target = "vehicleId")
	@Mapping(source = "driver", target = "driver", qualifiedByName = "driverToInfo")
	@Mapping(source = "vehicle", target = "vehicle", qualifiedByName = "vehicleToInfo")
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
	void updateBaseFields(OrderRequestDTO request, @MappingTarget OrderEntity entity);

	@Named("driverToInfo")
	default DriverInfoDTO driverToInfo(DriverEntity driver) {
		if (driver == null) {
			return null;
		}
		return DriverInfoDTO.builder()
				.id(driver.getId())
				.firstName(driver.getFirstName())
				.lastName(driver.getLastName())
				.phoneNumber(driver.getPhoneNumber())
				.imageUrl(driver.getImageUrl())
				.build();
	}

	@Named("vehicleToInfo")
	default VehicleInfoDTO vehicleToInfo(VehicleEntity vehicle) {
		if (vehicle == null) {
			return null;
		}
		return VehicleInfoDTO.builder()
				.id(vehicle.getId())
				.licensePlate(vehicle.getLicensePlate())
				.brand(vehicle.getBrand())
				.model(vehicle.getModel())
				.imageUrl(vehicle.getImageUrl())
				.build();
	}
}
