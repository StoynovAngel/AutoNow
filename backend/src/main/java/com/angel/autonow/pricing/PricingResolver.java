package com.angel.autonow.pricing;

import com.angel.autonow.company.CompanyPricingEntity;
import com.angel.autonow.company.CompanyPricingRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PricingResolver {

	private static final Logger log = LoggerFactory.getLogger(PricingResolver.class);

	private final PricingProperties defaults;
	private final CompanyPricingRepository companyPricingRepository;

	public ResolvedPricing resolve(Long companyId) {
		CompanyPricingEntity company = companyId == null ? null
				: companyPricingRepository.findByCompanyId(companyId).orElse(null);
		log.info("Pricing resolve: companyId={}, companyPricingFound={}", companyId, company != null);
		ResolvedPricing resolved = overlay(company);
		log.info("Pricing resolved: baseFare={}, ratePerKm={}, nightMultiplier={}, logisticsBaseFare={}",
				resolved.baseFare(), resolved.ratePerKm(), resolved.nightMultiplier(), resolved.logisticsBaseFare());
		return resolved;
	}

	public ResolvedPricing overlay(CompanyPricingEntity company) {
		if (company == null) {
			return new ResolvedPricing(
					defaults.baseFare(),
					defaults.ambulanceBaseFare(),
					defaults.ratePerKm(),
					defaults.nightMultiplier(),
					defaults.nightStartHour(),
					defaults.nightEndHour(),
					defaults.logisticsBaseFare(),
					defaults.logisticsRatePerKg()
			);
		}

		return new ResolvedPricing(
				pick(company.getBaseFare(), defaults.baseFare()),
				pick(company.getAmbulanceBaseFare(), defaults.ambulanceBaseFare()),
				pick(company.getRatePerKm(), defaults.ratePerKm()),
				pick(company.getNightMultiplier(), defaults.nightMultiplier()),
				pick(company.getNightStartHour(), defaults.nightStartHour()),
				pick(company.getNightEndHour(), defaults.nightEndHour()),
				pick(company.getLogisticsBaseFare(), defaults.logisticsBaseFare()),
				pick(company.getLogisticsRatePerKg(), defaults.logisticsRatePerKg())
		);
	}

	private double pick(Double companyValue, Double fallback) {
		return companyValue != null ? companyValue : fallback;
	}

	private int pick(Integer companyValue, Integer fallback) {
		return companyValue != null ? companyValue : fallback;
	}
}
