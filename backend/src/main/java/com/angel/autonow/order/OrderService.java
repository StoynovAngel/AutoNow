package com.angel.autonow.order;

import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.pricing.PricingService;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
import com.angel.autonow.vehicle.VehicleType;
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

		OrderEntity order = buildEntity(request);
		order.setUser(user.get());

		if (request.driverId() != null) {
			var driver = driverRepository.findById(request.driverId());
			if (driver.isEmpty()) return Optional.empty();
			order.setDriver(driver.get());
		}

		if (request.vehicleId() != null) {
			var vehicle = vehicleRepository.findById(request.vehicleId());
			if (vehicle.isEmpty()) return Optional.empty();
			order.setVehicle(vehicle.get());
		}

		if (request.distanceKm() != null) {
			order.setEstimatedPrice(calculatePrice(request));
		}

		return Optional.of(orderMapper.toDTO(orderRepository.save(order)));
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
		if (existing.isEmpty()) return Optional.empty();

		OrderEntity order = existing.get();
		if (order.getVehicleType() != request.vehicleType()) {
			throw new OrderConflictException("Vehicle type cannot be changed after order creation");
		}

		Optional<UserEntity> user = userRepository.findById(request.userId());
		if (user.isEmpty()) return Optional.empty();

		DriverEntity driver = null;
		if (request.driverId() != null) {
			var driverOpt = driverRepository.findById(request.driverId());
			if (driverOpt.isEmpty()) return Optional.empty();
			driver = driverOpt.get();
		}

		VehicleEntity vehicle = null;
		if (request.vehicleId() != null) {
			var vehicleOpt = vehicleRepository.findById(request.vehicleId());
			if (vehicleOpt.isEmpty()) return Optional.empty();
			vehicle = vehicleOpt.get();
		}

		orderMapper.updateBaseFields(request, order);
		order.setUser(user.get());
		order.setDriver(driver);
		order.setVehicle(vehicle);
		applySubtypeFields(request, order);

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
		if (existing.isEmpty()) return Optional.empty();

		Optional<DriverEntity> driver = driverRepository.findById(request.driverId());
		if (driver.isEmpty()) return Optional.empty();

		Optional<VehicleEntity> vehicle = vehicleRepository.findById(request.vehicleId());
		if (vehicle.isEmpty()) return Optional.empty();

		OrderEntity order = existing.get();
		DriverEntity driverEntity = driver.get();
		VehicleEntity vehicleEntity = vehicle.get();

		validateAssignment(order, driverEntity, vehicleEntity);

		order.setDriver(driverEntity);
		order.setVehicle(vehicleEntity);
		order.setStatus(OrderStatus.ACCEPTED);

		return Optional.of(orderMapper.toDTO(orderRepository.save(order)));
	}

	@Transactional
	public Optional<OrderResponseDTO> cancelOrder(Long id, String callerEmail) {
		Optional<OrderEntity> existing = orderRepository.findById(id);
		if (existing.isEmpty()) return Optional.empty();

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
        return existing.map(this::transitionToCanceled);
    }
	
	private OrderEntity buildEntity(OrderRequestDTO request) {
		return OrderEntity.builder()
				.vehicleType(request.vehicleType())
				.pickupAddress(request.pickupAddress())
				.pickupLatitude(request.pickupLatitude())
				.pickupLongitude(request.pickupLongitude())
				.dropoffAddress(request.dropoffAddress())
				.dropoffLatitude(request.dropoffLatitude())
				.dropoffLongitude(request.dropoffLongitude())
				.distanceKm(request.distanceKm())
				.estimatedDurationMinutes(request.estimatedDurationMinutes())
				.specialRequirements(request.specialRequirements())
				.weightKg(request.weightKg())
				.build();
	}

	private void applySubtypeFields(OrderRequestDTO request, OrderEntity order) {
		order.setWeightKg(request.weightKg());
	}

	private double calculatePrice(OrderRequestDTO request) {
		if (request.vehicleType() == VehicleType.LOGISTICS) {
			return pricingService.calculateForLogistics(request.distanceKm(), request.weightKg());
		}
		return pricingService.calculatePrice(request.distanceKm(), request.vehicleType());
	}

	private void validateAssignment(OrderEntity order, DriverEntity driver, VehicleEntity vehicle) {
		ensureSameCompany(driver, vehicle);
		ensureVehicleTypeMatches(order, vehicle);
		ensureDriverAvailable(driver);
		ensureDriverFree(driver, order.getId());
		ensureVehicleFree(vehicle, order.getId());
	}

	private void ensureSameCompany(DriverEntity driver, VehicleEntity vehicle) {
		var driverCompany = driver.getCompany();
		var vehicleCompany = vehicle.getCompany();
		if (driverCompany == null || vehicleCompany == null
				|| !driverCompany.getId().equals(vehicleCompany.getId())) {
			throw new OrderConflictException("Driver and vehicle must belong to the same company");
		}
	}

	private void ensureVehicleTypeMatches(OrderEntity order, VehicleEntity vehicle) {
		if (vehicle.getVehicleType() != order.getVehicleType()) {
			throw new OrderConflictException("Vehicle type does not match the order");
		}
	}

	private void ensureDriverAvailable(DriverEntity driver) {
		if (!driver.isAvailable()) {
			throw new OrderConflictException("Driver is not available");
		}
	}

	private void ensureDriverFree(DriverEntity driver, Long currentOrderId) {
		if (orderRepository.driverHasActiveOrderExcluding(driver.getId(), ACTIVE_STATUSES, currentOrderId)) {
			throw new OrderConflictException("Driver already has an active order");
		}
	}

	private void ensureVehicleFree(VehicleEntity vehicle, Long currentOrderId) {
		if (orderRepository.vehicleHasActiveOrderExcluding(vehicle.getId(), ACTIVE_STATUSES, currentOrderId)) {
			throw new OrderConflictException("Vehicle already has an active order");
		}
	}

	private OrderResponseDTO transitionToCanceled(OrderEntity order) {
		if (!CANCELLABLE_STATUSES.contains(order.getStatus())) {
			throw new OrderConflictException("Order cannot be cancelled in status " + order.getStatus());
		}
		order.setStatus(OrderStatus.CANCELED);
		return orderMapper.toDTO(orderRepository.save(order));
	}
}
