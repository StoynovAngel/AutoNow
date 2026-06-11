package com.angel.autonow.vehicle;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.data.TestData;
import com.angel.autonow.driver.DriverEntity;
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

	@Mock
	private CompanyRepository companyRepository;

	@Mock
	private com.angel.autonow.order.OrderRepository orderRepository;

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

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		assertEquals("Toyota", result.get().brand());
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

	@Test
	void updateVehicle_returnUpdatedResponse() {
		VehicleRequestDTO request = TestData.createVehicleRequest();
		VehicleEntity existing = VehicleEntity.builder().id(1L).brand("Toyota").build();
		VehicleEntity saved = VehicleEntity.builder().id(1L).brand("Toyota").build();
		VehicleResponseDTO response = TestData.createVehicleResponse(1L);

		when(vehicleRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(vehicleRepository.save(existing)).thenReturn(saved);
		when(vehicleMapper.toDTO(saved)).thenReturn(response);

		var result = vehicleService.updateVehicle(1L, request);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		verify(vehicleMapper).updateEntity(request, existing);
		verify(vehicleRepository).save(existing);
	}

	@Test
	void updateVehicle_notFound_returnsEmpty() {
		VehicleRequestDTO request = TestData.createVehicleRequest();

		when(vehicleRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = vehicleService.updateVehicle(NON_EXISTENT_ID, request);

		assertTrue(result.isEmpty());
		verify(vehicleRepository, never()).save(any());
	}

	@Test
	void getVehiclesByCompanyId_returnList() {
		VehicleEntity vehicle1 = VehicleEntity.builder().id(1L).brand("Toyota").build();
		VehicleEntity vehicle2 = VehicleEntity.builder().id(2L).brand("Honda").build();
		VehicleResponseDTO response1 = TestData.createVehicleResponse(1L);
		VehicleResponseDTO response2 = VehicleResponseDTO.builder()
				.id(2L).brand("Honda").model("CR-V")
				.vehicleType(VehicleType.TAXI)
				.build();

		when(vehicleRepository.findByCompanyId(10L)).thenReturn(List.of(vehicle1, vehicle2));
		when(vehicleMapper.toDTO(vehicle1)).thenReturn(response1);
		when(vehicleMapper.toDTO(vehicle2)).thenReturn(response2);

		var result = vehicleService.getVehiclesByCompanyId(10L);

		assertEquals(2, result.size());
		assertEquals("Toyota", result.get(0).brand());
		assertEquals("Honda", result.get(1).brand());
	}

	@Test
	void getVehiclesByCompanyId_noVehicles_returnsEmptyList() {
		when(vehicleRepository.findByCompanyId(NON_EXISTENT_ID)).thenReturn(List.of());
		var result = vehicleService.getVehiclesByCompanyId(NON_EXISTENT_ID);
		assertTrue(result.isEmpty());
	}

	@Test
	void getPublicVehiclesByCompanyAndType_filtersByTypeAndIncludesDriverPhone() {
		CompanyEntity company = CompanyEntity.builder().id(10L).build();
		DriverEntity driver = DriverEntity.builder()
				.id(7L).firstName("Ivan").lastName("Petrov")
				.phoneNumber("+359888111222").build();
		VehicleEntity prom = VehicleEntity.builder()
				.id(1L).brand("Mercedes").model("E-Class")
				.licensePlate("CB1234AB").numberOfSeats(4)
				.vehicleType(VehicleType.PROM).company(company).driver(driver).build();

		when(vehicleRepository.findByCompanyIdAndVehicleType(10L, VehicleType.PROM))
				.thenReturn(List.of(prom));

		var result = vehicleService.getPublicVehiclesByCompanyAndType(10L, VehicleType.PROM);

		assertEquals(1, result.size());
		assertEquals("Mercedes", result.get(0).brand());
		assertEquals("+359888111222", result.get(0).driverPhoneNumber());
		assertEquals(VehicleType.PROM, result.get(0).vehicleType());
		assertEquals(10L, result.get(0).companyId());
	}

	@Test
	void getPublicVehiclesByCompanyAndType_noDriverAssigned_returnsNullPhone() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.id(2L).brand("BMW").model("7")
				.licensePlate("CB5555KM").numberOfSeats(4)
				.vehicleType(VehicleType.PROM).build();

		when(vehicleRepository.findByCompanyIdAndVehicleType(10L, VehicleType.PROM))
				.thenReturn(List.of(vehicle));

		var result = vehicleService.getPublicVehiclesByCompanyAndType(10L, VehicleType.PROM);

		assertEquals(1, result.size());
		assertNull(result.get(0).driverPhoneNumber());
	}

	@Test
	void getPublicVehiclesByCompanyAndType_nullType_returnsAllForCompany() {
		VehicleEntity vehicle = VehicleEntity.builder()
				.id(3L).brand("Audi").model("A8")
				.licensePlate("CB7777OK").numberOfSeats(4)
				.vehicleType(VehicleType.TAXI).build();

		when(vehicleRepository.findByCompanyId(10L)).thenReturn(List.of(vehicle));

		var result = vehicleService.getPublicVehiclesByCompanyAndType(10L, null);

		assertEquals(1, result.size());
		verify(vehicleRepository, never()).findByCompanyIdAndVehicleType(anyLong(), any());
	}

	@Test
	void deleteVehicle_returnTrue() {
		when(vehicleRepository.existsById(1L)).thenReturn(true);

		var result = vehicleService.deleteVehicle(1L);

		assertTrue(result);
		verify(vehicleRepository).deleteById(1L);
	}

	@Test
	void deleteVehicle_notFound_returnFalse() {
		when(vehicleRepository.existsById(NON_EXISTENT_ID)).thenReturn(false);

		var result = vehicleService.deleteVehicle(NON_EXISTENT_ID);

		assertFalse(result);
		verify(vehicleRepository, never()).deleteById(any());
	}
}
