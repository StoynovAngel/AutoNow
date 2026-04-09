package com.angel.autonow.payment;

import com.angel.autonow.data.TestData;
import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
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
class PaymentServiceTest {

	private static final LocalDateTime NOW = LocalDateTime.now();

	@Mock
	private PaymentRepository paymentRepository;

	@Mock
	private PaymentMapper paymentMapper;

	@Mock
	private OrderRepository orderRepository;

	@InjectMocks
	private PaymentService paymentService;

	@Test
	void createPayment_returnPaymentResponse() {
		PaymentRequestDTO request = TestData.createPaymentRequest(1L);
		OrderEntity order = OrderEntity.builder().id(1L).build();
		PaymentEntity entity = PaymentEntity.builder().amount(16.00).paymentMethod(PaymentMethod.CREDIT_CARD).build();
		PaymentEntity saved = PaymentEntity.builder()
				.id(1L).order(order).amount(16.00).paymentMethod(PaymentMethod.CREDIT_CARD)
				.status(PaymentStatus.PENDING).currency("EUR").createdAt(NOW).updatedAt(NOW)
				.build();
		PaymentResponseDTO response = TestData.createPaymentResponse(1L, 1L, 16.00, PaymentMethod.CREDIT_CARD, PaymentStatus.PENDING, NOW);

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(paymentMapper.toEntity(request)).thenReturn(entity);
		when(paymentRepository.save(entity)).thenReturn(saved);
		when(paymentMapper.toDTO(saved)).thenReturn(response);

		var result = paymentService.createPayment(request);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		assertEquals(16.00, result.get().amount());
		verify(paymentRepository).save(entity);
	}

	@Test
	void createPayment_orderNotFound_returnsEmpty() {
		PaymentRequestDTO request = new PaymentRequestDTO(NON_EXISTENT_ID, 16.00, PaymentMethod.CASH, null, "EUR");

		when(orderRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = paymentService.createPayment(request);

		assertTrue(result.isEmpty());
		verify(paymentRepository, never()).save(any());
	}

	@Test
	void createPayment_duplicateForOrder_returnsEmpty() {
		OrderEntity order = OrderEntity.builder().id(1L).build();
		PaymentEntity existing = PaymentEntity.builder().id(1L).order(order).build();
		PaymentRequestDTO request = TestData.createPaymentRequest(1L);

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(paymentRepository.findByOrderId(1L)).thenReturn(Optional.of(existing));

		var result = paymentService.createPayment(request);

		assertTrue(result.isEmpty());
		verify(paymentRepository, never()).save(any());
	}

	@Test
	void getPaymentById_returnPaymentResponse() {
		OrderEntity order = OrderEntity.builder().id(1L).build();
		PaymentEntity entity = PaymentEntity.builder().id(1L).order(order).amount(16.00).createdAt(NOW).build();
		PaymentResponseDTO response = TestData.createPaymentResponse(1L, 1L, 16.00, PaymentMethod.CREDIT_CARD, PaymentStatus.COMPLETED, NOW);

		when(paymentRepository.findById(1L)).thenReturn(Optional.of(entity));
		when(paymentMapper.toDTO(entity)).thenReturn(response);

		var result = paymentService.getPaymentById(1L);

		assertTrue(result.isPresent());
		assertEquals(16.00, result.get().amount());
	}

	@Test
	void getPaymentById_notFound_returnsEmpty() {
		when(paymentRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = paymentService.getPaymentById(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
	}

	@Test
	void getPaymentByOrderId_returnPaymentResponse() {
		OrderEntity order = OrderEntity.builder().id(1L).build();
		PaymentEntity entity = PaymentEntity.builder().id(1L).order(order).amount(38.50).createdAt(NOW).build();
		PaymentResponseDTO response = TestData.createPaymentResponse(1L, 1L, 38.50, PaymentMethod.DEBIT_CARD, PaymentStatus.COMPLETED, NOW);

		when(paymentRepository.findByOrderId(1L)).thenReturn(Optional.of(entity));
		when(paymentMapper.toDTO(entity)).thenReturn(response);

		var result = paymentService.getPaymentByOrderId(1L);

		assertTrue(result.isPresent());
		assertEquals(38.50, result.get().amount());
	}

	@Test
	void getPaymentByOrderId_notFound_returnsEmpty() {
		when(paymentRepository.findByOrderId(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = paymentService.getPaymentByOrderId(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
	}

	@Test
	void getAllPayments_returnList() {
		OrderEntity firstOrder = OrderEntity.builder().id(1L).build();
		OrderEntity secondOrder = OrderEntity.builder().id(2L).build();
		PaymentEntity firstPayment = PaymentEntity.builder().id(1L).order(firstOrder).amount(16.00).createdAt(NOW).build();
		PaymentEntity secondPayment = PaymentEntity.builder().id(2L).order(secondOrder).amount(38.50).createdAt(NOW).build();
		PaymentResponseDTO firstResponse = TestData.createPaymentResponse(1L, 1L, 16.00, PaymentMethod.CASH, PaymentStatus.COMPLETED, NOW);
		PaymentResponseDTO secondResponse = TestData.createPaymentResponse(2L, 2L, 38.50, PaymentMethod.CREDIT_CARD, PaymentStatus.PENDING, NOW);

		when(paymentRepository.findAll()).thenReturn(List.of(firstPayment, secondPayment));
		when(paymentMapper.toDTO(firstPayment)).thenReturn(firstResponse);
		when(paymentMapper.toDTO(secondPayment)).thenReturn(secondResponse);

		var result = paymentService.getAllPayments();

		assertEquals(2, result.size());
	}

	@Test
	void getAllPayments_emptyList() {
		when(paymentRepository.findAll()).thenReturn(List.of());

		var result = paymentService.getAllPayments();

		assertTrue(result.isEmpty());
	}
}
