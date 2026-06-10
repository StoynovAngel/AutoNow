package com.angel.autonow.order;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
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

	@DecimalMin(value = "0.1", message = "Weight must be at least 0.1 kg")
	@DecimalMax(value = "5000.0", message = "Weight cannot exceed 5000 kg")
	@Column(name = "weight_kg")
	private Double weightKg;
}
