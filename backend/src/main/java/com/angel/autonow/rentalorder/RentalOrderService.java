package com.angel.autonow.rentalorder;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.pricing.PricingService;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
import com.angel.autonow.vehicle.VehicleType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RentalOrderService {

	private static final Set<RentalOrderStatus> ACTIVE_STATUSES =
			Set.of(RentalOrderStatus.CREATED, RentalOrderStatus.ACCEPTED, RentalOrderStatus.IN_PROGRESS);

	private static final Set<RentalOrderStatus> CANCELLABLE_STATUSES =
			Set.of(RentalOrderStatus.CREATED, RentalOrderStatus.ACCEPTED);

	private final RentalOrderRepository rentalOrderRepository;
	private final RentalOrderMapper rentalOrderMapper;
	private final UserRepository userRepository;
	private final VehicleRepository vehicleRepository;
	private final CompanyRepository companyRepository;
	private final PricingService pricingService;

	@Transactional
	public Optional<RentalOrderResponseDTO> createRentalOrder(RentalOrderRequestDTO request) {
		if (request.rentalStartDate() != null && request.rentalEndDate() != null && !request.rentalEndDate().isAfter(request.rentalStartDate())) {
			throw new RentalOrderConflictException("Rental end date must be after start date");
		}

		Optional<UserEntity> userOpt = userRepository.findById(request.userId());
		if (userOpt.isEmpty()) return Optional.empty();

		if (rentalOrderRepository.existsByUserIdAndStatusIn(request.userId(), ACTIVE_STATUSES)) {
			throw new RentalOrderConflictException("User already has an active rental order");
		}

		RentalOrderEntity order = RentalOrderEntity.builder()
				.rentalStartDate(request.rentalStartDate())
				.rentalEndDate(request.rentalEndDate())
				.specialRequirements(request.specialRequirements())
				.build();
		order.setUser(userOpt.get());

		if (request.companyId() != null) {
			Optional<CompanyEntity> company = companyRepository.findById(request.companyId());
			if (company.isEmpty()) return Optional.empty();
			order.setCompany(company.get());
		}

		if (request.vehicleId() != null) {
			Optional<VehicleEntity> vehicleOpt = vehicleRepository.findById(request.vehicleId());
			if (vehicleOpt.isEmpty()) return Optional.empty();
			VehicleEntity vehicle = vehicleOpt.get();
			if (vehicle.getVehicleType() != VehicleType.RENTAL) {
				throw new RentalOrderConflictException("Vehicle is not a rental vehicle");
			}
			order.setVehicle(vehicle);
		}

		if (request.rentalStartDate() != null && request.rentalEndDate() != null) {
			long days = Math.max(1, ChronoUnit.DAYS.between(
					request.rentalStartDate().toLocalDate(),
					request.rentalEndDate().toLocalDate()));
			order.setTotalPrice(pricingService.calculateForRental(days));
		}

		return Optional.of(rentalOrderMapper.toDTO(rentalOrderRepository.save(order)));
	}

	public Optional<RentalOrderResponseDTO> getRentalOrderById(Long id) {
		return rentalOrderRepository.findById(id).map(rentalOrderMapper::toDTO);
	}

	public List<RentalOrderResponseDTO> getRentalOrdersByUserId(Long userId) {
		return rentalOrderRepository.findByUserId(userId).stream()
				.map(rentalOrderMapper::toDTO)
				.toList();
	}

	public List<RentalOrderResponseDTO> getRentalOrdersByCompanyId(Long companyId) {
		return rentalOrderRepository.findByCompanyId(companyId).stream()
				.map(rentalOrderMapper::toDTO)
				.toList();
	}

	public List<RentalOrderResponseDTO> getAllRentalOrders() {
		return rentalOrderRepository.findAll().stream()
				.map(rentalOrderMapper::toDTO)
				.toList();
	}

	@Transactional
	public Optional<RentalOrderResponseDTO> updateRentalOrder(Long id, RentalOrderRequestDTO request) {
		Optional<RentalOrderEntity> existing = rentalOrderRepository.findById(id);
		if (existing.isEmpty()) return Optional.empty();
		RentalOrderEntity order = existing.get();

		if (request.rentalStartDate() != null && request.rentalEndDate() != null
				&& !request.rentalEndDate().isAfter(request.rentalStartDate())) {
			throw new RentalOrderConflictException("Rental end date must be after start date");
		}

		Optional<UserEntity> user = userRepository.findById(request.userId());
		if (user.isEmpty()) return Optional.empty();

		VehicleEntity vehicle = null;
		if (request.vehicleId() != null) {
			Optional<VehicleEntity> vehicleOpt = vehicleRepository.findById(request.vehicleId());
			if (vehicleOpt.isEmpty()) return Optional.empty();
			vehicle = vehicleOpt.get();
			if (vehicle.getVehicleType() != VehicleType.RENTAL) {
				throw new RentalOrderConflictException("Vehicle is not a rental vehicle");
			}
		}

		rentalOrderMapper.updateBaseFields(request, order);
		order.setUser(user.get());
		order.setVehicle(vehicle);

		if (request.rentalStartDate() != null && request.rentalEndDate() != null) {
			long days = Math.max(1, ChronoUnit.DAYS.between(
					request.rentalStartDate().toLocalDate(),
					request.rentalEndDate().toLocalDate()));
			order.setTotalPrice(pricingService.calculateForRental(days));
		}

		return Optional.of(rentalOrderMapper.toDTO(rentalOrderRepository.save(order)));
	}

	@Transactional
	public Optional<RentalOrderResponseDTO> updateRentalOrderStatus(Long id, RentalOrderStatus status) {
		return rentalOrderRepository.findById(id)
				.map(order -> {
					order.setStatus(status);
					return rentalOrderMapper.toDTO(rentalOrderRepository.save(order));
				});
	}

	@Transactional
	public Optional<RentalOrderResponseDTO> cancelRentalOrder(Long id, String callerEmail) {
		return rentalOrderRepository.findById(id).map(order -> {
			UserEntity owner = order.getUser();
			if (owner == null || !owner.getEmail().equals(callerEmail)) {
				throw new RentalOrderForbiddenException("Only the rental order owner can cancel this order");
			}
			return transitionToCanceled(order);
		});
	}

	@Transactional
	public Optional<RentalOrderResponseDTO> adminCancelRentalOrder(Long id) {
		return rentalOrderRepository.findById(id).map(this::transitionToCanceled);
	}

	public boolean deleteRentalOrder(Long id) {
		if (!rentalOrderRepository.existsById(id)) {
			return false;
		}
		rentalOrderRepository.deleteById(id);
		return true;
	}

	private RentalOrderResponseDTO transitionToCanceled(RentalOrderEntity order) {
		if (!CANCELLABLE_STATUSES.contains(order.getStatus())) {
			throw new RentalOrderConflictException("Rental order cannot be cancelled in status " + order.getStatus());
		}
		order.setStatus(RentalOrderStatus.CANCELED);
		return rentalOrderMapper.toDTO(rentalOrderRepository.save(order));
	}
}
