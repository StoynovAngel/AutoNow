package com.angel.autonow.order;

import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.pricing.PricingService;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class OrderService {

	private static final Set<OrderStatus> ACTIVE_STATUSES =
			Set.of(OrderStatus.CREATED, OrderStatus.ACCEPTED, OrderStatus.IN_PROGRESS);

	private static final Set<OrderStatus> CANCELLABLE_STATUSES =
			Set.of(OrderStatus.CREATED, OrderStatus.ACCEPTED);

	private final OrderRepository orderRepository;
	private final OrderMapper orderMapper;
	private final UserRepository userRepository;
	private final DriverRepository driverRepository;
	private final VehicleRepository vehicleRepository;
	private final PricingService pricingService;

	@Transactional
	public Optional<OrderResponseDTO> createOrder(OrderRequestDTO request) {
		Optional<UserEntity> user = userRepository.findById(request.userId());

		if (user.isEmpty()) {
			return Optional.empty();
		}

		if (orderRepository.existsByUserIdAndStatusIn(request.userId(), ACTIVE_STATUSES)) {
			throw new OrderConflictException("User already has an active order");
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

		if (request.distanceKm() != null) {
			order.setEstimatedPrice(pricingService.calculatePrice(request.distanceKm(), request.vehicleClass()));
		}

		OrderEntity saved = orderRepository.save(order);

		return Optional.of(orderMapper.toDTO(saved));
	}

	public OrderEstimateResponseDTO estimate(OrderEstimateRequestDTO request) {
		return pricingService.estimate(request);
	}

	public Optional<OrderResponseDTO> getOrderById(Long id) {
		return orderRepository.findById(id).map(orderMapper::toDTO);
	}

	public List<OrderResponseDTO> getOrdersByUserId(Long userId) {
		return orderRepository.findByUserId(userId).stream()
				.map(orderMapper::toDTO)
				.toList();
	}

	public Optional<OrderResponseDTO> getActiveOrderByUserId(Long userId) {
		return orderRepository.findFirstByUserIdAndStatusInOrderByCreatedAtDesc(userId, ACTIVE_STATUSES)
				.map(orderMapper::toDTO);
	}

	public Optional<OrderResponseDTO> getActiveOrderForCaller(Long userId, String callerEmail) {
		UserEntity owner = userRepository.findById(userId)
				.orElseThrow(() -> new OrderForbiddenException("Cannot read another user's active order"));

		if (callerEmail == null || !callerEmail.equals(owner.getEmail())) {
			throw new OrderForbiddenException("Cannot read another user's active order");
		}

		return getActiveOrderByUserId(userId);
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

		Optional<UserEntity> user = userRepository.findById(request.userId());
		if (user.isEmpty()) {
			return Optional.empty();
		}

		DriverEntity driver = null;
		if (request.driverId() != null) {
			var driverOpt = driverRepository.findById(request.driverId());

			if (driverOpt.isEmpty()) {
				return Optional.empty();
			}

			driver = driverOpt.get();
		}

		VehicleEntity vehicle = null;
		if (request.vehicleId() != null) {
			var vehicleOpt = vehicleRepository.findById(request.vehicleId());

			if (vehicleOpt.isEmpty()) {
				return Optional.empty();
			}

			vehicle = vehicleOpt.get();
		}

		OrderEntity order = existing.get();
		orderMapper.updateEntity(request, order);
		order.setUser(user.get());
		order.setDriver(driver);
		order.setVehicle(vehicle);

		return Optional.of(orderMapper.toDTO(orderRepository.save(order)));
	}

	public boolean deleteOrder(Long id) {
		if (!orderRepository.existsById(id)) {
			return false;
		}

		orderRepository.deleteById(id);

		return true;
	}

	@Transactional
	public Optional<OrderResponseDTO> updateOrderStatus(Long id, OrderStatus status) {
		return orderRepository.findById(id)
				.map(order -> {
					order.setStatus(status);
					return orderMapper.toDTO(orderRepository.save(order));
				});
	}

	@Transactional
	public Optional<OrderResponseDTO> assignOrder(Long id, OrderAssignmentRequestDTO request) {
		Optional<OrderEntity> existing = orderRepository.findById(id);

		if (existing.isEmpty()) {
			return Optional.empty();
		}

		Optional<DriverEntity> driver = driverRepository.findById(request.driverId());
		if (driver.isEmpty()) {
			return Optional.empty();
		}

		Optional<VehicleEntity> vehicle = vehicleRepository.findById(request.vehicleId());
		if (vehicle.isEmpty()) {
			return Optional.empty();
		}

		OrderEntity order = existing.get();
		order.setDriver(driver.get());
		order.setVehicle(vehicle.get());
		order.setStatus(OrderStatus.ACCEPTED);

		return Optional.of(orderMapper.toDTO(orderRepository.save(order)));
	}

	@Transactional
	public Optional<OrderResponseDTO> cancelOrder(Long id, String callerEmail) {
		Optional<OrderEntity> existing = orderRepository.findById(id);

		if (existing.isEmpty()) {
			return Optional.empty();
		}

		OrderEntity order = existing.get();

		UserEntity owner = order.getUser();
		if (owner == null || !owner.getEmail().equals(callerEmail)) {
			throw new OrderForbiddenException("Only the order owner can cancel this order");
		}

		return Optional.of(transitionToCanceled(order));
	}

	@Transactional
	public Optional<OrderResponseDTO> adminCancelOrder(Long id) {
		Optional<OrderEntity> existing = orderRepository.findById(id);

		if (existing.isEmpty()) {
			return Optional.empty();
		}

		return Optional.of(transitionToCanceled(existing.get()));
	}

	private OrderResponseDTO transitionToCanceled(OrderEntity order) {
		if (!CANCELLABLE_STATUSES.contains(order.getStatus())) {
			throw new OrderConflictException("Order cannot be cancelled in status " + order.getStatus());
		}

		order.setStatus(OrderStatus.CANCELED);
		return orderMapper.toDTO(orderRepository.save(order));
	}
}
