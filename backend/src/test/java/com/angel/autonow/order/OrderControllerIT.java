package com.angel.autonow.order;

import com.angel.autonow.data.TestData;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
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
		var invalidRequest = new OrderRequestDTO(null, null, null, null, null, null, null, null, null, null, null, null, null, null);

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
}
