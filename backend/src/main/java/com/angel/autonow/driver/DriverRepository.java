package com.angel.autonow.driver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<DriverEntity, Long> {

	List<DriverEntity> findByCompanyId(Long companyId);

	boolean existsByCompanyId(Long companyId);

	List<DriverEntity> findByVehicles_Id(Long vehicleId);
}
