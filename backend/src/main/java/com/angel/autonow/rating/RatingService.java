package com.angel.autonow.rating;

import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.user.UserEntity;
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
	public Optional<RatingResponseDTO> createRating(RatingRequestDTO request, String callerEmail) {
		Optional<OrderEntity> orderOpt = orderRepository.findById(request.orderId());

		if (orderOpt.isEmpty()) {
			return Optional.empty();
		}

		OrderEntity order = orderOpt.get();

		UserEntity owner = order.getUser();
		if (owner == null || !owner.getEmail().equals(callerEmail)) {
			throw new RatingForbiddenException("Only the order owner can rate this order");
		}

		if (order.getStatus() != OrderStatus.COMPLETED) {
			throw new RatingConflictException("Order can only be rated when completed");
		}

		RatingEntity rating = ratingMapper.toEntity(request);
		rating.setOrder(order);
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

	public List<RatingResponseDTO> getRatingsByDriverId(Long driverId) {
		return ratingRepository.findByOrderDriverId(driverId).stream()
				.map(ratingMapper::toDTO)
				.toList();
	}

	@Transactional
	public Optional<RatingResponseDTO> updateRating(Long id, RatingRequestDTO request) {
		Optional<RatingEntity> existing = ratingRepository.findById(id);

		if (existing.isEmpty()) {
			return Optional.empty();
		}

		RatingEntity rating = existing.get();

		if (!rating.getOrder().getId().equals(request.orderId())) {
			Optional<OrderEntity> order = orderRepository.findById(request.orderId());

			if (order.isEmpty()) {
				return Optional.empty();
			}

			rating.setOrder(order.get());
		}

		ratingMapper.updateEntity(request, rating);
		return Optional.of(ratingMapper.toDTO(ratingRepository.save(rating)));
	}

	public boolean deleteRating(Long id) {
		if (!ratingRepository.existsById(id)) {
			return false;
		}

		ratingRepository.deleteById(id);

		return true;
	}
}
