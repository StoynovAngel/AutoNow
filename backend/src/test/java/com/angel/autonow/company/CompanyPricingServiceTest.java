package com.angel.autonow.company;

import com.angel.autonow.pricing.PricingProperties;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.user.role.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authorization.AuthorizationDeniedException;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyPricingServiceTest {

	@Mock private CompanyRepository companyRepository;
	@Mock private UserRepository userRepository;
	@Mock private PricingProperties pricingProperties;
	@Mock private CompanyPricingRepository pricingRepository;
	@Mock private CompanyPricingMapper pricingMapper;

	@InjectMocks
	private CompanyPricingService pricingService;

	@Test
	void getPricing_rowExists_returnsRow() {
		CompanyEntity company = CompanyEntity.builder().id(1L).companyType(CompanyType.TAXI).build();
		CompanyPricingEntity entity = CompanyPricingEntity.builder().id(7L).company(company).baseFare(2.50).build();
		CompanyPricingResponseDTO dto = CompanyPricingResponseDTO.builder().id(7L).companyId(1L).baseFare(2.50).build();

		when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
		when(pricingRepository.findByCompanyId(1L)).thenReturn(Optional.of(entity));
		when(pricingMapper.toDTO(entity)).thenReturn(dto);

		assertThat(pricingService.getPricing(1L)).contains(dto);
	}

	@Test
	void getPricing_taxi_noRow_returnsTaxiDefaults() {
		CompanyEntity company = CompanyEntity.builder().id(1L).companyType(CompanyType.TAXI).build();
		when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
		when(pricingRepository.findByCompanyId(1L)).thenReturn(Optional.empty());
		when(pricingProperties.baseFare()).thenReturn(2.50);
		when(pricingProperties.ratePerKm()).thenReturn(1.20);
		when(pricingProperties.nightMultiplier()).thenReturn(1.20);
		when(pricingProperties.nightStartHour()).thenReturn(22);
		when(pricingProperties.nightEndHour()).thenReturn(6);

		Optional<CompanyPricingResponseDTO> result = pricingService.getPricing(1L);

		assertThat(result).isPresent();
		assertThat(result.get().baseFare()).isEqualTo(2.50);
		assertThat(result.get().nightStartHour()).isEqualTo(22);
		assertThat(result.get().premiumMultiplier()).isNull();
		assertThat(result.get().ambulanceBaseFare()).isNull();
	}

	@Test
	void getPricing_ambulance_noRow_returnsAmbulanceDefaults() {
		CompanyEntity company = CompanyEntity.builder().id(2L).companyType(CompanyType.AMBULANCE).build();
		when(companyRepository.findById(2L)).thenReturn(Optional.of(company));
		when(pricingRepository.findByCompanyId(2L)).thenReturn(Optional.empty());
		when(pricingProperties.ambulanceBaseFare()).thenReturn(60.00);
		when(pricingProperties.ratePerKm()).thenReturn(1.20);
		when(pricingProperties.nightMultiplier()).thenReturn(1.20);
		when(pricingProperties.nightStartHour()).thenReturn(22);
		when(pricingProperties.nightEndHour()).thenReturn(6);

		Optional<CompanyPricingResponseDTO> result = pricingService.getPricing(2L);

		assertThat(result).isPresent();
		assertThat(result.get().ambulanceBaseFare()).isEqualTo(60.00);
		assertThat(result.get().ratePerKm()).isEqualTo(1.20);
		assertThat(result.get().nightStartHour()).isEqualTo(22);
		assertThat(result.get().premiumMultiplier()).isNull();
		assertThat(result.get().baseFare()).isNull();
	}

	@Test
	void getPricing_logistics_noRow_returnsLogisticsDefaults() {
		CompanyEntity company = CompanyEntity.builder().id(3L).companyType(CompanyType.LOGISTICS).build();
		when(companyRepository.findById(3L)).thenReturn(Optional.of(company));
		when(pricingRepository.findByCompanyId(3L)).thenReturn(Optional.empty());
		when(pricingProperties.logisticsBaseFare()).thenReturn(5.00);
		when(pricingProperties.logisticsRatePerKg()).thenReturn(0.05);

		Optional<CompanyPricingResponseDTO> result = pricingService.getPricing(3L);

		assertThat(result).isPresent();
		assertThat(result.get().logisticsBaseFare()).isEqualTo(5.00);
		assertThat(result.get().logisticsRatePerKg()).isEqualTo(0.05);
	}

	@Test
	void getPricing_companyNotFound_returnsEmpty() {
		when(companyRepository.findById(99L)).thenReturn(Optional.empty());
		assertThat(pricingService.getPricing(99L)).isEmpty();
	}

	// ---- createPricing ----

	@Test
	void createPricing_success() {
		CompanyEntity company = CompanyEntity.builder().id(1L).companyType(CompanyType.TAXI).build();
		UserEntity admin = userWithRole("admin@test.com", Role.ADMIN);
		CompanyPricingRequestDTO request = CompanyPricingRequestDTO.builder().baseFare(3.00).build();
		CompanyPricingEntity newEntity = CompanyPricingEntity.builder().baseFare(3.00).build();
		CompanyPricingEntity saved = CompanyPricingEntity.builder().id(10L).company(company).baseFare(3.00).build();
		CompanyPricingResponseDTO dto = CompanyPricingResponseDTO.builder().id(10L).companyId(1L).baseFare(3.00).build();

		when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
		when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));
		when(pricingRepository.findByCompanyId(1L)).thenReturn(Optional.empty());
		when(pricingMapper.toEntity(request)).thenReturn(newEntity);
		when(pricingRepository.save(any(CompanyPricingEntity.class))).thenReturn(saved);
		when(pricingMapper.toDTO(saved)).thenReturn(dto);

		assertThat(pricingService.createPricing(1L, request, "admin@test.com")).contains(dto);
	}

	@Test
	void createPricing_alreadyExists_throws() {
		CompanyEntity company = CompanyEntity.builder().id(1L).companyType(CompanyType.TAXI).build();
		UserEntity admin = userWithRole("admin@test.com", Role.ADMIN);
		CompanyPricingEntity existing = CompanyPricingEntity.builder().id(7L).company(company).build();

		when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
		when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));
		when(pricingRepository.findByCompanyId(1L)).thenReturn(Optional.of(existing));

		assertThatThrownBy(() -> pricingService.createPricing(1L, CompanyPricingRequestDTO.builder().build(), "admin@test.com"))
				.isInstanceOf(PricingAlreadyExistsException.class);
	}

	@Test
	void createPricing_companyNotFound_returnsEmpty() {
		when(companyRepository.findById(99L)).thenReturn(Optional.empty());
		assertThat(pricingService.createPricing(99L, CompanyPricingRequestDTO.builder().build(), "admin@test.com")).isEmpty();
	}

	@Test
	void createPricing_nonOwner_throwsAuthorizationDenied() {
		CompanyEntity company = CompanyEntity.builder().id(1L).companyType(CompanyType.TAXI).build();
		CompanyEntity other = CompanyEntity.builder().id(2L).companyType(CompanyType.TAXI).build();
		UserEntity nonOwner = UserEntity.builder()
				.email("other@test.com")
				.authorities(new HashSet<>(Set.of(Role.COMPANY_ADMIN.getAuthority())))
				.company(other)
				.build();

		when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
		when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(nonOwner));

		assertThatThrownBy(() -> pricingService.createPricing(1L, CompanyPricingRequestDTO.builder().build(), "other@test.com"))
				.isInstanceOf(AuthorizationDeniedException.class);
	}

	// ---- updatePricing ----

	@Test
	void updatePricing_success() {
		CompanyEntity company = CompanyEntity.builder().id(1L).companyType(CompanyType.TAXI).build();
		UserEntity admin = userWithRole("admin@test.com", Role.ADMIN);
		CompanyPricingEntity existing = CompanyPricingEntity.builder().id(7L).company(company).baseFare(2.50).build();
		CompanyPricingRequestDTO request = CompanyPricingRequestDTO.builder().baseFare(4.00).build();
		CompanyPricingResponseDTO dto = CompanyPricingResponseDTO.builder().id(7L).companyId(1L).baseFare(4.00).build();

		when(companyRepository.existsById(1L)).thenReturn(true);
		when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));
		when(pricingRepository.findByCompanyId(1L)).thenReturn(Optional.of(existing));
		when(pricingRepository.save(existing)).thenReturn(existing);
		when(pricingMapper.toDTO(existing)).thenReturn(dto);

		assertThat(pricingService.updatePricing(1L, request, "admin@test.com")).contains(dto);
		verify(pricingMapper).updateEntity(request, existing);
	}

	@Test
	void updatePricing_noRow_throwsNotFound() {
		UserEntity admin = userWithRole("admin@test.com", Role.ADMIN);

		when(companyRepository.existsById(1L)).thenReturn(true);
		when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));
		when(pricingRepository.findByCompanyId(1L)).thenReturn(Optional.empty());

		assertThatThrownBy(() -> pricingService.updatePricing(1L, CompanyPricingRequestDTO.builder().build(), "admin@test.com"))
				.isInstanceOf(PricingNotFoundException.class);
	}

	@Test
	void updatePricing_companyNotFound_returnsEmpty() {
		when(companyRepository.existsById(99L)).thenReturn(false);
		assertThat(pricingService.updatePricing(99L, CompanyPricingRequestDTO.builder().build(), "admin@test.com")).isEmpty();
	}

	@Test
	void updatePricing_nonOwner_throwsAuthorizationDenied() {
		CompanyEntity other = CompanyEntity.builder().id(2L).companyType(CompanyType.TAXI).build();
		UserEntity nonOwner = UserEntity.builder()
				.email("other@test.com")
				.authorities(new HashSet<>(Set.of(Role.COMPANY_ADMIN.getAuthority())))
				.company(other)
				.build();

		when(companyRepository.existsById(1L)).thenReturn(true);
		when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(nonOwner));

		assertThatThrownBy(() -> pricingService.updatePricing(1L, CompanyPricingRequestDTO.builder().build(), "other@test.com"))
				.isInstanceOf(AuthorizationDeniedException.class);
	}

	private UserEntity userWithRole(String email, Role role) {
		return UserEntity.builder()
				.email(email)
				.authorities(new HashSet<>(Set.of(role.getAuthority())))
				.build();
	}
}
