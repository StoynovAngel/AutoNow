package com.angel.autonow.order;

import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrderService {

	private final OrderRepository orderRepository;
	private final OrderMapper orderMapper;
	private final UserRepository userRepository;
	private final DriverRepository driverRepository;
	private final VehicleRepository vehicleRepository;

	public Optional<OrderResponseDTO> createOrder(OrderRequestDTO request) {
		Optional<UserEntity> user = userRepository.findById(request.userId());

		if (user.isEmpty()) {
			return Optional.empty();
		}

		OrderEntity order = orderMapper.toEntity(request);
		order.setUser(user.get());

		if (request.driverId() != null) {
			driverRepository.findById(request.driverId()).ifPresent(order::setDriver);
		}

		if (request.vehicleId() != null) {
			vehicleRepository.findById(request.vehicleId()).ifPresent(order::setVehicle);
		}

		OrderEntity saved = orderRepository.save(order);
		return Optional.of(orderMapper.toDTO(saved));
	}

	public Optional<OrderResponseDTO> getOrderById(Long id) {
		return orderRepository.findById(id)
				.map(orderMapper::toDTO);
	}

	public List<OrderResponseDTO> getOrdersByUserId(Long userId) {
		return orderRepository.findByUserId(userId).stream()
				.map(orderMapper::toDTO)
				.toList();
	}

	public List<OrderResponseDTO> getAllOrders() {
		return orderRepository.findAll().stream()
				.map(orderMapper::toDTO)
				.toList();
	}
}
