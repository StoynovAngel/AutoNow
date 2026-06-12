package com.angel.autonow.rentalorder;

import com.angel.autonow.vehicle.VehicleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface RentalOrderMapper {

	@Mapping(source = "user.id", target = "userId")
	@Mapping(source = "company.id", target = "companyId")
	@Mapping(source = "vehicle.id", target = "vehicleId")
	@Mapping(source = "vehicle", target = "vehicle", qualifiedByName = "vehicleToInfo")
	RentalOrderResponseDTO toDTO(RentalOrderEntity order);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "user", ignore = true)
	@Mapping(target = "company", ignore = true)
	@Mapping(target = "vehicle", ignore = true)
	@Mapping(target = "status", ignore = true)
	@Mapping(target = "totalPrice", ignore = true)
	@Mapping(target = "cancellationReason", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	void updateBaseFields(RentalOrderRequestDTO request, @MappingTarget RentalOrderEntity entity);

	@Named("vehicleToInfo")
	default RentalVehicleInfoDTO vehicleToInfo(VehicleEntity vehicle) {
		if (vehicle == null) {
			return null;
		}
		return RentalVehicleInfoDTO.builder()
				.id(vehicle.getId())
				.licensePlate(vehicle.getLicensePlate())
				.brand(vehicle.getBrand())
				.model(vehicle.getModel())
				.imageUrl(vehicle.getImageUrl())
				.build();
	}
}
