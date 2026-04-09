package com.angel.autonow.order;

import com.angel.autonow.data.TestData;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
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

	@InjectMocks
	private OrderService orderService;

	@Test
	void createOrder_returnOrderResponse() {
		OrderRequestDTO request = TestData.createOrderRequest(1L);
		UserEntity user = UserEntity.builder().id(1L).build();
		OrderEntity entity = OrderEntity.builder().vehicleType(VehicleType.TAXI).build();
		OrderEntity saved = OrderEntity.builder().id(1L).user(user).vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED).createdAt(NOW).build();
		OrderResponseDTO response = TestData.createOrderResponse(1L, 1L, OrderStatus.CREATED, NOW);

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(orderMapper.toEntity(request)).thenReturn(entity);
		when(orderRepository.save(entity)).thenReturn(saved);
		when(orderMapper.toDTO(saved)).thenReturn(response);

		var result = orderService.createOrder(request);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		assertEquals(OrderStatus.CREATED, result.get().status());
		verify(orderRepository).save(entity);
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
		OrderRequestDTO request = new OrderRequestDTO(1L, 2L, 3L, VehicleType.TAXI,
				TestData.DEFAULT_PICKUP_ADDRESS, TestData.DEFAULT_PICKUP_LAT, TestData.DEFAULT_PICKUP_LNG,
				TestData.DEFAULT_DROPOFF_ADDRESS, TestData.DEFAULT_DROPOFF_LAT, TestData.DEFAULT_DROPOFF_LNG,
				15.50, 5.2, 15, null);
		UserEntity user = UserEntity.builder().id(1L).build();
		DriverEntity driver = DriverEntity.builder().id(2L).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(3L).build();
		OrderEntity entity = OrderEntity.builder().vehicleType(VehicleType.TAXI).build();
		OrderEntity saved = OrderEntity.builder().id(1L).user(user).driver(driver).vehicle(vehicle)
				.vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED).createdAt(NOW).build();
		OrderResponseDTO response = OrderResponseDTO.builder()
				.id(1L).userId(1L).driverId(2L).vehicleId(3L)
				.vehicleType(VehicleType.TAXI).status(OrderStatus.CREATED)
				.estimatedPrice(15.50).distanceKm(5.2).estimatedDurationMinutes(15)
				.createdAt(NOW).build();

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(driverRepository.findById(2L)).thenReturn(Optional.of(driver));
		when(vehicleRepository.findById(3L)).thenReturn(Optional.of(vehicle));
		when(orderMapper.toEntity(request)).thenReturn(entity);
		when(orderRepository.save(entity)).thenReturn(saved);
		when(orderMapper.toDTO(saved)).thenReturn(response);

		var result = orderService.createOrder(request);

		assertTrue(result.isPresent());
		assertEquals(2L, result.get().driverId());
		assertEquals(3L, result.get().vehicleId());
	}

	@Test
	void createOrder_driverNotFound_returnsEmpty() {
		OrderRequestDTO request = new OrderRequestDTO(1L, NON_EXISTENT_ID, null, VehicleType.TAXI,
				TestData.DEFAULT_PICKUP_ADDRESS, TestData.DEFAULT_PICKUP_LAT, TestData.DEFAULT_PICKUP_LNG,
				TestData.DEFAULT_DROPOFF_ADDRESS, TestData.DEFAULT_DROPOFF_LAT, TestData.DEFAULT_DROPOFF_LNG,
				15.50, 5.2, 15, null);
		UserEntity user = UserEntity.builder().id(1L).build();

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(orderMapper.toEntity(request)).thenReturn(OrderEntity.builder().vehicleType(VehicleType.TAXI).build());
		when(driverRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = orderService.createOrder(request);

		assertTrue(result.isEmpty());
		verify(orderRepository, never()).save(any());
	}

	@Test
	void createOrder_vehicleNotFound_returnsEmpty() {
		OrderRequestDTO request = new OrderRequestDTO(1L, null, NON_EXISTENT_ID, VehicleType.TAXI,
				TestData.DEFAULT_PICKUP_ADDRESS, TestData.DEFAULT_PICKUP_LAT, TestData.DEFAULT_PICKUP_LNG,
				TestData.DEFAULT_DROPOFF_ADDRESS, TestData.DEFAULT_DROPOFF_LAT, TestData.DEFAULT_DROPOFF_LNG,
				15.50, 5.2, 15, null);
		UserEntity user = UserEntity.builder().id(1L).build();

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(orderMapper.toEntity(request)).thenReturn(OrderEntity.builder().vehicleType(VehicleType.TAXI).build());
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
}
