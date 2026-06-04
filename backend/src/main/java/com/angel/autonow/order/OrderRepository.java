package com.angel.autonow.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
	List<OrderEntity> findByUserId(Long userId);
	Optional<OrderEntity> findFirstByUserIdAndStatusInOrderByCreatedAtDesc(Long userId, Collection<OrderStatus> statuses);
	boolean existsByUserIdAndStatusIn(Long userId, Collection<OrderStatus> statuses);
}
