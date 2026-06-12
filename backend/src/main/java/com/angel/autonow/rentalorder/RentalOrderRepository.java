package com.angel.autonow.rentalorder;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Set;

public interface RentalOrderRepository extends JpaRepository<RentalOrderEntity, Long> {

	List<RentalOrderEntity> findByUserId(Long userId);

	List<RentalOrderEntity> findByCompanyId(Long companyId);

	boolean existsByUserIdAndStatusIn(Long userId, Set<RentalOrderStatus> statuses);
}
