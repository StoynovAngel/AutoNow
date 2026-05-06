package com.angel.autonow.company;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity, Long> {
	Optional<CompanyEntity> findByEmail(String email);
	List<CompanyEntity> findByCompanyType(CompanyType companyType);
}
