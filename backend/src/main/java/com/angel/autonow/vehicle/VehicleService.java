package com.angel.autonow.vehicle;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

	private final VehicleRepository vehicleRepository;
	private final VehicleMapper vehicleMapper;
	private final CompanyRepository companyRepository;
	private final OrderRepository orderRepository;

	public Optional<VehicleResponseDTO> createVehicle(VehicleRequestDTO request) {
		VehicleEntity vehicle = vehicleMapper.toEntity(request);

		if (request.companyId() != null) {
			var company = companyRepository.findById(request.companyId());
			if (company.isEmpty()) {
				return Optional.empty();
			}
			vehicle.setCompany(company.get());
		}

		VehicleEntity saved = vehicleRepository.save(vehicle);
		return Optional.of(vehicleMapper.toDTO(saved));
	}

	public Optional<VehicleResponseDTO> getVehicleById(Long id) {
		return vehicleRepository.findById(id)
				.map(vehicleMapper::toDTO);
	}

	public List<VehicleResponseDTO> getAllVehicles() {
		return vehicleRepository.findAll().stream()
				.map(vehicleMapper::toDTO)
				.toList();
	}

	@Transactional
	public Optional<VehicleResponseDTO> updateVehicle(Long id, VehicleRequestDTO request) {
		Optional<VehicleEntity> existing = vehicleRepository.findById(id);

		if (existing.isEmpty()) {
			return Optional.empty();
		}

		CompanyEntity company = null;
		if (request.companyId() != null) {
			var companyOpt = companyRepository.findById(request.companyId());
			if (companyOpt.isEmpty()) {
				return Optional.empty();
			}
			company = companyOpt.get();
		}

		VehicleEntity vehicle = existing.get();
		vehicleMapper.updateEntity(request, vehicle);
		vehicle.setCompany(company);

		return Optional.of(vehicleMapper.toDTO(vehicleRepository.save(vehicle)));
	}

	public List<VehicleResponseDTO> getVehiclesByCompanyId(Long companyId) {
		return vehicleRepository.findByCompanyId(companyId).stream()
				.map(vehicleMapper::toDTO)
				.toList();
	}

	public Optional<List<VehicleResponseDTO>> getMyVehicles(Authentication authentication) {
		if (!(authentication instanceof JwtAuthenticationToken jwt)) {
			return Optional.empty();
		}

		Long companyId = jwt.getToken().getClaim("companyId");
		if (companyId == null) {
			return Optional.empty();
		}

		return Optional.of(getVehiclesByCompanyId(companyId));
	}

	@Transactional(readOnly = true)
	public List<PublicVehicleResponseDTO> getPublicVehiclesByCompanyAndType(Long companyId, VehicleType vehicleType) {
		List<VehicleEntity> vehicles = vehicleType != null
				? vehicleRepository.findByCompanyIdAndVehicleType(companyId, vehicleType)
				: vehicleRepository.findByCompanyId(companyId);

		return vehicles.stream()
				.map(this::toPublicDto)
				.toList();
	}

	private PublicVehicleResponseDTO toPublicDto(VehicleEntity vehicle) {
		String driverPhone = vehicle.getDriver() != null ? vehicle.getDriver().getPhoneNumber() : null;

		return PublicVehicleResponseDTO.builder()
				.id(vehicle.getId())
				.brand(vehicle.getBrand())
				.model(vehicle.getModel())
				.licensePlate(vehicle.getLicensePlate())
				.imageUrl(vehicle.getImageUrl())
				.numberOfSeats(vehicle.getNumberOfSeats())
				.vehicleType(vehicle.getVehicleType())
				.companyId(vehicle.getCompany() != null ? vehicle.getCompany().getId() : null)
				.driverPhoneNumber(driverPhone)
				.build();
	}

	@Transactional
	public boolean deleteVehicle(Long id) {
		if (!vehicleRepository.existsById(id)) {
			return false;
		}
		orderRepository.detachVehicleFromOrders(id);
		vehicleRepository.deleteById(id);
		return true;
	}
}
