package com.angel.autonow.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VehicleRepository extends JpaRepository<VehicleEntity, Long> {

	List<VehicleEntity> findByCompanyId(Long companyId);

	List<VehicleEntity> findByCompanyIdAndVehicleType(Long companyId, VehicleType vehicleType);

	boolean existsByCompanyId(Long companyId);
}
