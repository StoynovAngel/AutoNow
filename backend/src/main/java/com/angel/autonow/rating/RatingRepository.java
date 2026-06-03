package com.angel.autonow.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<RatingEntity, Long> {
	Optional<RatingEntity> findByOrderId(Long orderId);
	List<RatingEntity> findByOrderDriverId(Long driverId);
}
