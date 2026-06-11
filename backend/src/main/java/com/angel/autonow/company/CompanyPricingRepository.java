package com.angel.autonow.company;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CompanyPricingRepository extends JpaRepository<CompanyPricingEntity, Long> {
	Optional<CompanyPricingEntity> findByCompanyId(Long companyId);
}
