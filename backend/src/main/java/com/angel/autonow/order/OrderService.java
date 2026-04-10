package com.angel.autonow.order;

import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

	@Transactional
	public Optional<OrderResponseDTO> createOrder(OrderRequestDTO request) {
		Optional<UserEntity> user = userRepository.findById(request.userId());

		if (user.isEmpty()) {
			return Optional.empty();
		}

		OrderEntity order = orderMapper.toEntity(request);
		order.setUser(user.get());

		if (request.driverId() != null) {
			var driver = driverRepository.findById(request.driverId());

			if (driver.isEmpty()) {
				return Optional.empty();
			}

			order.setDriver(driver.get());
		}

		if (request.vehicleId() != null) {
			var vehicle = vehicleRepository.findById(request.vehicleId());

			if (vehicle.isEmpty()) {
				return Optional.empty();
			}

			order.setVehicle(vehicle.get());
		}

		OrderEntity saved = orderRepository.save(order);

		return Optional.of(orderMapper.toDTO(saved));
	}

	public Optional<OrderResponseDTO> getOrderById(Long id) {
		return orderRepository.findById(id).map(orderMapper::toDTO);
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

	@Transactional
	public Optional<OrderResponseDTO> updateOrder(Long id, OrderRequestDTO request) {
		Optional<OrderEntity> existing = orderRepository.findById(id);

		if (existing.isEmpty()) {
			return Optional.empty();
		}

		OrderEntity order = existing.get();
		orderMapper.updateEntity(request, order);

		Optional<UserEntity> user = userRepository.findById(request.userId());
		if (user.isEmpty()) {
			return Optional.empty();
		}

		order.setUser(user.get());

		if (request.driverId() == null) {
			order.setDriver(null);
		} else {
			var driver = driverRepository.findById(request.driverId());
			if (driver.isEmpty()) {
				return Optional.empty();
			}
			order.setDriver(driver.get());
		}

		if (request.vehicleId() == null) {
			order.setVehicle(null);
		} else {
			var vehicle = vehicleRepository.findById(request.vehicleId());
			if (vehicle.isEmpty()) {
				return Optional.empty();
			}
			order.setVehicle(vehicle.get());
		}

		return Optional.of(orderMapper.toDTO(orderRepository.save(order)));
	}

	public boolean deleteOrder(Long id) {
		if (!orderRepository.existsById(id)) {
			return false;
		}

		orderRepository.deleteById(id);

		return true;
	}
}
