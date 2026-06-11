package com.angel.autonow.order;

import com.angel.autonow.data.TestData;
import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.pricing.PricingService;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
import com.angel.autonow.vehicle.VehicleType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyDouble;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

	private static final LocalDateTime NOW = LocalDateTime.now();

	@Mock
	private OrderRepository orderRepository;

	@Mock
	private OrderMapper orderMapper;

	@Mock
	private UserRepository userRepository;

	@Mock
	private DriverRepository driverRepository;

	@Mock
	private VehicleRepository vehicleRepository;

	@Mock
	private PricingService pricingService;

	@InjectMocks
	private OrderService orderService;

	@Test
	void createOrder_returnOrderResponse() {
		OrderRequestDTO request = TestData.createOrderRequest(1L);
		UserEntity user = UserEntity.builder().id(1L).build();
		TaxiOrderEntity saved = TaxiOrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED).createdAt(NOW).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(orderRepository.save(any(OrderEntity.class))).thenReturn(saved);
		when(orderMapper.toDTO(saved)).thenReturn(response);

		var result = orderService.createOrder(request);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		assertEquals(OrderStatus.CREATED, result.get().status());
		verify(orderRepository).save(any(OrderEntity.class));
	}

	@Test
	void createOrder_userNotFound_returnsEmpty() {
		OrderRequestDTO request = TestData.createOrderRequest(NON_EXISTENT_ID);

		when(userRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.createOrder(request);

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}

	@Test
	void createOrder_withDriverAndVehicle() {
		OrderRequestDTO request = OrderRequestDTO.builder()
				.userId(1L).driverId(2L).vehicleId(3L).vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS).pickupLatitude(TestData.DEFAULT_PICKUP_LAT).pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS).dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT).dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.estimatedPrice(15.50).distanceKm(5.2).estimatedDurationMinutes(15)
				.build();
		UserEntity user = UserEntity.builder().id(1L).build();
		DriverEntity driver = DriverEntity.builder().id(2L).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(3L).build();
		TaxiOrderEntity saved = TaxiOrderEntity.builder().id(1L).user(user).driver(driver).vehicle(vehicle)
				.vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED).createdAt(NOW).build();
		OrderResponseDTO response = OrderResponseDTO.builder()
				.id(1L).userId(1L).driverId(2L).vehicleId(3L)
				.vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED)
				.estimatedPrice(15.50).distanceKm(5.2).estimatedDurationMinutes(15)
				.createdAt(NOW).build();

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
		when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));
		when(orderRepository.save(any(OrderEntity.class))).thenReturn(saved);
		when(orderMapper.toDTO(saved)).thenReturn(response);

		var result = orderService.createOrder(request);

		assertTrue(result.isPresent());
		assertEquals(2L, result.get().driverId());
		assertEquals(3L, result.get().vehicleId());
	}

	@Test
	void createOrder_driverNotFound_returnsEmpty() {
		OrderRequestDTO request = OrderRequestDTO.builder()
				.userId(1L).driverId(NON_EXISTENT_ID).vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS).pickupLatitude(TestData.DEFAULT_PICKUP_LAT).pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS).dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT).dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.estimatedPrice(15.50).distanceKm(5.2).estimatedDurationMinutes(15)
				.build();
		UserEntity user = UserEntity.builder().id(1L).build();

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(driverRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.createOrder(request);

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}

	@Test
	void createOrder_vehicleNotFound_returnsEmpty() {
		OrderRequestDTO request = OrderRequestDTO.builder()
				.userId(1L).vehicleId(NON_EXISTENT_ID).vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS).pickupLatitude(TestData.DEFAULT_PICKUP_LAT).pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS).dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT).dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.estimatedPrice(15.50).distanceKm(5.2).estimatedDurationMinutes(15)
				.build();
		UserEntity user = UserEntity.builder().id(1L).build();

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(vehicleRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.createOrder(request);

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}

	@Test
	void getOrderById_returnOrderResponse() {
		UserEntity user = UserEntity.builder().id(1L).build();
		OrderEntity entity = OrderEntity.builder().id(1L).user(user).status(OrderStatus.COMPLETED).createdAt(NOW).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.COMPLETED, NOW);

		when(orderRepository.findById(1L)).thenReturn(Optional.of(entity));
		when(orderMapper.toDTO(entity)).thenReturn(response);

		var result = orderService.getOrderById(1L);

		assertTrue(result.isPresent());
		assertEquals(OrderStatus.COMPLETED, result.get().status());
	}

	@Test
	void getOrderById_notFound_returnsEmpty() {
		when(orderRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.getOrderById(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
	}

	@Test
	void getOrdersByUserId_returnList() {
		UserEntity user = UserEntity.builder().id(1L).build();
		OrderEntity orderEntity = OrderEntity.builder().id(1L).user(user).createdAt(NOW).build();
		OrderResponseDTO orderResponse = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);

		when(orderRepository.findByUserId(1L)).thenReturn(List.of(orderEntity));
		when(orderMapper.toDTO(orderEntity)).thenReturn(orderResponse);

		var result = orderService.getOrdersByUserId(1L);

		assertEquals(1, result.size());
	}

	@Test
	void getOrdersByUserIdAndStatus_returnFiltered() {
		UserEntity user = UserEntity.builder().id(1L).build();
		OrderEntity orderEntity = OrderEntity.builder().id(1L).user(user).status(OrderStatus.CREATED).createdAt(NOW).build();
		OrderResponseDTO orderResponse = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);

		when(orderRepository.findFirstByUserIdAndStatusInOrderByCreatedAtDesc(eq(1L), anySet()))
				.thenReturn(Optional.of(orderEntity));
		when(orderMapper.toDTO(orderEntity)).thenReturn(orderResponse);

		var result = orderService.getActiveOrderByUserId(1L);

		assertTrue(result.isPresent());
		assertEquals(OrderStatus.CREATED, result.get().status());
	}

	@Test
	void getOrdersByUserIdAndStatus_noMatch_returnEmpty() {
		when(orderRepository.findFirstByUserIdAndStatusInOrderByCreatedAtDesc(eq(1L), anySet()))
				.thenReturn(Optional.empty());

		var result = orderService.getActiveOrderByUserId(1L);

		assertTrue(result.isEmpty());
	}

	@Test
	void getActiveOrderForCaller_owner_returnsOrder() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity orderEntity = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.CREATED).createdAt(NOW).build();
		OrderResponseDTO orderResponse = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);

		when(userRepository.findById(1L)).thenReturn(Optional.of(owner));
		when(orderRepository.findFirstByUserIdAndStatusInOrderByCreatedAtDesc(eq(1L), anySet()))
				.thenReturn(Optional.of(orderEntity));
		when(orderMapper.toDTO(orderEntity)).thenReturn(orderResponse);

		var result = orderService.getActiveOrderForCaller(1L, "owner@example.com");

		assertTrue(result.isPresent());
	}

	@Test
	void getActiveOrderForCaller_otherUser_throwsForbidden() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		when(userRepository.findById(1L)).thenReturn(Optional.of(owner));

		assertThrows(OrderForbiddenException.class,
				() -> orderService.getActiveOrderForCaller(1L, "stranger@example.com"));
	}

	@Test
	void getActiveOrderForCaller_unknownUser_throwsForbidden() {
		when(userRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		assertThrows(OrderForbiddenException.class,
				() -> orderService.getActiveOrderForCaller(NON_EXISTENT_ID, "owner@example.com"));
	}

	@Test
	void getAllOrders_returnList() {
		UserEntity user = UserEntity.builder().id(1L).build();
		OrderEntity firstOrder = OrderEntity.builder().id(1L).user(user).createdAt(NOW).build();
		OrderEntity secondOrder = OrderEntity.builder().id(2L).user(user).createdAt(NOW).build();
		OrderResponseDTO firstResponse = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);
		OrderResponseDTO secondResponse = TestData.createOrderResponse(2L, 1L, OrderStatus.COMPLETED, NOW);

		when(orderRepository.findAll()).thenReturn(List.of(firstOrder, secondOrder));
		when(orderMapper.toDTO(firstOrder)).thenReturn(firstResponse);
		when(orderMapper.toDTO(secondOrder)).thenReturn(secondResponse);

		var result = orderService.getAllOrders();

		assertEquals(2, result.size());
	}

	@Test
	void getAllOrders_emptyList() {
		when(orderRepository.findAll()).thenReturn(List.of());

		var result = orderService.getAllOrders();

		assertTrue(result.isEmpty());
	}

	@Test
	void updateOrder_returnUpdatedResponse() {
		OrderRequestDTO request = TestData.createOrderRequest(1L);
		UserEntity user = UserEntity.builder().id(1L).build();
		TaxiOrderEntity existing = TaxiOrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED).createdAt(NOW).build();
		TaxiOrderEntity saved = TaxiOrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED).createdAt(NOW).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);

		when(orderRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(orderRepository.save(existing)).thenReturn(saved);
		when(orderMapper.toDTO(saved)).thenReturn(response);

		var result = orderService.updateOrder(1L, request);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		verify(orderMapper).updateBaseFields(request, existing);
		verify(orderRepository).save(existing);
	}

	@Test
	void updateOrder_notFound_returnsEmpty() {
		OrderRequestDTO request = TestData.createOrderRequest(1L);

		when(orderRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.updateOrder(NON_EXISTENT_ID, request);

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}

	@Test
	void updateOrder_userNotFound_returnsEmpty() {
		OrderRequestDTO request = TestData.createOrderRequest(NON_EXISTENT_ID);
		UserEntity user = UserEntity.builder().id(1L).build();
		OrderEntity existing = OrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(userRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.updateOrder(1L, request);

		assertTrue(result.isEmpty());
	}

	@Test
	void updateOrder_driverNotFound_returnsEmpty() {
		OrderRequestDTO request = OrderRequestDTO.builder()
				.userId(1L).driverId(NON_EXISTENT_ID).vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS).pickupLatitude(TestData.DEFAULT_PICKUP_LAT).pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS).dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT).dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.estimatedPrice(15.50).distanceKm(5.2).estimatedDurationMinutes(15)
				.build();
		UserEntity user = UserEntity.builder().id(1L).build();
		OrderEntity existing = OrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(driverRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.updateOrder(1L, request);

		assertTrue(result.isEmpty());
	}

	@Test
	void updateOrder_vehicleNotFound_returnsEmpty() {
		OrderRequestDTO request = OrderRequestDTO.builder()
				.userId(1L).vehicleId(NON_EXISTENT_ID).vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS).pickupLatitude(TestData.DEFAULT_PICKUP_LAT).pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS).dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT).dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.estimatedPrice(15.50).distanceKm(5.2).estimatedDurationMinutes(15)
				.build();
		UserEntity user = UserEntity.builder().id(1L).build();
		OrderEntity existing = OrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(vehicleRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.updateOrder(1L, request);

		assertTrue(result.isEmpty());
	}

	@Test
	void updateOrder_vehicleTypeChange_throwsConflict() {
		UserEntity user = UserEntity.builder().id(1L).build();
		TaxiOrderEntity existing = TaxiOrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED).createdAt(NOW).build();
		OrderRequestDTO request = OrderRequestDTO.builder()
				.userId(1L).vehicleType(VehicleType.LOGISTICS)
				.pickupAddress("A").pickupLatitude(1.0).pickupLongitude(1.0)
				.dropoffAddress("B").dropoffLatitude(2.0).dropoffLongitude(2.0)
				.weightKg(100.0)
				.build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(existing));

		assertThrows(OrderConflictException.class, () -> orderService.updateOrder(1L, request));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void deleteOrder_returnTrue() {
		when(orderRepository.existsById(1L)).thenReturn(true);

		var result = orderService.deleteOrder(1L);

		assertTrue(result);
		verify(orderRepository).deleteById(1L);
	}

	@Test
	void deleteOrder_notFound_returnFalse() {
		when(orderRepository.existsById(NON_EXISTENT_ID)).thenReturn(false);

		var result = orderService.deleteOrder(NON_EXISTENT_ID);

		assertFalse(result);
	}

	@Test
	void createOrder_withDistance_setsEstimatedPriceFromPricingService() {
		OrderRequestDTO request = OrderRequestDTO.builder()
				.userId(1L).vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS).pickupLatitude(TestData.DEFAULT_PICKUP_LAT).pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS).dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT).dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.distanceKm(10.0)
				.build();
		UserEntity user = UserEntity.builder().id(1L).build();
		TaxiOrderEntity saved = TaxiOrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED).estimatedPrice(14.50).createdAt(NOW).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(pricingService.calculatePrice(10.0, VehicleType.TAXI)).thenReturn(14.50);
		when(orderRepository.save(any(OrderEntity.class))).thenReturn(saved);
		when(orderMapper.toDTO(saved)).thenReturn(response);

		orderService.createOrder(request);

		verify(pricingService).calculatePrice(10.0, VehicleType.TAXI);
	}

	@Test
	void createOrder_logistics_withDistance_usesLogisticsPricing() {
		OrderRequestDTO request = OrderRequestDTO.builder()
				.userId(1L).vehicleType(VehicleType.LOGISTICS)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS).pickupLatitude(TestData.DEFAULT_PICKUP_LAT).pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS).dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT).dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.distanceKm(10.0).weightKg(50.0)
				.build();
		UserEntity user = UserEntity.builder().id(1L).build();
		LogisticsOrderEntity saved = LogisticsOrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.LOGISTICS).status(OrderStatus.CREATED).estimatedPrice(12.00).createdAt(NOW).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(pricingService.calculateForLogistics(10.0, 50.0)).thenReturn(12.00);
		when(orderRepository.save(any(OrderEntity.class))).thenReturn(saved);
		when(orderMapper.toDTO(saved)).thenReturn(response);

		orderService.createOrder(request);

		verify(pricingService).calculateForLogistics(10.0, 50.0);
	}

	@Test
	void createOrder_noDistance_doesNotCallPricingService() {
		OrderRequestDTO request = OrderRequestDTO.builder()
				.userId(1L).vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS).pickupLatitude(TestData.DEFAULT_PICKUP_LAT).pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS).dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT).dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.build();
		UserEntity user = UserEntity.builder().id(1L).build();
		TaxiOrderEntity saved = TaxiOrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED).createdAt(NOW).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(orderRepository.save(any(OrderEntity.class))).thenReturn(saved);
		when(orderMapper.toDTO(saved)).thenReturn(response);

		orderService.createOrder(request);

		verify(pricingService, never()).calculatePrice(anyDouble(), any());
		verify(pricingService, never()).calculateForLogistics(anyDouble(), anyDouble());
	}

	@Test
	void estimate_delegatesToPricingService() {
		OrderEstimateRequestDTO request = OrderEstimateRequestDTO.builder()
				.vehicleType(VehicleType.TAXI).distanceKm(10.0)
				.build();
		OrderEstimateResponseDTO response = OrderEstimateResponseDTO.builder()
				.estimatedPrice(14.50).currency("EUR").distanceKm(10.0).build();

		when(pricingService.estimate(request)).thenReturn(response);

		var result = orderService.estimate(request);

		assertEquals(14.50, result.estimatedPrice());
		assertEquals("EUR", result.currency());
		verify(pricingService).estimate(request);
	}

	@Test
	void assignOrder_validIds_setsDriverVehicleAndStatusAccepted() {
		OrderAssignmentRequestDTO request = OrderAssignmentRequestDTO.builder().driverId(2L).vehicleId(3L).build();
		CompanyEntity company = CompanyEntity.builder().id(10L).build();
		OrderEntity order = OrderEntity.builder().id(1L).status(OrderStatus.CREATED).vehicleType(VehicleType.TAXI).build();
		DriverEntity driver = DriverEntity.builder().id(2L).company(company).available(true).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(3L).company(company).vehicleType(VehicleType.TAXI).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.ACCEPTED, NOW);

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
		when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));
		when(orderRepository.driverHasActiveOrderExcluding(eq(2L), anySet(), eq(1L))).thenReturn(false);
		when(orderRepository.vehicleHasActiveOrderExcluding(eq(3L), anySet(), eq(1L))).thenReturn(false);
		when(orderRepository.save(order)).thenReturn(order);
		when(orderMapper.toDTO(order)).thenReturn(response);

		var result = orderService.assignOrder(1L, request);

		assertTrue(result.isPresent());
		assertEquals(driver, order.getDriver());
		assertEquals(vehicle, order.getVehicle());
		assertEquals(OrderStatus.ACCEPTED, order.getStatus());
	}

	@Test
	void assignOrder_orderNotFound_returnsEmpty() {
		OrderAssignmentRequestDTO request = OrderAssignmentRequestDTO.builder().driverId(2L).vehicleId(3L).build();
		when(orderRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.assignOrder(NON_EXISTENT_ID, request);

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}

	@Test
	void assignOrder_driverNotFound_returnsEmpty() {
		OrderAssignmentRequestDTO request = OrderAssignmentRequestDTO.builder().driverId(NON_EXISTENT_ID).vehicleId(3L).build();
		OrderEntity order = OrderEntity.builder().id(1L).status(OrderStatus.CREATED).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(driverRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.assignOrder(1L, request);

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}

	@Test
	void assignOrder_vehicleNotFound_returnsEmpty() {
		OrderAssignmentRequestDTO request = OrderAssignmentRequestDTO.builder().driverId(2L).vehicleId(NON_EXISTENT_ID).build();
		OrderEntity order = OrderEntity.builder().id(1L).status(OrderStatus.CREATED).build();
		DriverEntity driver = DriverEntity.builder().id(2L).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
		when(vehicleRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.assignOrder(1L, request);

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}

	@Test
	void assignOrder_driverAndVehicleDifferentCompanies_throwsConflict() {
		OrderAssignmentRequestDTO request = OrderAssignmentRequestDTO.builder().driverId(2L).vehicleId(3L).build();
		OrderEntity order = OrderEntity.builder().id(1L).status(OrderStatus.CREATED).vehicleType(VehicleType.TAXI).build();
		DriverEntity driver = DriverEntity.builder().id(2L)
				.company(CompanyEntity.builder().id(10L).build()).available(true).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(3L)
				.company(CompanyEntity.builder().id(11L).build()).vehicleType(VehicleType.TAXI).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
		when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));

		assertThrows(OrderConflictException.class, () -> orderService.assignOrder(1L, request));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void assignOrder_vehicleTypeMismatch_throwsConflict() {
		OrderAssignmentRequestDTO request = OrderAssignmentRequestDTO.builder().driverId(2L).vehicleId(3L).build();
		CompanyEntity company = CompanyEntity.builder().id(10L).build();
		OrderEntity order = OrderEntity.builder().id(1L).status(OrderStatus.CREATED).vehicleType(VehicleType.TAXI).build();
		DriverEntity driver = DriverEntity.builder().id(2L).company(company).available(true).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(3L).company(company).vehicleType(VehicleType.AMBULANCE).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
		when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));

		assertThrows(OrderConflictException.class, () -> orderService.assignOrder(1L, request));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void assignOrder_driverNotAvailable_throwsConflict() {
		OrderAssignmentRequestDTO request = OrderAssignmentRequestDTO.builder().driverId(2L).vehicleId(3L).build();
		CompanyEntity company = CompanyEntity.builder().id(10L).build();
		OrderEntity order = OrderEntity.builder().id(1L).status(OrderStatus.CREATED).vehicleType(VehicleType.TAXI).build();
		DriverEntity driver = DriverEntity.builder().id(2L).company(company).available(false).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(3L).company(company).vehicleType(VehicleType.TAXI).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
		when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));

		assertThrows(OrderConflictException.class, () -> orderService.assignOrder(1L, request));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void assignOrder_driverHasAnotherActiveOrder_throwsConflict() {
		OrderAssignmentRequestDTO request = OrderAssignmentRequestDTO.builder().driverId(2L).vehicleId(3L).build();
		CompanyEntity company = CompanyEntity.builder().id(10L).build();
		OrderEntity order = OrderEntity.builder().id(1L).status(OrderStatus.CREATED).vehicleType(VehicleType.TAXI).build();
		DriverEntity driver = DriverEntity.builder().id(2L).company(company).available(true).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(3L).company(company).vehicleType(VehicleType.TAXI).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
		when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));
		when(orderRepository.driverHasActiveOrderExcluding(eq(2L), anySet(), eq(1L))).thenReturn(true);

		assertThrows(OrderConflictException.class, () -> orderService.assignOrder(1L, request));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void assignOrder_vehicleHasAnotherActiveOrder_throwsConflict() {
		OrderAssignmentRequestDTO request = OrderAssignmentRequestDTO.builder().driverId(2L).vehicleId(3L).build();
		CompanyEntity company = CompanyEntity.builder().id(10L).build();
		OrderEntity order = OrderEntity.builder().id(1L).status(OrderStatus.CREATED).vehicleType(VehicleType.TAXI).build();
		DriverEntity driver = DriverEntity.builder().id(2L).company(company).available(true).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(3L).company(company).vehicleType(VehicleType.TAXI).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
		when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));
		when(orderRepository.driverHasActiveOrderExcluding(eq(2L), anySet(), eq(1L))).thenReturn(false);
		when(orderRepository.vehicleHasActiveOrderExcluding(eq(3L), anySet(), eq(1L))).thenReturn(true);

		assertThrows(OrderConflictException.class, () -> orderService.assignOrder(1L, request));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void createOrder_userHasActiveOrder_throwsConflict() {
		OrderRequestDTO request = TestData.createOrderRequest(1L);
		UserEntity user = UserEntity.builder().id(1L).build();

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(orderRepository.existsByUserIdAndStatusIn(eq(1L), anySet())).thenReturn(true);

		assertThrows(OrderConflictException.class, () -> orderService.createOrder(request));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void cancelOrder_byOwner_setsStatusCanceled() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.CREATED).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.CANCELED, NOW);

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(orderRepository.save(order)).thenReturn(order);
		when(orderMapper.toDTO(order)).thenReturn(response);

		var result = orderService.cancelOrder(1L, "owner@example.com");

		assertTrue(result.isPresent());
		assertEquals(OrderStatus.CANCELED, order.getStatus());
	}

	@Test
	void adminCancelOrder_setsStatusCanceled() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.ACCEPTED).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.CANCELED, NOW);

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(orderRepository.save(order)).thenReturn(order);
		when(orderMapper.toDTO(order)).thenReturn(response);

		var result = orderService.adminCancelOrder(1L);

		assertTrue(result.isPresent());
		assertEquals(OrderStatus.CANCELED, order.getStatus());
	}

	@Test
	void cancelOrder_byNonOwner_throwsForbidden() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.CREATED).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(OrderForbiddenException.class,
				() -> orderService.cancelOrder(1L, "stranger@example.com"));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void cancelOrder_inProgressStatus_throwsConflict() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.IN_PROGRESS).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(OrderConflictException.class,
				() -> orderService.cancelOrder(1L, "owner@example.com"));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void cancelOrder_completedStatus_throwsConflict() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.COMPLETED).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(OrderConflictException.class,
				() -> orderService.cancelOrder(1L, "owner@example.com"));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void adminCancelOrder_inProgressStatus_throwsConflict() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.IN_PROGRESS).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(OrderConflictException.class, () -> orderService.adminCancelOrder(1L));
		verify(orderRepository, never()).save(any());
	}

	@Test
	void cancelOrder_orderNotFound_returnsEmpty() {
		when(orderRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.cancelOrder(NON_EXISTENT_ID, "owner@example.com");

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}

	@Test
	void adminCancelOrder_orderNotFound_returnsEmpty() {
		when(orderRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.adminCancelOrder(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}
}
