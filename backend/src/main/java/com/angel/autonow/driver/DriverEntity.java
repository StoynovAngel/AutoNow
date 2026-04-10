package com.angel.autonow.driver;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.vehicle.VehicleEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import org.hibernate.validator.constraints.URL;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "driver")
public class DriverEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "First name is required")
	@Column(name = "first_name", nullable = false)
	private String firstName;

	@NotBlank(message = "Last name is required")
	@Column(name = "last_name", nullable = false)
	private String lastName;

	@NotBlank(message = "Phone number is required")
	@Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must be valid")
	@Column(name = "phone_number", nullable = false)
	private String phoneNumber;

	@NotBlank(message = "License number is required")
	@Column(name = "license_number", unique = true, nullable = false)
	private String licenseNumber;

	@NotNull(message = "Expertise type is required")
	@Enumerated(EnumType.STRING)
	@Column(name = "expertise_type", nullable = false)
	private ExpertiseType expertiseType;

	@Column(name = "available")
	private boolean available;

	@URL(message = "Image URL must be valid")
	@Column(name = "image_url")
	private String imageUrl;

	@ManyToOne
	@JoinColumn(name = "company_id")
	private CompanyEntity company;

	@OneToMany
	@JoinTable(
		name = "driver_vehicles",
		joinColumns = @JoinColumn(name = "driver_id"),
		inverseJoinColumns = @JoinColumn(name = "vehicle_id")
	)
	private Set<VehicleEntity> vehicles;
}
