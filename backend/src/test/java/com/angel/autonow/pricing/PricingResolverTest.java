package com.angel.autonow.pricing;

import com.angel.autonow.company.CompanyPricingEntity;
import com.angel.autonow.company.CompanyPricingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class PricingResolverTest {

	private static final PricingProperties DEFAULTS = new PricingProperties(
			2.50,   // baseFare
			60.00,  // ambulanceBaseFare
			1.20,   // ratePerKm
			1.20,   // nightMultiplier
			22,     // nightStartHour
			6,      // nightEndHour
			"Europe/Sofia",
			"EUR",
			5.00,   // logisticsBaseFare
			0.05,   // logisticsRatePerKg
			45.00   // rentalRatePerDay
	);

	private CompanyPricingRepository repository;
	private PricingResolver resolver;

	@BeforeEach
	void setUp() {
		repository = mock(CompanyPricingRepository.class);
		resolver = new PricingResolver(DEFAULTS, repository);
	}

	@Test
	void resolve_nullCompanyId_returnsDefaults() {
		ResolvedPricing pricing = resolver.resolve(null);

		assertDefaults(pricing);
	}

	@Test
	void resolve_companyWithoutPricing_returnsDefaults() {
		when(repository.findByCompanyId(7L)).thenReturn(Optional.empty());

		ResolvedPricing pricing = resolver.resolve(7L);

		assertDefaults(pricing);
	}

	@Test
	void resolve_companyWithFullPricing_overridesAllFields() {
		CompanyPricingEntity company = CompanyPricingEntity.builder()
				.baseFare(9.0)
				.ambulanceBaseFare(90.0)
				.ratePerKm(3.0)
				.nightMultiplier(2.0)
				.nightStartHour(20)
				.nightEndHour(5)
				.logisticsBaseFare(11.0)
				.logisticsRatePerKg(0.5)
				.build();
		when(repository.findByCompanyId(1L)).thenReturn(Optional.of(company));

		ResolvedPricing pricing = resolver.resolve(1L);

		assertEquals(9.0, pricing.baseFare(), 0.001);
		assertEquals(90.0, pricing.ambulanceBaseFare(), 0.001);
		assertEquals(3.0, pricing.ratePerKm(), 0.001);
		assertEquals(2.0, pricing.nightMultiplier(), 0.001);
		assertEquals(20, pricing.nightStartHour());
		assertEquals(5, pricing.nightEndHour());
		assertEquals(11.0, pricing.logisticsBaseFare(), 0.001);
		assertEquals(0.5, pricing.logisticsRatePerKg(), 0.001);
	}

	@Test
	void resolve_companyWithPartialPricing_fallsBackPerField() {
		CompanyPricingEntity company = CompanyPricingEntity.builder()
				.baseFare(9.0)
				.ratePerKm(3.0)
				.build();
		when(repository.findByCompanyId(2L)).thenReturn(Optional.of(company));

		ResolvedPricing pricing = resolver.resolve(2L);

		assertEquals(9.0, pricing.baseFare(), 0.001);
		assertEquals(3.0, pricing.ratePerKm(), 0.001);
		// unset fields fall back to defaults
		assertEquals(60.00, pricing.ambulanceBaseFare(), 0.001);
		assertEquals(1.20, pricing.nightMultiplier(), 0.001);
		assertEquals(22, pricing.nightStartHour());
		assertEquals(6, pricing.nightEndHour());
		assertEquals(5.00, pricing.logisticsBaseFare(), 0.001);
		assertEquals(0.05, pricing.logisticsRatePerKg(), 0.001);
	}

	private void assertDefaults(ResolvedPricing pricing) {
		assertEquals(2.50, pricing.baseFare(), 0.001);
		assertEquals(60.00, pricing.ambulanceBaseFare(), 0.001);
		assertEquals(1.20, pricing.ratePerKm(), 0.001);
		assertEquals(1.20, pricing.nightMultiplier(), 0.001);
		assertEquals(22, pricing.nightStartHour());
		assertEquals(6, pricing.nightEndHour());
		assertEquals(5.00, pricing.logisticsBaseFare(), 0.001);
		assertEquals(0.05, pricing.logisticsRatePerKg(), 0.001);
	}
}
