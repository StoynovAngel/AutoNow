package com.angel.autonow.dispatch;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyType;
import com.angel.autonow.data.TestData;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.order.OrderAssignmentRequestDTO;
import com.angel.autonow.order.OrderConflictException;
import com.angel.autonow.order.OrderResponseDTO;
import com.angel.autonow.order.OrderService;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
import com.angel.autonow.vehicle.VehicleType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DispatchServiceTest {

	@Mock private OrderService orderService;
	@Mock private DriverRepository driverRepository;
	@Mock private VehicleRepository vehicleRepository;
	@Mock private DispatchLlmClient llmClient;

	@InjectMocks
	private DispatchService dispatchService;

	private CompanyEntity taxiCompany() {
		CompanyEntity c = TestData.createCompanyEntity();
		c.setId(10L);
		c.setCompanyType(CompanyType.TAXI);
		return c;
	}

	private DriverEntity availableDriver(Long id, CompanyEntity company) {
		DriverEntity d = TestData.createDriverEntity();
		d.setId(id);
		d.setCompany(company);
		d.setAvailable(true);
		d.setExpertiseType(Set.of(ExpertiseType.B));
		return d;
	}

	private VehicleEntity taxiVehicle(Long id, CompanyEntity company, DriverEntity driver) {
		VehicleEntity v = TestData.createVehicleEntity();
		v.setId(id);
		v.setVehicleType(VehicleType.TAXI);
		v.setCompany(company);
		v.setDriver(driver);
		return v;
	}

	private OrderResponseDTO createdOrder(Long orderId) {
		return TestData.createOrderResponse(orderId, 1L, OrderStatus.CREATED, LocalDateTime.now())
				.toBuilder()
				.vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS)
				.build();
	}

	@Test
	void autoAssign_orderNotFound_returnsEmpty() {
		when(orderService.getOrderById(99L)).thenReturn(Optional.empty());

		assertTrue(dispatchService.autoAssign(99L).isEmpty());
		verifyNoInteractions(driverRepository, vehicleRepository, llmClient);
	}

	@Test
	void autoAssign_orderNotCreated_throwsConflict() {
		var order = TestData.createOrderResponse(1L, 1L, OrderStatus.ACCEPTED, LocalDateTime.now())
				.toBuilder().vehicleType(VehicleType.TAXI).pickupAddress("A").build();
		when(orderService.getOrderById(1L)).thenReturn(Optional.of(order));

		assertThrows(OrderConflictException.class, () -> dispatchService.autoAssign(1L));
		verifyNoInteractions(driverRepository, vehicleRepository, llmClient);
	}

	@Test
	void autoAssign_noCandidates_throwsNoAvailableDriver() {
		when(orderService.getOrderById(1L)).thenReturn(Optional.of(createdOrder(1L)));
		when(driverRepository.findAllByCompanyCompanyType(CompanyType.TAXI)).thenReturn(List.of());

		assertThrows(NoAvailableDriverException.class, () -> dispatchService.autoAssign(1L));
		verifyNoInteractions(llmClient);
	}

	@Test
	void autoAssign_aiPicksValidDriver_usesAiChoice() {
		CompanyEntity company = taxiCompany();
		DriverEntity driver = availableDriver(1L, company);
		VehicleEntity vehicle = taxiVehicle(2L, company, driver);

		when(orderService.getOrderById(1L)).thenReturn(Optional.of(createdOrder(1L)));
		when(driverRepository.findAllByCompanyCompanyType(CompanyType.TAXI)).thenReturn(List.of(driver));
		when(llmClient.suggestDriver(any(), anyList()))
				.thenReturn(DispatchSuggestionDTO.builder().driverId(1L).build());
		when(vehicleRepository.findByCompanyIdAndVehicleType(10L, VehicleType.TAXI)).thenReturn(List.of(vehicle));
		when(orderService.assignOrder(eq(1L), any())).thenReturn(Optional.of(createdOrder(1L)));

		assertTrue(dispatchService.autoAssign(1L).isPresent());

		var captor = ArgumentCaptor.forClass(OrderAssignmentRequestDTO.class);
		verify(orderService).assignOrder(eq(1L), captor.capture());
		assertEquals(1L, captor.getValue().driverId());
		assertEquals(2L, captor.getValue().vehicleId());
	}

	@Test
	void autoAssign_aiPicksUnknownDriver_fallsBackToRandom() {
		CompanyEntity company = taxiCompany();
		DriverEntity driver = availableDriver(1L, company);
		VehicleEntity vehicle = taxiVehicle(2L, company, driver);

		when(orderService.getOrderById(1L)).thenReturn(Optional.of(createdOrder(1L)));
		when(driverRepository.findAllByCompanyCompanyType(CompanyType.TAXI)).thenReturn(List.of(driver));
		when(llmClient.suggestDriver(any(), anyList()))
				.thenReturn(DispatchSuggestionDTO.builder().driverId(999L).build());
		when(vehicleRepository.findByCompanyIdAndVehicleType(10L, VehicleType.TAXI)).thenReturn(List.of(vehicle));
		when(orderService.assignOrder(eq(1L), any())).thenReturn(Optional.of(createdOrder(1L)));

		dispatchService.autoAssign(1L);

		verify(orderService).assignOrder(eq(1L), any());
	}

	@Test
	void autoAssign_aiThrows_fallsBackToRandom() {
		CompanyEntity company = taxiCompany();
		DriverEntity driver = availableDriver(1L, company);
		VehicleEntity vehicle = taxiVehicle(2L, company, driver);

		when(orderService.getOrderById(1L)).thenReturn(Optional.of(createdOrder(1L)));
		when(driverRepository.findAllByCompanyCompanyType(CompanyType.TAXI)).thenReturn(List.of(driver));
		when(llmClient.suggestDriver(any(), anyList())).thenThrow(new RuntimeException("LLM down"));
		when(vehicleRepository.findByCompanyIdAndVehicleType(10L, VehicleType.TAXI)).thenReturn(List.of(vehicle));
		when(orderService.assignOrder(eq(1L), any())).thenReturn(Optional.of(createdOrder(1L)));

		assertTrue(dispatchService.autoAssign(1L).isPresent());
		verify(orderService).assignOrder(eq(1L), any());
	}
}
