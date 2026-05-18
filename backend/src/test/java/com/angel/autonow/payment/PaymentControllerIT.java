package com.angel.autonow.payment;

import com.angel.autonow.data.TestData;
import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
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
class PaymentControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private PaymentRepository paymentRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private UserRepository userRepository;

	private OrderEntity order;

	@BeforeEach
	void setUp() {
		UserEntity user = TestData.createUserEntity();
		userRepository.save(user);

		order = TestData.createOrderEntity(user);
		orderRepository.save(order);
	}

	@Test
	void createPayment() throws Exception {
		var request = TestData.createPaymentRequest(order.getId());

		mockMvc.perform(post("/api/payments")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.orderId").value(order.getId()))
				.andExpect(jsonPath("$.amount").value(16.00))
				.andExpect(jsonPath("$.paymentMethod").value("CREDIT_CARD"))
				.andExpect(jsonPath("$.status").value("PENDING"))
				.andExpect(jsonPath("$.currency").value("EUR"));
	}

	@Test
	void createPayment_orderNotFound_returnsBadRequest() throws Exception {
		var request = TestData.createPaymentRequest(NON_EXISTENT_ID);

		mockMvc.perform(post("/api/payments")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createPayment_invalidInput_returnsBadRequest() throws Exception {
		var invalidRequest = PaymentRequestDTO.builder().build();

		mockMvc.perform(post("/api/payments")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createPayment_asDriver_returnsForbidden() throws Exception {
		var request = TestData.createPaymentRequest(order.getId());

		mockMvc.perform(post("/api/payments")
						.with(TestData.driverJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void createPayment_withoutAuth_returnsUnauthorized() throws Exception {
		var request = TestData.createPaymentRequest(order.getId());

		mockMvc.perform(post("/api/payments")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getPaymentById() throws Exception {
		PaymentEntity payment = TestData.createPaymentEntity(order, 16.00, PaymentMethod.CREDIT_CARD, PaymentStatus.COMPLETED);
		paymentRepository.save(payment);

		mockMvc.perform(get("/api/payments/{id}", payment.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.amount").value(16.00))
				.andExpect(jsonPath("$.paymentMethod").value("CREDIT_CARD"));
	}

	@Test
	void getPaymentById_notFound_returnsOkEmpty() throws Exception {
		mockMvc.perform(get("/api/payments/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(content().string(""));
	}

	@Test
	void getPaymentByOrderId() throws Exception {
		PaymentEntity payment = TestData.createPaymentEntity(order, 38.50, PaymentMethod.DEBIT_CARD, PaymentStatus.COMPLETED);
		paymentRepository.save(payment);

		mockMvc.perform(get("/api/payments/order/{orderId}", order.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.amount").value(38.50));
	}

	@Test
	void getAllPayments_asAdmin() throws Exception {
		PaymentEntity payment = TestData.createPaymentEntity(order, 16.00, PaymentMethod.CASH, PaymentStatus.PENDING);
		paymentRepository.save(payment);

		mockMvc.perform(get("/api/payments")
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getAllPayments_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/payments")
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void getAllPayments_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/payments"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void updatePayment_asCustomer() throws Exception {
		PaymentEntity payment = TestData.createPaymentEntity(order, 16.00, PaymentMethod.CREDIT_CARD, PaymentStatus.PENDING);
		paymentRepository.save(payment);

		var updateRequest = PaymentRequestDTO.builder()
				.orderId(order.getId())
				.amount(25.00)
				.paymentMethod(PaymentMethod.DEBIT_CARD)
				.transactionId("TXN-UPD-001")
				.currency("EUR")
				.build();

		mockMvc.perform(put("/api/payments/{id}", payment.getId())
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.amount").value(25.00))
				.andExpect(jsonPath("$.paymentMethod").value("DEBIT_CARD"));
	}

	@Test
	void updatePayment_notFound_returnsBadRequest() throws Exception {
		var updateRequest = TestData.createPaymentRequest(order.getId());

		mockMvc.perform(put("/api/payments/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updatePayment_invalidInput_returnsBadRequest() throws Exception {
		PaymentEntity payment = TestData.createPaymentEntity(order, 16.00, PaymentMethod.CREDIT_CARD, PaymentStatus.PENDING);
		paymentRepository.save(payment);

		var invalidRequest = PaymentRequestDTO.builder().build();

		mockMvc.perform(put("/api/payments/{id}", payment.getId())
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updatePayment_asDriver_returnsForbidden() throws Exception {
		var updateRequest = TestData.createPaymentRequest(order.getId());

		mockMvc.perform(put("/api/payments/{id}", 1L)
						.with(TestData.driverJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isForbidden());
	}

	@Test
	void updatePayment_withoutAuth_returnsUnauthorized() throws Exception {
		var updateRequest = TestData.createPaymentRequest(order.getId());

		mockMvc.perform(put("/api/payments/{id}", 1L)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void deletePayment_asAdmin() throws Exception {
		PaymentEntity payment = TestData.createPaymentEntity(order, 16.00, PaymentMethod.CASH, PaymentStatus.PENDING);
		paymentRepository.save(payment);

		mockMvc.perform(delete("/api/payments/{id}", payment.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isNoContent());
	}

	@Test
	void deletePayment_notFound_returnsBadRequest() throws Exception {
		mockMvc.perform(delete("/api/payments/{id}", NON_EXISTENT_ID)
						.with(TestData.adminJwt()))
				.andExpect(status().isBadRequest());
	}

	@Test
	void deletePayment_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(delete("/api/payments/{id}", 1L)
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void deletePayment_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(delete("/api/payments/{id}", 1L))
				.andExpect(status().isUnauthorized());
	}
}
