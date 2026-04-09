package com.angel.autonow.rating;

import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RatingServiceTest {

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
		RatingRequestDTO request = new RatingRequestDTO(1L, 5, "Great!");
		OrderEntity order = OrderEntity.builder().id(1L).build();

		RatingEntity entity = RatingEntity.builder()
				.rating(5)
				.comment("Great!")
				.build();

		RatingEntity saved = RatingEntity.builder()
				.id(1L)
				.order(order)
				.rating(5)
				.comment("Great!")
				.createdAt(LocalDateTime.now())
				.build();

		RatingResponseDTO response = new RatingResponseDTO(1L, 1L, 5, "Great!", saved.getCreatedAt());

		when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
		when(ratingMapper.toEntity(request)).thenReturn(entity);
		when(ratingRepository.save(entity)).thenReturn(saved);
		when(ratingMapper.toDTO(saved)).thenReturn(response);

		Optional<RatingResponseDTO> result = ratingService.createRating(request);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		assertEquals(5, result.get().rating());
		assertEquals("Great!", result.get().comment());
	}

	@Test
	void createRating_orderNotFound_returnsEmpty() {
		RatingRequestDTO request = new RatingRequestDTO(99L, 5, "Great!");

		when(orderRepository.findById(99L)).thenReturn(Optional.empty());

		Optional<RatingResponseDTO> result = ratingService.createRating(request);

		assertTrue(result.isEmpty());
		verify(ratingRepository, never()).save(any());
	}

	@Test
	void getRatingById_returnRatingResponse() {
		OrderEntity order = OrderEntity.builder().id(1L).build();
		RatingEntity entity = RatingEntity.builder().id(1L).order(order).rating(4).comment("Good").createdAt(LocalDateTime.now()).build();
		RatingResponseDTO response = new RatingResponseDTO(1L, 1L, 4, "Good", entity.getCreatedAt());

		when(ratingRepository.findById(1L)).thenReturn(Optional.of(entity));
		when(ratingMapper.toDTO(entity)).thenReturn(response);

		Optional<RatingResponseDTO> result = ratingService.getRatingById(1L);

		assertTrue(result.isPresent());
		assertEquals(4, result.get().rating());
	}

	@Test
	void getRatingById_notFound_returnsEmpty() {
		when(ratingRepository.findById(99L)).thenReturn(Optional.empty());

		Optional<RatingResponseDTO> result = ratingService.getRatingById(99L);

		assertTrue(result.isEmpty());
	}

	@Test
	void getRatingByOrderId_returnRatingResponse() {
		OrderEntity order = OrderEntity.builder().id(1L).build();
		RatingEntity entity = RatingEntity.builder().id(1L).order(order).rating(3).comment("OK").createdAt(LocalDateTime.now()).build();
		RatingResponseDTO response = new RatingResponseDTO(1L, 1L, 3, "OK", entity.getCreatedAt());

		when(ratingRepository.findByOrderId(1L)).thenReturn(Optional.of(entity));
		when(ratingMapper.toDTO(entity)).thenReturn(response);

		Optional<RatingResponseDTO> result = ratingService.getRatingByOrderId(1L);

		assertTrue(result.isPresent());
		assertEquals(3, result.get().rating());
	}

	@Test
	void getRatingByOrderId_notFound_returnsEmpty() {
		when(ratingRepository.findByOrderId(99L)).thenReturn(Optional.empty());

		Optional<RatingResponseDTO> result = ratingService.getRatingByOrderId(99L);

		assertTrue(result.isEmpty());
	}

	@Test
	void getAllRatings_returnList() {
		OrderEntity order1 = OrderEntity.builder().id(1L).build();
		OrderEntity order2 = OrderEntity.builder().id(2L).build();

		RatingEntity e1 = RatingEntity.builder().id(1L).order(order1).rating(5).createdAt(LocalDateTime.now()).build();
		RatingEntity e2 = RatingEntity.builder().id(2L).order(order2).rating(3).createdAt(LocalDateTime.now()).build();

		RatingResponseDTO r1 = new RatingResponseDTO(1L, 1L, 5, null, e1.getCreatedAt());
		RatingResponseDTO r2 = new RatingResponseDTO(2L, 2L, 3, null, e2.getCreatedAt());

		when(ratingRepository.findAll()).thenReturn(List.of(e1, e2));
		when(ratingMapper.toDTO(e1)).thenReturn(r1);
		when(ratingMapper.toDTO(e2)).thenReturn(r2);

		List<RatingResponseDTO> result = ratingService.getAllRatings();

		assertEquals(2, result.size());
	}

	@Test
	void getAllRatings_emptyList() {
		when(ratingRepository.findAll()).thenReturn(List.of());
		List<RatingResponseDTO> result = ratingService.getAllRatings();
		assertTrue(result.isEmpty());
	}
}
