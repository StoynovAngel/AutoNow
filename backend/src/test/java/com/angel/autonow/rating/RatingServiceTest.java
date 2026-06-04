package com.angel.autonow.rating;

import com.angel.autonow.data.TestData;
import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.user.UserEntity;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

	private static final LocalDateTime NOW = LocalDateTime.now();

	@Mock
	private RatingRepository ratingRepository;

	@Mock
	private RatingMapper ratingMapper;

	@Mock
	private OrderRepository orderRepository;

	@InjectMocks
	private RatingService ratingService;

	@Test
	void createRating_returnRatingResponse() {
		RatingRequestDTO request = TestData.createRatingRequest(1L);
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.COMPLETED).build();
		RatingEntity entity = RatingEntity.builder().rating(5).comment("Excellent service!").build();
		RatingEntity saved = RatingEntity.builder().id(1L).order(order).rating(5).comment("Excellent service!").createdAt(NOW).build();
		RatingResponseDTO response = TestData.createRatingResponse(1L, 1L, 5, "Excellent service!", NOW);

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(ratingMapper.toEntity(request)).thenReturn(entity);
		when(ratingRepository.save(entity)).thenReturn(saved);
		when(ratingMapper.toDTO(saved)).thenReturn(response);

		var result = ratingService.createRating(request, "owner@example.com");

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		assertEquals(5, result.get().rating());
		assertEquals("Excellent service!", result.get().comment());
	}

	@Test
	void createRating_orderNotFound_returnsEmpty() {
		RatingRequestDTO request = TestData.createRatingRequest(NON_EXISTENT_ID);

		when(orderRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = ratingService.createRating(request, "owner@example.com");

		assertTrue(result.isEmpty());
		verify(ratingRepository, never()).save(any());
	}

	@Test
	void createRating_callerNotOwner_throwsForbidden() {
		RatingRequestDTO request = TestData.createRatingRequest(1L);
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.COMPLETED).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(RatingForbiddenException.class,
				() -> ratingService.createRating(request, "intruder@example.com"));
		verify(ratingRepository, never()).save(any());
	}

	@Test
	void createRating_orderHasNoOwner_throwsForbidden() {
		RatingRequestDTO request = TestData.createRatingRequest(1L);
		OrderEntity order = OrderEntity.builder().id(1L).user(null).status(OrderStatus.COMPLETED).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(RatingForbiddenException.class,
				() -> ratingService.createRating(request, "anyone@example.com"));
		verify(ratingRepository, never()).save(any());
	}

	@Test
	void createRating_orderNotCompleted_throwsConflict() {
		RatingRequestDTO request = TestData.createRatingRequest(1L);
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.IN_PROGRESS).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(RatingConflictException.class,
				() -> ratingService.createRating(request, "owner@example.com"));
		verify(ratingRepository, never()).save(any());
	}

	@Test
	void createRating_orderCanceled_throwsConflict() {
		RatingRequestDTO request = TestData.createRatingRequest(1L);
		UserEntity owner = UserEntity.builder().id(1L).email("owner@example.com").build();
		OrderEntity order = OrderEntity.builder().id(1L).user(owner).status(OrderStatus.CANCELED).build();

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

		assertThrows(RatingConflictException.class,
				() -> ratingService.createRating(request, "owner@example.com"));
		verify(ratingRepository, never()).save(any());
	}

	@Test
	void getRatingById_returnRatingResponse() {
		OrderEntity order = OrderEntity.builder().id(1L).build();
		RatingEntity entity = RatingEntity.builder().id(1L).order(order).rating(4).comment("Good").createdAt(NOW).build();
		RatingResponseDTO response = TestData.createRatingResponse(1L, 1L, 4, "Good", NOW);

		when(ratingRepository.findById(1L)).thenReturn(Optional.of(entity));
		when(ratingMapper.toDTO(entity)).thenReturn(response);

		var result = ratingService.getRatingById(1L);

		assertTrue(result.isPresent());
		assertEquals(4, result.get().rating());
	}

	@Test
	void getRatingById_notFound_returnsEmpty() {
		when(ratingRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = ratingService.getRatingById(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
	}

	@Test
	void getRatingByOrderId_returnRatingResponse() {
		OrderEntity order = OrderEntity.builder().id(1L).build();
		RatingEntity entity = RatingEntity.builder().id(1L).order(order).rating(3).comment("OK").createdAt(NOW).build();
		RatingResponseDTO response = TestData.createRatingResponse(1L, 1L, 3, "OK", NOW);

		when(ratingRepository.findByOrderId(1L)).thenReturn(Optional.of(entity));
		when(ratingMapper.toDTO(entity)).thenReturn(response);

		var result = ratingService.getRatingByOrderId(1L);

		assertTrue(result.isPresent());
		assertEquals(3, result.get().rating());
	}

	@Test
	void getRatingByOrderId_notFound_returnsEmpty() {
		when(ratingRepository.findByOrderId(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = ratingService.getRatingByOrderId(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
	}

	@Test
	void getAllRatings_returnList() {
		OrderEntity firstOrder = OrderEntity.builder().id(1L).build();
		OrderEntity secondOrder = OrderEntity.builder().id(2L).build();
		RatingEntity firstRating = RatingEntity.builder().id(1L).order(firstOrder).rating(5).createdAt(NOW).build();
		RatingEntity secondRating = RatingEntity.builder().id(2L).order(secondOrder).rating(3).createdAt(NOW).build();
		RatingResponseDTO firstResponse = TestData.createRatingResponse(1L, 1L, 5, null, NOW);
		RatingResponseDTO secondResponse = TestData.createRatingResponse(2L, 2L, 3, null, NOW);

		when(ratingRepository.findAll()).thenReturn(List.of(firstRating, secondRating));
		when(ratingMapper.toDTO(firstRating)).thenReturn(firstResponse);
		when(ratingMapper.toDTO(secondRating)).thenReturn(secondResponse);

		var result = ratingService.getAllRatings();

		assertEquals(2, result.size());
	}

	@Test
	void getAllRatings_emptyList() {
		when(ratingRepository.findAll()).thenReturn(List.of());

		var result = ratingService.getAllRatings();

		assertTrue(result.isEmpty());
	}

	@Test
	void getRatingsByDriverId_returnList() {
		OrderEntity firstOrder = OrderEntity.builder().id(1L).build();
		OrderEntity secondOrder = OrderEntity.builder().id(2L).build();
		RatingEntity firstRating = RatingEntity.builder().id(1L).order(firstOrder).rating(5).createdAt(NOW).build();
		RatingEntity secondRating = RatingEntity.builder().id(2L).order(secondOrder).rating(4).createdAt(NOW).build();
		RatingResponseDTO firstResponse = TestData.createRatingResponse(1L, 1L, 5, null, NOW);
		RatingResponseDTO secondResponse = TestData.createRatingResponse(2L, 2L, 4, null, NOW);

		when(ratingRepository.findByOrderDriverId(7L)).thenReturn(List.of(firstRating, secondRating));
		when(ratingMapper.toDTO(firstRating)).thenReturn(firstResponse);
		when(ratingMapper.toDTO(secondRating)).thenReturn(secondResponse);

		var result = ratingService.getRatingsByDriverId(7L);

		assertEquals(2, result.size());
		assertEquals(5, result.get(0).rating());
		assertEquals(4, result.get(1).rating());
	}

	@Test
	void getRatingsByDriverId_emptyList() {
		when(ratingRepository.findByOrderDriverId(NON_EXISTENT_ID)).thenReturn(List.of());

		var result = ratingService.getRatingsByDriverId(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
	}

	@Test
	void updateRating_returnUpdatedResponse() {
		RatingRequestDTO request = TestData.createRatingRequest(1L, 4, "Updated comment");
		OrderEntity order = OrderEntity.builder().id(1L).build();
		RatingEntity existing = RatingEntity.builder().id(1L).order(order).rating(3).comment("OK").createdAt(NOW).build();
		RatingEntity saved = RatingEntity.builder().id(1L).order(order).rating(4).comment("Updated comment").createdAt(NOW).build();
		RatingResponseDTO response = TestData.createRatingResponse(1L, 1L, 4, "Updated comment", NOW);

		when(ratingRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(ratingRepository.save(existing)).thenReturn(saved);
		when(ratingMapper.toDTO(saved)).thenReturn(response);

		var result = ratingService.updateRating(1L, request);

		assertTrue(result.isPresent());
		assertEquals(4, result.get().rating());
		assertEquals("Updated comment", result.get().comment());
		verify(ratingMapper).updateEntity(request, existing);
		verify(ratingRepository).save(existing);
	}

	@Test
	void updateRating_notFound_returnsEmpty() {
		RatingRequestDTO request = TestData.createRatingRequest(1L);

		when(ratingRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = ratingService.updateRating(NON_EXISTENT_ID, request);

		assertTrue(result.isEmpty());
		verify(ratingRepository, never()).save(any());
	}

	@Test
	void updateRating_orderNotFound_returnsEmpty() {
		RatingRequestDTO request = TestData.createRatingRequest(2L);
		OrderEntity order = OrderEntity.builder().id(1L).build();
		RatingEntity existing = RatingEntity.builder().id(1L).order(order).rating(3).createdAt(NOW).build();

		when(ratingRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(orderRepository.findById(2L)).thenReturn(Optional.empty());

		var result = ratingService.updateRating(1L, request);

		assertTrue(result.isEmpty());
		verify(ratingRepository, never()).save(any());
	}

	@Test
	void deleteRating_returnTrue() {
		when(ratingRepository.existsById(1L)).thenReturn(true);

		var result = ratingService.deleteRating(1L);

		assertTrue(result);
		verify(ratingRepository).deleteById(1L);
	}

	@Test
	void deleteRating_notFound_returnFalse() {
		when(ratingRepository.existsById(NON_EXISTENT_ID)).thenReturn(false);

		var result = ratingService.deleteRating(NON_EXISTENT_ID);

		assertFalse(result);
		verify(ratingRepository, never()).deleteById(any());
	}
}
