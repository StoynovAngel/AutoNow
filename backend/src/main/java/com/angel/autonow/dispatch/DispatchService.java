package com.angel.autonow.dispatch;

import com.angel.autonow.company.CompanyType;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.order.OrderAssignmentRequestDTO;
import com.angel.autonow.order.OrderConflictException;
import com.angel.autonow.order.OrderResponseDTO;
import com.angel.autonow.order.OrderService;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.vehicle.VehicleRepository;
import com.angel.autonow.vehicle.VehicleType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class DispatchService {

	private final OrderService orderService;
	private final DriverRepository driverRepository;
	private final VehicleRepository vehicleRepository;
	private final DispatchLlmClient llmClient;

	public Optional<OrderResponseDTO> autoAssign(Long orderId) {
		var orderOpt = orderService.getOrderById(orderId);
		if (orderOpt.isEmpty()) {
			return Optional.empty();
		}

		var order = orderOpt.get();
		if (order.status() != OrderStatus.CREATED) {
			throw new OrderConflictException("Only orders in CREATED status can be auto-assigned");
		}

		CompanyType companyType = CompanyType.valueOf(order.vehicleType().name());
		List<DriverEntity> available = driverRepository.findAllByCompanyCompanyType(companyType)
				.stream()
				.filter(DriverEntity::isAvailable)
				.toList();

		if (available.isEmpty()) {
			throw new NoAvailableDriverException("No available drivers for vehicle type " + order.vehicleType());
		}

		DriverEntity chosen = pickDriver(order, available);
		Long vehicleId = resolveVehicle(chosen, order.vehicleType());

		return orderService.assignOrder(orderId, new OrderAssignmentRequestDTO(chosen.getId(), vehicleId));
	}

	private DriverEntity pickDriver(OrderResponseDTO order, List<DriverEntity> available) {
		try {
			DispatchSuggestionDTO suggestion = llmClient.suggestDriver(order, available);
			return available.stream()
					.filter(d -> d.getId().equals(suggestion.driverId()))
					.findFirst()
					.orElseGet(() -> randomDriver(available));
		} catch (Exception e) {
			log.warn("AI dispatch failed, picking random driver", e);
			return randomDriver(available);
		}
	}

	private DriverEntity randomDriver(List<DriverEntity> available) {
		return available.get((int) (Math.random() * available.size()));
	}

	private Long resolveVehicle(DriverEntity driver, VehicleType vehicleType) {
		return vehicleRepository
				.findByCompanyIdAndVehicleType(driver.getCompany().getId(), vehicleType)
				.stream()
				.filter(v -> v.getDriver() != null && v.getDriver().getId().equals(driver.getId()))
				.map(v -> v.getId())
				.findFirst()
				.orElseThrow(() -> new NoAvailableDriverException("Chosen driver has no assigned vehicle"));
	}
}
