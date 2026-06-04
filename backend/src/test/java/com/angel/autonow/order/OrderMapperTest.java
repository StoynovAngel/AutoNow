package com.angel.autonow.order;

import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleType;
import org.junit.jupiter.api.Test;
import org.mapstruct.factory.Mappers;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;

class OrderMapperTest {

	private final OrderMapper mapper = Mappers.getMapper(OrderMapper.class);

	@Test
	void toDTO_withDriverAndVehicle_embedsInfo() {
		UserEntity user = UserEntity.builder().id(7L).build();
		DriverEntity driver = DriverEntity.builder()
				.id(2L)
				.firstName("Иван")
				.lastName("Петров")
				.phoneNumber("+359888100200")
				.imageUrl("https://cdn.example.com/d.jpg")
				.build();
		VehicleEntity vehicle = VehicleEntity.builder()
				.id(3L)
				.licensePlate("CB1234AB")
				.brand("Toyota")
				.model("Camry")
				.imageUrl("https://cdn.example.com/v.jpg")
				.build();
		OrderEntity order = OrderEntity.builder()
				.id(1L)
				.user(user)
				.driver(driver)
				.vehicle(vehicle)
				.vehicleType(VehicleType.TAXI)
				.status(OrderStatus.ACCEPTED)
				.build();

		OrderResponseDTO dto = mapper.toDTO(order);

		assertEquals(1L, dto.id());
		assertEquals(7L, dto.userId());
		assertEquals(2L, dto.driverId());
		assertEquals(3L, dto.vehicleId());
		assertNotNull(dto.driver());
		assertEquals(2L, dto.driver().id());
		assertEquals("Иван", dto.driver().firstName());
		assertEquals("Петров", dto.driver().lastName());
		assertEquals("+359888100200", dto.driver().phoneNumber());
		assertEquals("https://cdn.example.com/d.jpg", dto.driver().imageUrl());
		assertNotNull(dto.vehicle());
		assertEquals(3L, dto.vehicle().id());
		assertEquals("CB1234AB", dto.vehicle().licensePlate());
		assertEquals("Toyota", dto.vehicle().brand());
		assertEquals("Camry", dto.vehicle().model());
		assertEquals("https://cdn.example.com/v.jpg", dto.vehicle().imageUrl());
	}

	@Test
	void toDTO_withoutDriverOrVehicle_infoIsNull() {
		UserEntity user = UserEntity.builder().id(7L).build();
		OrderEntity order = OrderEntity.builder()
				.id(1L)
				.user(user)
				.vehicleType(VehicleType.TAXI)
				.status(OrderStatus.CREATED)
				.build();

		OrderResponseDTO dto = mapper.toDTO(order);

		assertNull(dto.driverId());
		assertNull(dto.vehicleId());
		assertNull(dto.driver());
		assertNull(dto.vehicle());
	}
}
