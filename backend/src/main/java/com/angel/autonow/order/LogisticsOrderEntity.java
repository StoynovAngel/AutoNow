package com.angel.autonow.order;

import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "logistics_orders")
@DiscriminatorValue("LOGISTICS")
@EqualsAndHashCode(callSuper = true)
public class LogisticsOrderEntity extends OrderEntity {

	@Positive(message = "Weight must be positive")
	@Column(name = "weight_kg")
	private Double weightKg;
}
