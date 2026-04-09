package com.angel.autonow.rating;

import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RatingService {

	private final RatingRepository ratingRepository;
	private final RatingMapper ratingMapper;
	private final OrderRepository orderRepository;

	@Transactional
	public Optional<RatingResponseDTO> createRating(RatingRequestDTO request) {
		Optional<OrderEntity> order = orderRepository.findById(request.orderId());

		if (order.isEmpty()) {
			return Optional.empty();
		}

		RatingEntity rating = ratingMapper.toEntity(request);
		rating.setOrder(order.get());
		RatingEntity saved = ratingRepository.save(rating);

		return Optional.of(ratingMapper.toDTO(saved));
	}

	public Optional<RatingResponseDTO> getRatingById(Long id) {
		return ratingRepository.findById(id).map(ratingMapper::toDTO);
	}

	public Optional<RatingResponseDTO> getRatingByOrderId(Long orderId) {
		return ratingRepository.findByOrderId(orderId).map(ratingMapper::toDTO);
	}

	public List<RatingResponseDTO> getAllRatings() {
		return ratingRepository.findAll().stream()
				.map(ratingMapper::toDTO)
				.toList();
	}
}
