package com.angel.autonow.rentalorder;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.pricing.PricingService;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
import com.angel.autonow.vehicle.VehicleType;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anySet;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalOrderServiceTest {

	private static final Long NON_EXISTENT_ID = 999L;
	private static final LocalDateTime NOW = LocalDateTime.now();
	private static final LocalDateTime START = NOW.plusDays(1);
	private static final LocalDateTime END = NOW.plusDays(4);

	@Mock private RentalOrderRepository rentalOrderRepository;
	@Mock private RentalOrderMapper rentalOrderMapper;
	@Mock private UserRepository userRepository;
	@Mock private VehicleRepository vehicleRepository;
	@Mock private CompanyRepository companyRepository;
	@Mock private PricingService pricingService;

	@InjectMocks
	private RentalOrderService rentalOrderService;

	private RentalOrderRequestDTO buildRequest(Long userId, Long vehicleId) {
		return RentalOrderRequestDTO.builder()
				.userId(userId)
				.vehicleId(vehicleId)
				.rentalStartDate(START)
				.rentalEndDate(END)
				.build();
	}

	private RentalOrderResponseDTO buildResponse(Long id, Long userId, RentalOrderStatus status) {
		return RentalOrderResponseDTO.builder()
				.id(id).userId(userId).status(status)
				.rentalStartDate(START).rentalEndDate(END)
				.createdAt(NOW).build();
	}

	@Test
	void createRentalOrder_returnsResponse() {
		RentalOrderRequestDTO request = buildRequest(1L, null);
		UserEntity user = UserEntity.builder().id(1L).build();
		RentalOrderEntity saved = RentalOrderEntity.builder().id(1L).user(user)
				.rentalStartDate(START).rentalEndDate(END).status(RentalOrderStatus.CREATED).createdAt(NOW).build();
		RentalOrderResponseDTO response = buildResponse(1L, 1L, RentalOrderStatus.CREATED);

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(rentalOrderRepository.existsByUserIdAndStatusIn(eq(1L), anySet())).thenReturn(false);
		when(rentalOrderRepository.save(any())).thenReturn(saved);
		when(rentalOrderMapper.toDTO(saved)).thenReturn(response);

		var result = rentalOrderService.createRentalOrder(request);

		assertTrue(result.isPresent());
		assertEquals(RentalOrderStatus.CREATED, result.get().status());
		verify(rentalOrderRepository).save(any());
	}

	@Test
	void createRentalOrder_userNotFound_returnsEmpty() {
		when(userRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = rentalOrderService.createRentalOrder(buildRequest(NON_EXISTENT_ID, null));

		assertTrue(result.isEmpty());
		verify(rentalOrderRepository, never()).save(any());
	}

	@Test
	void createRentalOrder_userHasActiveRental_throwsConflict() {
		UserEntity user = UserEntity.builder().id(1L).build();
		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(rentalOrderRepository.existsByUserIdAndStatusIn(eq(1L), anySet())).thenReturn(true);

		assertThrows(RentalOrderConflictException.class,
				() -> rentalOrderService.createRentalOrder(buildRequest(1L, null)));
		verify(rentalOrderRepository, never()).save(any());
	}

	@Test
	void createRentalOrder_endBeforeStart_throwsConflict() {
		RentalOrderRequestDTO bad = RentalOrderRequestDTO.builder()
				.userId(1L).rentalStartDate(END).rentalEndDate(START).build();

		assertThrows(RentalOrderConflictException.class,
				() -> rentalOrderService.createRentalOrder(bad));
		verify(userRepository, never()).findById(anyLong());
	}

	@Test
	void createRentalOrder_withVehicle_setsPriceAndVehicle() {
		RentalOrderRequestDTO request = buildRequest(1L, 2L);
		UserEntity user = UserEntity.builder().id(1L).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(2L).vehicleType(VehicleType.RENTAL).build();
		RentalOrderEntity saved = RentalOrderEntity.builder().id(1L).user(user).vehicle(vehicle)
				.rentalStartDate(START).rentalEndDate(END).status(RentalOrderStatus.CREATED).createdAt(NOW).build();
		RentalOrderResponseDTO response = buildResponse(1L, 1L, RentalOrderStatus.CREATED);

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(rentalOrderRepository.existsByUserIdAndStatusIn(eq(1L), anySet())).thenReturn(false);
		when(vehicleRepository.findById(2L)).thenReturn(Optional.of(vehicle));
		when(pricingService.calculateForRental(3L)).thenReturn(135.0);
		when(rentalOrderRepository.save(any())).thenReturn(saved);
		when(rentalOrderMapper.toDTO(saved)).thenReturn(response);

		var result = rentalOrderService.createRentalOrder(request);

		assertTrue(result.isPresent());
		verify(pricingService).calculateForRental(3L);
	}

	@Test
	void createRentalOrder_nonRentalVehicle_throwsConflict() {
		RentalOrderRequestDTO request = buildRequest(1L, 2L);
		UserEntity user = UserEntity.builder().id(1L).build();
		VehicleEntity vehicle = VehicleEntity.builder().id(2L).vehicleType(VehicleType.TAXI).build();

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(rentalOrderRepository.existsByUserIdAndStatusIn(eq(1L), anySet())).thenReturn(false);
		when(vehicleRepository.findById(2L)).thenReturn(Optional.of(vehicle));

		assertThrows(RentalOrderConflictException.class,
				() -> rentalOrderService.createRentalOrder(request));
		verify(rentalOrderRepository, never()).save(any());
	}

	@Test
	void createRentalOrder_vehicleNotFound_returnsEmpty() {
		RentalOrderRequestDTO request = buildRequest(1L, NON_EXISTENT_ID);
		UserEntity user = UserEntity.builder().id(1L).build();

		when(userRepository.findById(1L)).thenReturn(Optional.of(user));
		when(rentalOrderRepository.existsByUserIdAndStatusIn(eq(1L), anySet())).thenReturn(false);
		when(vehicleRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = rentalOrderService.createRentalOrder(request);

		assertTrue(result.isEmpty());
		verify(rentalOrderRepository, never()).save(any());
	}

	@Test
	void getRentalOrderById_returnsResponse() {
		RentalOrderEntity entity = RentalOrderEntity.builder().id(1L).status(RentalOrderStatus.CREATED).createdAt(NOW).build();
		RentalOrderResponseDTO response = buildResponse(1L, 1L, RentalOrderStatus.CREATED);

		when(rentalOrderRepository.findById(1L)).thenReturn(Optional.of(entity));
		when(rentalOrderMapper.toDTO(entity)).thenReturn(response);

		var result = rentalOrderService.getRentalOrderById(1L);

		assertTrue(result.isPresent());
	}

	@Test
	void getRentalOrderById_notFound_returnsEmpty() {
		when(rentalOrderRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = rentalOrderService.getRentalOrderById(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
	}

	@Test
	void getRentalOrdersByUserId_returnsList() {
		RentalOrderEntity entity = RentalOrderEntity.builder().id(1L).createdAt(NOW).build();
		RentalOrderResponseDTO response = buildResponse(1L, 1L, RentalOrderStatus.CREATED);

		when(rentalOrderRepository.findByUserId(1L)).thenReturn(List.of(entity));
		when(rentalOrderMapper.toDTO(entity)).thenReturn(response);

		assertEquals(1, rentalOrderService.getRentalOrdersByUserId(1L).size());
	}

	@Test
	void getRentalOrdersByCompanyId_returnsList() {
		RentalOrderEntity entity = RentalOrderEntity.builder().id(1L).createdAt(NOW).build();
		RentalOrderResponseDTO response = buildResponse(1L, 1L, RentalOrderStatus.CREATED);

		when(rentalOrderRepository.findByCompanyId(1L)).thenReturn(List.of(entity));
		when(rentalOrderMapper.toDTO(entity)).thenReturn(response);

		assertEquals(1, rentalOrderService.getRentalOrdersByCompanyId(1L).size());
	}

	@Test
	void getAllRentalOrders_returnsList() {
		RentalOrderEntity e1 = RentalOrderEntity.builder().id(1L).createdAt(NOW).build();
		RentalOrderEntity e2 = RentalOrderEntity.builder().id(2L).createdAt(NOW).build();
		RentalOrderResponseDTO r1 = buildResponse(1L, 1L, RentalOrderStatus.CREATED);
		RentalOrderResponseDTO r2 = buildResponse(2L, 1L, RentalOrderStatus.COMPLETED);

		when(rentalOrderRepository.findAll()).thenReturn(List.of(e1, e2));
		when(rentalOrderMapper.toDTO(e1)).thenReturn(r1);
		when(rentalOrderMapper.toDTO(e2)).thenReturn(r2);

		assertEquals(2, rentalOrderService.getAllRentalOrders().size());
	}

	@Test
	void deleteRentalOrder_existingId_returnsTrue() {
		when(rentalOrderRepository.existsById(1L)).thenReturn(true);

		assertTrue(rentalOrderService.deleteRentalOrder(1L));
		verify(rentalOrderRepository).deleteById(1L);
	}

	@Test
	void deleteRentalOrder_notFound_returnsFalse() {
		when(rentalOrderRepository.existsById(NON_EXISTENT_ID)).thenReturn(false);

		assertFalse(rentalOrderService.deleteRentalOrder(NON_EXISTENT_ID));
	}

	@Test
	void updateRentalOrderStatus_setsStatus() {
		RentalOrderEntity entity = RentalOrderEntity.builder().id(1L).status(RentalOrderStatus.CREATED).createdAt(NOW).build();
		RentalOrderResponseDTO response = buildResponse(1L, 1L, RentalOrderStatus.ACCEPTED);

		when(rentalOrderRepository.findById(1L)).thenReturn(Optional.of(entity));
		when(rentalOrderRepository.save(entity)).thenReturn(entity);
		when(rentalOrderMapper.toDTO(entity)).thenReturn(response);

		var result = rentalOrderService.updateRentalOrderStatus(1L, RentalOrderStatus.ACCEPTED);

		assertTrue(result.isPresent());
		assertEquals(RentalOrderStatus.ACCEPTED, entity.getStatus());
	}

	@Test
	void cancelRentalOrder_byOwner_setsCanceled() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		RentalOrderEntity order = RentalOrderEntity.builder().id(1L).user(owner).status(RentalOrderStatus.CREATED).build();
		RentalOrderResponseDTO response = buildResponse(1L, 1L, RentalOrderStatus.CANCELED);

		when(rentalOrderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(rentalOrderRepository.save(order)).thenReturn(order);
		when(rentalOrderMapper.toDTO(order)).thenReturn(response);

		var result = rentalOrderService.cancelRentalOrder(1L, "owner@example.com");

		assertTrue(result.isPresent());
		assertEquals(RentalOrderStatus.CANCELED, order.getStatus());
	}

	@Test
	void cancelRentalOrder_byNonOwner_throwsForbidden() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		RentalOrderEntity order = RentalOrderEntity.builder().id(1L).user(owner).status(RentalOrderStatus.CREATED).build();

		when(rentalOrderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(RentalOrderForbiddenException.class,
				() -> rentalOrderService.cancelRentalOrder(1L, "stranger@example.com"));
		verify(rentalOrderRepository, never()).save(any());
	}

	@Test
	void cancelRentalOrder_inProgressStatus_throwsConflict() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		RentalOrderEntity order = RentalOrderEntity.builder().id(1L).user(owner).status(RentalOrderStatus.IN_PROGRESS).build();

		when(rentalOrderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(RentalOrderConflictException.class,
				() -> rentalOrderService.cancelRentalOrder(1L, "owner@example.com"));
	}

	@Test
	void adminCancelRentalOrder_setsStatusCanceled() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		RentalOrderEntity order = RentalOrderEntity.builder().id(1L).user(owner).status(RentalOrderStatus.ACCEPTED).build();
		RentalOrderResponseDTO response = buildResponse(1L, 1L, RentalOrderStatus.CANCELED);

		when(rentalOrderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(rentalOrderRepository.save(order)).thenReturn(order);
		when(rentalOrderMapper.toDTO(order)).thenReturn(response);

		var result = rentalOrderService.adminCancelRentalOrder(1L);

		assertTrue(result.isPresent());
		assertEquals(RentalOrderStatus.CANCELED, order.getStatus());
	}

	@Test
	void adminCancelRentalOrder_inProgressStatus_throwsConflict() {
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		RentalOrderEntity order = RentalOrderEntity.builder().id(1L).user(owner).status(RentalOrderStatus.IN_PROGRESS).build();

		when(rentalOrderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(RentalOrderConflictException.class,
				() -> rentalOrderService.adminCancelRentalOrder(1L));
	}
}
