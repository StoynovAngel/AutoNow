package com.angel.autonow.driver;

import com.angel.autonow.company.CompanyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverRepository extends JpaRepository<DriverEntity, Long> {
	List<DriverEntity> findByCompanyId(Long companyId);
	boolean existsByCompanyId(Long companyId);
	List<DriverEntity> findAllByCompanyCompanyType(CompanyType companyType);
}
