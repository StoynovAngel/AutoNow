package com.angel.autonow.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
	List<OrderEntity> findByUserId(Long userId);
	boolean existsByUserIdAndStatusIn(Long userId, Collection<OrderStatus> statuses);
}
