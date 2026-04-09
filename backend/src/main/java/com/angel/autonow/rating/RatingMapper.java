package com.angel.autonow.rating;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RatingMapper {

	@Mapping(source = "order.id", target = "orderId")
	RatingResponseDTO toDTO(RatingEntity rating);

	@Mapping(target = "id", ignore = true)
	@Mapping(target = "order", ignore = true)
	@Mapping(target = "createdAt", ignore = true)
	RatingEntity toEntity(RatingRequestDTO request);
}
