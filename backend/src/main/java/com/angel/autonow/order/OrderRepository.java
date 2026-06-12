package com.angel.autonow.order;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
	List<OrderEntity> findByUserId(Long userId);
	List<OrderEntity> findByCompanyId(Long companyId);
	List<OrderEntity> findByDriverCompanyId(Long companyId);
	Optional<OrderEntity> findFirstByUserIdAndStatusInOrderByCreatedAtDesc(Long userId, Collection<OrderStatus> statuses);
	boolean existsByUserIdAndStatusIn(Long userId, Collection<OrderStatus> statuses);

	@Modifying
	@Query("update OrderEntity o set o.vehicle = null where o.vehicle.id = :vehicleId")
	void detachVehicleFromOrders(@Param("vehicleId") Long vehicleId);

	@Query("select count(o) > 0 from OrderEntity o " +
			"where o.driver.id = :driverId and o.status in :statuses and o.id <> :excludeOrderId")
	boolean driverHasActiveOrderExcluding(@Param("driverId") Long driverId,
										  @Param("statuses") Collection<OrderStatus> statuses,
										  @Param("excludeOrderId") Long excludeOrderId);

	@Query("select count(o) > 0 from OrderEntity o " +
			"where o.vehicle.id = :vehicleId and o.status in :statuses and o.id <> :excludeOrderId")
	boolean vehicleHasActiveOrderExcluding(@Param("vehicleId") Long vehicleId,
										   @Param("statuses") Collection<OrderStatus> statuses,
										   @Param("excludeOrderId") Long excludeOrderId);
}
