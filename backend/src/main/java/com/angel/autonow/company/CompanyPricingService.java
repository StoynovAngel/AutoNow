package com.angel.autonow.company;

import com.angel.autonow.pricing.PricingProperties;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.user.role.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CompanyPricingService {

	private final CompanyRepository companyRepository;
	private final UserRepository userRepository;
	private final PricingProperties pricingProperties;
	private final CompanyPricingRepository pricingRepository;
	private final CompanyPricingMapper pricingMapper;

	public Optional<CompanyPricingResponseDTO> getPricing(Long companyId) {
		return companyRepository.findById(companyId).map(company ->
				pricingRepository.findByCompanyId(companyId)
						.map(pricingMapper::toDTO)
						.orElseGet(() -> defaultsFor(company))
		);
	}

	@Transactional
	public Optional<CompanyPricingResponseDTO> createPricing(Long companyId, CompanyPricingRequestDTO dto, String userEmail) {
		Optional<CompanyEntity> companyOpt = companyRepository.findById(companyId);
		if (companyOpt.isEmpty()) return Optional.empty();

		requireAuthorized(companyId, userEmail);

		if (pricingRepository.findByCompanyId(companyId).isPresent()) {
			throw new PricingAlreadyExistsException(companyId);
		}

		CompanyPricingEntity created = pricingMapper.toEntity(dto);
		created.setCompany(companyOpt.get());
		return Optional.of(pricingMapper.toDTO(pricingRepository.save(created)));
	}

	@Transactional
	public Optional<CompanyPricingResponseDTO> updatePricing(Long companyId, CompanyPricingRequestDTO dto, String userEmail) {
		if (!companyRepository.existsById(companyId)) return Optional.empty();

		requireAuthorized(companyId, userEmail);

		CompanyPricingEntity existing = pricingRepository.findByCompanyId(companyId)
				.orElseThrow(() -> new PricingNotFoundException(companyId));

		pricingMapper.updateEntity(dto, existing);
		return Optional.of(pricingMapper.toDTO(pricingRepository.save(existing)));
	}

	private void requireAuthorized(Long companyId, String userEmail) {
		UserEntity user = userRepository.findByEmail(userEmail)
				.orElseThrow(() -> new AuthorizationDeniedException("User not found"));

		boolean isAdmin = user.getAuthorities().contains(Role.ADMIN.getAuthority());
		boolean isOwner = user.getCompany() != null && user.getCompany().getId().equals(companyId);
		if (!isAdmin && !isOwner) {
			throw new AuthorizationDeniedException("Not authorized to modify pricing for company " + companyId);
		}
	}

	private CompanyPricingResponseDTO defaultsFor(CompanyEntity company) {
		CompanyPricingResponseDTO.CompanyPricingResponseDTOBuilder b = CompanyPricingResponseDTO.builder()
				.companyId(company.getId());
		switch (company.getCompanyType()) {
			case TAXI -> b
					.baseFare(pricingProperties.baseFare())
					.ratePerKm(pricingProperties.ratePerKm())
					.nightMultiplier(pricingProperties.nightMultiplier())
					.nightStartHour(pricingProperties.nightStartHour())
					.nightEndHour(pricingProperties.nightEndHour());
			case AMBULANCE -> b
					.ambulanceBaseFare(pricingProperties.ambulanceBaseFare())
					.ratePerKm(pricingProperties.ratePerKm())
					.nightMultiplier(pricingProperties.nightMultiplier())
					.nightStartHour(pricingProperties.nightStartHour())
					.nightEndHour(pricingProperties.nightEndHour());
			case LOGISTICS -> b
					.logisticsBaseFare(pricingProperties.logisticsBaseFare())
					.logisticsRatePerKg(pricingProperties.logisticsRatePerKg());
			default -> { }
		}
		return b.build();
	}
}
