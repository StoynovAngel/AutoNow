package com.angel.autonow.order;

import com.angel.autonow.data.TestData;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleClass;
import com.angel.autonow.vehicle.VehicleType;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class OrderControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private UserRepository userRepository;

	private UserEntity user;

	@BeforeEach
	void setUp() {
		user = TestData.createUserEntity();
		userRepository.save(user);
	}

	@Test
	void createOrder() throws Exception {
		var request = TestData.createOrderRequest(user.getId());

		mockMvc.perform(post("/api/orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.userId").value(user.getId()))
				.andExpect(jsonPath("$.vehicleType").value("TAXI"))
				.andExpect(jsonPath("$.status").value("CREATED"))
				.andExpect(jsonPath("$.pickupAddress").value("123 Main St"));
	}

	@Test
	void createOrder_withCapacityFields_persistsAndReturns() throws Exception {
		var request = OrderRequestDTO.builder()
				.userId(user.getId())
				.vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS)
				.pickupLatitude(TestData.DEFAULT_PICKUP_LAT)
				.pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS)
				.dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT)
				.dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.estimatedPrice(15.50)
				.distanceKm(5.2)
				.estimatedDurationMinutes(15)
				.passengerCount(6)
				.luggageCount(4)
				.vehicleClass(VehicleClass.XL)
				.requiresAirConditioning(true)
				.build();

		mockMvc.perform(post("/api/orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.passengerCount").value(6))
				.andExpect(jsonPath("$.luggageCount").value(4))
				.andExpect(jsonPath("$.vehicleClass").value("XL"))
				.andExpect(jsonPath("$.requiresAirConditioning").value(true));
	}

	@Test
	void createOrder_zeroPassengerCount_returnsBadRequest() throws Exception {
		var request = OrderRequestDTO.builder()
				.userId(user.getId())
				.vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS)
				.pickupLatitude(TestData.DEFAULT_PICKUP_LAT)
				.pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS)
				.dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT)
				.dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.passengerCount(0)
				.build();

		mockMvc.perform(post("/api/orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createOrder_negativeLuggageCount_returnsBadRequest() throws Exception {
		var request = OrderRequestDTO.builder()
				.userId(user.getId())
				.vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS)
				.pickupLatitude(TestData.DEFAULT_PICKUP_LAT)
				.pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS)
				.dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT)
				.dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.luggageCount(-1)
				.build();

		mockMvc.perform(post("/api/orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createOrder_userNotFound_returnsBadRequest() throws Exception {
		var request = TestData.createOrderRequest(NON_EXISTENT_ID);

		mockMvc.perform(post("/api/orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createOrder_invalidInput_returnsBadRequest() throws Exception {
		var invalidRequest = OrderRequestDTO.builder().build();

		mockMvc.perform(post("/api/orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createOrder_asDriver_returnsForbidden() throws Exception {
		var request = TestData.createOrderRequest(user.getId());

		mockMvc.perform(post("/api/orders")
						.with(TestData.driverJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void createOrder_withoutAuth_returnsUnauthorized() throws Exception {
		var request = TestData.createOrderRequest(user.getId());

		mockMvc.perform(post("/api/orders")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getOrderById() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);

		mockMvc.perform(get("/api/orders/{id}", order.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.pickupAddress").value("123 Main St"));
	}

	@Test
	void getOrderById_notFound_returnsOkEmpty() throws Exception {
		mockMvc.perform(get("/api/orders/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(content().string(""));
	}

	@Test
	void getOrdersByUserId() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);

		mockMvc.perform(get("/api/orders/user/{userId}", user.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getOrdersByUserId_noOrders_returnsEmptyList() throws Exception {
		mockMvc.perform(get("/api/orders/user/{userId}", user.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getAllOrders_asAdmin() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);

		mockMvc.perform(get("/api/orders")
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getAllOrders_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/orders")
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void getAllOrders_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/orders"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void updateOrder_asCustomer() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);

		var updateRequest = OrderRequestDTO.builder()
				.userId(user.getId())
				.vehicleType(VehicleType.SEMI)
				.pickupAddress("789 Elm St")
				.pickupLatitude(42.70)
				.pickupLongitude(23.33)
				.dropoffAddress("101 Pine Rd")
				.dropoffLatitude(42.72)
				.dropoffLongitude(23.34)
				.estimatedPrice(25.00)
				.distanceKm(10.5)
				.estimatedDurationMinutes(20)
				.specialRequirements("Fragile cargo")
				.build();

		mockMvc.perform(put("/api/orders/{id}", order.getId())
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.vehicleType").value("SEMI"))
				.andExpect(jsonPath("$.pickupAddress").value("789 Elm St"))
				.andExpect(jsonPath("$.specialRequirements").value("Fragile cargo"));
	}

	@Test
	void updateOrder_notFound_returnsBadRequest() throws Exception {
		var updateRequest = TestData.createOrderRequest(user.getId());

		mockMvc.perform(put("/api/orders/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateOrder_invalidInput_returnsBadRequest() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);

		var invalidRequest = OrderRequestDTO.builder().build();

		mockMvc.perform(put("/api/orders/{id}", order.getId())
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateOrder_asDriver_returnsForbidden() throws Exception {
		var updateRequest = TestData.createOrderRequest(user.getId());

		mockMvc.perform(put("/api/orders/{id}", 1L)
						.with(TestData.driverJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isForbidden());
	}

	@Test
	void updateOrder_withoutAuth_returnsUnauthorized() throws Exception {
		var updateRequest = TestData.createOrderRequest(user.getId());

		mockMvc.perform(put("/api/orders/{id}", 1L)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void deleteOrder_asAdmin() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);

		mockMvc.perform(delete("/api/orders/{id}", order.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isNoContent());
	}

	@Test
	void deleteOrder_notFound_returnsBadRequest() throws Exception {
		mockMvc.perform(delete("/api/orders/{id}", NON_EXISTENT_ID).with(TestData.adminJwt())).andExpect(status().isBadRequest());
	}

	@Test
	void deleteOrder_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(delete("/api/orders/{id}", 1L).with(TestData.customerJwt())).andExpect(status().isForbidden());
	}

	@Test
	void deleteOrder_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(delete("/api/orders/{id}", 1L)).andExpect(status().isUnauthorized());
	}
}
