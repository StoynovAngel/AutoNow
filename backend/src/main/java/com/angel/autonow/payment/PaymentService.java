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

	@Transactional
	public Optional<PaymentResponseDTO> updatePayment(Long id, PaymentRequestDTO request) {
		Optional<PaymentEntity> existing = paymentRepository.findById(id);

		if (existing.isEmpty()) {
			return Optional.empty();
		}

		PaymentEntity payment = existing.get();

		if (!payment.getOrder().getId().equals(request.orderId())) {
			boolean orderAlreadyPaid = paymentRepository.findByOrderId(request.orderId())
					.filter(p -> !p.getId().equals(payment.getId()))
					.isPresent();

			if (orderAlreadyPaid) {
				return Optional.empty();
			}

			Optional<OrderEntity> order = orderRepository.findById(request.orderId());
			if (order.isEmpty()) {
				return Optional.empty();
			}
			payment.setOrder(order.get());
		}

		paymentMapper.updateEntity(request, payment);

		return Optional.of(paymentMapper.toDTO(paymentRepository.save(payment)));
	}

	public boolean deletePayment(Long id) {
		if (!paymentRepository.existsById(id)) {
			return false;
		}

		paymentRepository.deleteById(id);

		return true;
	}
}
