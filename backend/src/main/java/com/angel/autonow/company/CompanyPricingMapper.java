package com.angel.autonow.company;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CompanyPricingMapper {

	@Mapping(target = "companyId", source = "company.id")
	CompanyPricingResponseDTO toDTO(CompanyPricingEntity entity);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	CompanyPricingEntity toEntity(CompanyPricingRequestDTO request);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "company", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	@Mapping(target = "updatedAt", ignore = true)
	void updateEntity(CompanyPricingRequestDTO request, @MappingTarget CompanyPricingEntity entity);
}
