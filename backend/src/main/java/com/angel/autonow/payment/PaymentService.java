package com.angel.autonow.payment;

import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentService {

	private final PaymentRepository paymentRepository;
	private final PaymentMapper paymentMapper;
	private final OrderRepository orderRepository;

	@Transactional
	public Optional<PaymentResponseDTO> createPayment(PaymentRequestDTO request) {
		Optional<OrderEntity> order = orderRepository.findById(request.orderId());

		if (order.isEmpty()) {
			return Optional.empty();
		}

		if (paymentRepository.findByOrderId(request.orderId()).isPresent()) {
			return Optional.empty();
		}

		PaymentEntity payment = paymentMapper.toEntity(request);
		payment.setOrder(order.get());
		PaymentEntity saved = paymentRepository.save(payment);

		return Optional.of(paymentMapper.toDTO(saved));
	}

	public Optional<PaymentResponseDTO> getPaymentById(Long id) {
		return paymentRepository.findById(id)
				.map(paymentMapper::toDTO);
	}

	public Optional<PaymentResponseDTO> getPaymentByOrderId(Long orderId) {
		return paymentRepository.findByOrderId(orderId)
				.map(paymentMapper::toDTO);
	}

	public List<PaymentResponseDTO> getAllPayments() {
		return paymentRepository.findAll().stream()
				.map(paymentMapper::toDTO)
				.toList();
	}
}
