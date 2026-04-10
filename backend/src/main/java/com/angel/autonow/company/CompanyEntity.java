package com.angel.autonow.company;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "company")
public class CompanyEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Company name is required")
	@Column(name = "name", nullable = false)
	private String name;

	@NotBlank(message = "Address is required")
	@Column(name = "address", nullable = false)
	private String address;

	@NotBlank(message = "Phone is required")
	@Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Phone number must be valid")
	@Column(name = "phone", nullable = false)
	private String phone;

	@NotBlank(message = "Email is required")
	@Email(message = "Email must be valid")
	@Column(name = "email", unique = true, nullable = false)
	private String email;

	@URL(message = "Logo URL must be valid")
	@Column(name = "logo_url")
	private String logoUrl;

	@Column(name = "description", length = 1000)
	private String description;

	@NotNull(message = "Company type is required")
	@Enumerated(EnumType.STRING)
	@Column(name = "company_type", nullable = false)
	private CompanyType companyType;

	@Column(name = "created_at", nullable = false, updatable = false)
	private LocalDateTime createdAt;

	@Column(name = "updated_at")
	private LocalDateTime updatedAt;

	@PrePersist
	protected void onCreate() {
		createdAt = LocalDateTime.now();
		updatedAt = LocalDateTime.now();
	}

	@PreUpdate
	protected void onUpdate() {
		updatedAt = LocalDateTime.now();
	}
}
