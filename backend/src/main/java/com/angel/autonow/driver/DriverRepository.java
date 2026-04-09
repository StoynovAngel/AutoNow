package com.angel.autonow.driver;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DriverRepository extends JpaRepository<DriverEntity, Long> {

	Optional<DriverEntity> findByLicenseNumber(String licenseNumber);
}
