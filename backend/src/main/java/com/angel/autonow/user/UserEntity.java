package com.angel.autonow.user;

import com.angel.autonow.company.CompanyEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class UserEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@NotBlank(message = "Email is required")
	@Email(message = "Email must be valid")
	@Column(unique = true, nullable = false)
	private String email;

	@NotBlank(message = "Password is required")
	@Size(min = 8, message = "Password must be at least 8 characters")
	@Column(nullable = false)
	private String password;

	@NotEmpty(message = "At least one authority is required")
	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "user_authorities", joinColumns = @JoinColumn(name = "user_id"))
	private Set<String> authorities;

	@ManyToOne
	@JoinColumn(name = "company_id")
	private CompanyEntity company;
}
