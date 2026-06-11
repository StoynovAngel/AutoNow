package com.angel.autonow.order;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
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
@Table(name = "taxi_orders")
@DiscriminatorValue("TAXI")
@EqualsAndHashCode(callSuper = true)
public class TaxiOrderEntity extends OrderEntity {

	@Positive(message = "Passenger count must be positive")
	@Column(name = "passenger_count")
	private Integer passengerCount;

	@Min(value = 0, message = "Luggage count cannot be negative")
	@Column(name = "luggage_count")
	private Integer luggageCount;

	@Column(name = "requires_air_conditioning")
	private Boolean requiresAirConditioning;
}
