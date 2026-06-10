package com.angel.autonow.order;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.data.TestData;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleClass;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
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

	@Autowired
	private DriverRepository driverRepository;

	@Autowired
	private VehicleRepository vehicleRepository;

	@Autowired
	private CompanyRepository companyRepository;

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
	void getActiveOrderByUserId_returnsActive() throws Exception {
		var completed = TestData.createOrderEntity(user);
		orderRepository.save(completed);

		var active = TestData.createOrderEntity(user);
		active.setStatus(OrderStatus.CREATED);
		orderRepository.save(active);

		mockMvc.perform(get("/api/orders/user/{userId}/active", user.getId())
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("CREATED"));
	}

	@Test
	void getActiveOrderByUserId_noActive_returnsNotFound() throws Exception {
		var completed = TestData.createOrderEntity(user);
		orderRepository.save(completed);

		mockMvc.perform(get("/api/orders/user/{userId}/active", user.getId())
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isNotFound());
	}

	@Test
	void getActiveOrderByUserId_noOrders_returnsNotFound() throws Exception {
		mockMvc.perform(get("/api/orders/user/{userId}/active", user.getId())
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isNotFound());
	}

	@Test
	void getActiveOrderByUserId_otherCustomer_isForbidden() throws Exception {
		var active = TestData.createOrderEntity(user);
		active.setStatus(OrderStatus.CREATED);
		orderRepository.save(active);

		mockMvc.perform(get("/api/orders/user/{userId}/active", user.getId())
						.with(TestData.customerJwt("stranger@example.com")))
				.andExpect(status().isForbidden());
	}

	@Test
	void getActiveOrderByUserId_admin_canReadAnyUser() throws Exception {
		var active = TestData.createOrderEntity(user);
		active.setStatus(OrderStatus.CREATED);
		orderRepository.save(active);

		mockMvc.perform(get("/api/orders/user/{userId}/active", user.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("CREATED"));
	}

	@Test
	void getAllOrders_asAdmin() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);

		mockMvc.perform(get("/api/orders")
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON));
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
				.vehicleType(VehicleType.LOGISTICS)
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
				.andExpect(jsonPath("$.vehicleType").value("LOGISTICS"))
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

	@Test
	void assignOrder_asAdmin_setsDriverVehicleAndStatusAccepted() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);
		CompanyEntity company = companyRepository.save(TestData.createCompanyEntity());
		var driverFixture = TestData.createDriverEntity();
		driverFixture.setCompany(company);
		var driver = driverRepository.save(driverFixture);
		var vehicleFixture = TestData.createVehicleEntity();
		vehicleFixture.setCompany(company);
		var vehicle = vehicleRepository.save(vehicleFixture);

		var request = OrderAssignmentRequestDTO.builder()
				.driverId(driver.getId())
				.vehicleId(vehicle.getId())
				.build();

		mockMvc.perform(patch("/api/orders/{id}/assign", order.getId())
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("ACCEPTED"))
				.andExpect(jsonPath("$.driver.id").value(driver.getId()))
				.andExpect(jsonPath("$.vehicle.id").value(vehicle.getId()));
	}

	@Test
	void assignOrder_driverAndVehicleDifferentCompanies_returnsConflict() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);
		CompanyEntity companyA = companyRepository.save(TestData.createCompanyEntity());
		CompanyEntity companyB = companyRepository.save(TestData.createAnotherCompanyEntity());
		var driverFixture = TestData.createDriverEntity();
		driverFixture.setCompany(companyA);
		var driver = driverRepository.save(driverFixture);
		var vehicleFixture = TestData.createVehicleEntity();
		vehicleFixture.setCompany(companyB);
		var vehicle = vehicleRepository.save(vehicleFixture);

		var request = OrderAssignmentRequestDTO.builder()
				.driverId(driver.getId())
				.vehicleId(vehicle.getId())
				.build();

		mockMvc.perform(patch("/api/orders/{id}/assign", order.getId())
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isConflict());
	}

	@Test
	void assignOrder_orderNotFound_returnsNotFound() throws Exception {
		var driver = driverRepository.save(TestData.createDriverEntity());
		var vehicle = vehicleRepository.save(TestData.createVehicleEntity());

		var request = OrderAssignmentRequestDTO.builder()
				.driverId(driver.getId())
				.vehicleId(vehicle.getId())
				.build();

		mockMvc.perform(patch("/api/orders/{id}/assign", NON_EXISTENT_ID)
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isNotFound());
	}

	@Test
	void assignOrder_driverNotFound_returnsNotFound() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);
		var vehicle = vehicleRepository.save(TestData.createVehicleEntity());

		var request = OrderAssignmentRequestDTO.builder()
				.driverId(NON_EXISTENT_ID)
				.vehicleId(vehicle.getId())
				.build();

		mockMvc.perform(patch("/api/orders/{id}/assign", order.getId())
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isNotFound());
	}

	@Test
	void assignOrder_invalidInput_returnsBadRequest() throws Exception {
		var order = TestData.createOrderEntity(user);
		orderRepository.save(order);

		var invalidRequest = OrderAssignmentRequestDTO.builder().build();

		mockMvc.perform(patch("/api/orders/{id}/assign", order.getId())
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void assignOrder_asCustomer_returnsForbidden() throws Exception {
		var request = OrderAssignmentRequestDTO.builder().driverId(1L).vehicleId(1L).build();

		mockMvc.perform(patch("/api/orders/{id}/assign", 1L)
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void assignOrder_withoutAuth_returnsUnauthorized() throws Exception {
		var request = OrderAssignmentRequestDTO.builder().driverId(1L).vehicleId(1L).build();

		mockMvc.perform(patch("/api/orders/{id}/assign", 1L)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void createOrder_userHasActiveOrder_returnsConflict() throws Exception {
		var existingActive = TestData.createOrderEntity(user);
		existingActive.setStatus(OrderStatus.CREATED);
		orderRepository.save(existingActive);

		var request = TestData.createOrderRequest(user.getId());

		mockMvc.perform(post("/api/orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isConflict());
	}

	@Test
	void cancelOrder_byOwner_returnsCanceled() throws Exception {
		var order = TestData.createOrderEntity(user);
		order.setStatus(OrderStatus.CREATED);
		orderRepository.save(order);

		mockMvc.perform(post("/api/orders/{id}/cancel", order.getId())
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("CANCELED"));
	}

	@Test
	void cancelOrder_byOwnerWhenAccepted_returnsCanceled() throws Exception {
		var order = TestData.createOrderEntity(user);
		order.setStatus(OrderStatus.ACCEPTED);
		orderRepository.save(order);

		mockMvc.perform(post("/api/orders/{id}/cancel", order.getId())
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("CANCELED"));
	}

	@Test
	void cancelOrder_byAdmin_returnsForbidden() throws Exception {
		var order = TestData.createOrderEntity(user);
		order.setStatus(OrderStatus.CREATED);
		orderRepository.save(order);

		mockMvc.perform(post("/api/orders/{id}/cancel", order.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void adminCancelOrder_returnsCanceled() throws Exception {
		var order = TestData.createOrderEntity(user);
		order.setStatus(OrderStatus.CREATED);
		orderRepository.save(order);

		mockMvc.perform(post("/api/orders/{id}/admin-cancel", order.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("CANCELED"));
	}

	@Test
	void adminCancelOrder_inProgressStatus_returnsConflict() throws Exception {
		var order = TestData.createOrderEntity(user);
		order.setStatus(OrderStatus.IN_PROGRESS);
		orderRepository.save(order);

		mockMvc.perform(post("/api/orders/{id}/admin-cancel", order.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isConflict());
	}

	@Test
	void adminCancelOrder_notFound_returnsNotFound() throws Exception {
		mockMvc.perform(post("/api/orders/{id}/admin-cancel", NON_EXISTENT_ID)
						.with(TestData.adminJwt()))
				.andExpect(status().isNotFound());
	}

	@Test
	void adminCancelOrder_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(post("/api/orders/{id}/admin-cancel", 1L)
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void adminCancelOrder_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(post("/api/orders/{id}/admin-cancel", 1L))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void cancelOrder_byNonOwner_returnsForbidden() throws Exception {
		var order = TestData.createOrderEntity(user);
		order.setStatus(OrderStatus.CREATED);
		orderRepository.save(order);

		mockMvc.perform(post("/api/orders/{id}/cancel", order.getId())
						.with(TestData.customerJwt("stranger@example.com")))
				.andExpect(status().isForbidden());
	}

	@Test
	void cancelOrder_inProgressStatus_returnsConflict() throws Exception {
		var order = TestData.createOrderEntity(user);
		order.setStatus(OrderStatus.IN_PROGRESS);
		orderRepository.save(order);

		mockMvc.perform(post("/api/orders/{id}/cancel", order.getId())
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isConflict());
	}

	@Test
	void cancelOrder_completedStatus_returnsConflict() throws Exception {
		var order = TestData.createOrderEntity(user);
		order.setStatus(OrderStatus.COMPLETED);
		orderRepository.save(order);

		mockMvc.perform(post("/api/orders/{id}/cancel", order.getId())
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isConflict());
	}

	@Test
	void cancelOrder_notFound_returnsNotFound() throws Exception {
		mockMvc.perform(post("/api/orders/{id}/cancel", NON_EXISTENT_ID)
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isNotFound());
	}

	@Test
	void cancelOrder_asDriver_returnsForbidden() throws Exception {
		mockMvc.perform(post("/api/orders/{id}/cancel", 1L)
						.with(TestData.driverJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void cancelOrder_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(post("/api/orders/{id}/cancel", 1L))
				.andExpect(status().isUnauthorized());
	}
}
