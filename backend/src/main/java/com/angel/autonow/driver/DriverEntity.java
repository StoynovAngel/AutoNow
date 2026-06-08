package com.angel.autonow.driver;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.vehicle.VehicleEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import org.hibernate.validator.constraints.URL;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
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

	@NotEmpty(message = "At least one expertise type is required")
	@ElementCollection(targetClass = ExpertiseType.class)
	@Enumerated(EnumType.STRING)
	@CollectionTable(name = "driver_expertise", joinColumns = @JoinColumn(name = "driver_id"))
	@Column(name = "expertise_type", nullable = false)
	private Set<ExpertiseType> expertiseType;

	@Column(name = "available")
	private boolean available;

	@URL(message = "Image URL must be valid")
	@Column(name = "image_url")
	private String imageUrl;

	@ManyToOne
	@JoinColumn(name = "company_id")
	private CompanyEntity company;

	@OneToMany(mappedBy = "driver")
	@Builder.Default
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Set<VehicleEntity> vehicles = new HashSet<>();
}
