package com.angel.autonow.vehicle;

import com.angel.autonow.data.TestData;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

	@Mock
	private VehicleRepository vehicleRepository;

	@Mock
	private VehicleMapper vehicleMapper;

	@InjectMocks
	private VehicleService vehicleService;

	@Test
	void createVehicle_returnVehicleResponse() {
		VehicleRequestDTO request = TestData.createVehicleRequest();
		VehicleEntity entity = VehicleEntity.builder().brand("Toyota").model("Camry").build();
		VehicleEntity saved = VehicleEntity.builder().id(1L).brand("Toyota").model("Camry").build();
		VehicleResponseDTO response = TestData.createVehicleResponse(1L);

		when(vehicleMapper.toEntity(request)).thenReturn(entity);
		when(vehicleRepository.save(entity)).thenReturn(saved);
		when(vehicleMapper.toDTO(saved)).thenReturn(response);

		var result = vehicleService.createVehicle(request);

		assertEquals(1L, result.id());
		assertEquals("Toyota", result.brand());
		verify(vehicleRepository).save(entity);
	}

	@Test
	void getVehicleById_returnVehicleResponse() {
		VehicleEntity entity = VehicleEntity.builder().id(1L).brand("Toyota").build();
		VehicleResponseDTO response = TestData.createVehicleResponse(1L);

		when(vehicleRepository.findById(1L)).thenReturn(Optional.of(entity));
		when(vehicleMapper.toDTO(entity)).thenReturn(response);

		var result = vehicleService.getVehicleById(1L);

		assertTrue(result.isPresent());
		assertEquals("Toyota", result.get().brand());
	}

	@Test
	void getVehicleById_notFound_returnsEmpty() {
		when(vehicleRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = vehicleService.getVehicleById(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
	}

	@Test
	void getAllVehicles_returnList() {
		VehicleEntity firstVehicle = VehicleEntity.builder().id(1L).brand("Toyota").build();
		VehicleEntity secondVehicle = VehicleEntity.builder().id(2L).brand("Honda").build();
		VehicleResponseDTO firstResponse = TestData.createVehicleResponse(1L);
		VehicleResponseDTO secondResponse = VehicleResponseDTO.builder()
				.id(2L).brand("Honda").model("CR-V")
				.vehicleType(VehicleType.TAXI)
				.build();

		when(vehicleRepository.findAll()).thenReturn(List.of(firstVehicle, secondVehicle));
		when(vehicleMapper.toDTO(firstVehicle)).thenReturn(firstResponse);
		when(vehicleMapper.toDTO(secondVehicle)).thenReturn(secondResponse);

		var result = vehicleService.getAllVehicles();

		assertEquals(2, result.size());
	}

	@Test
	void getAllVehicles_emptyList() {
		when(vehicleRepository.findAll()).thenReturn(List.of());

		var result = vehicleService.getAllVehicles();

		assertTrue(result.isEmpty());
	}
}
