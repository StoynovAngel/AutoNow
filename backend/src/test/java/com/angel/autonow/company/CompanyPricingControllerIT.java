package com.angel.autonow.company;

import com.angel.autonow.data.TestData;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.user.role.Role;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class CompanyPricingControllerIT {

	@Autowired private MockMvc mockMvc;
	@Autowired private ObjectMapper objectMapper;
	@Autowired private CompanyRepository companyRepository;
	@Autowired private UserRepository userRepository;

	private CompanyEntity savedCompany(CompanyType type, String email) {
		return companyRepository.save(CompanyEntity.builder()
				.name("Test Co").address("1 St").phone("+359888500100")
				.email(email).companyType(type).build());
	}

	private UserEntity savedAdmin(String email) {
		return userRepository.save(UserEntity.builder()
				.email(email).password("encodedPassword")
				.authorities(new HashSet<>(Set.of(Role.ADMIN.getAuthority()))).build());
	}

	private UserEntity savedOwner(String email, CompanyEntity company) {
		return userRepository.save(UserEntity.builder()
				.email(email).password("encodedPassword")
				.authorities(new HashSet<>(Set.of(Role.COMPANY_ADMIN.getAuthority())))
				.company(company).build());
	}

	private static org.springframework.test.web.servlet.request.RequestPostProcessor adminJwt(String email) {
		return jwt().jwt(j -> j.subject(email))
				.authorities(new SimpleGrantedAuthority(Role.ADMIN.getAuthority()));
	}

	private static org.springframework.test.web.servlet.request.RequestPostProcessor companyAdminJwt(String email) {
		return jwt().jwt(j -> j.subject(email))
				.authorities(new SimpleGrantedAuthority(Role.COMPANY_ADMIN.getAuthority()));
	}

	// ---- GET returns defaults when no row configured ----

	@Test
	void getPricing_taxiNoRow_returnsGlobalDefaults() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi@co.com");

		mockMvc.perform(get("/api/companies/{id}/pricing", company.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.baseFare").value(2.50))
				.andExpect(jsonPath("$.ratePerKm").value(1.20))
				.andExpect(jsonPath("$.nightMultiplier").value(1.20))
				.andExpect(jsonPath("$.nightStartHour").value(22))
				.andExpect(jsonPath("$.nightEndHour").value(6));
	}

	@Test
	void getPricing_ambulanceNoRow_returnsGlobalDefaults() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.AMBULANCE, "amb@co.com");

		mockMvc.perform(get("/api/companies/{id}/pricing", company.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.ambulanceBaseFare").value(60.00))
				.andExpect(jsonPath("$.ratePerKm").value(1.20))
				.andExpect(jsonPath("$.nightStartHour").value(22))
				.andExpect(jsonPath("$.baseFare").doesNotExist());
	}

	@Test
	void getPricing_logisticsNoRow_returnsGlobalDefaults() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.LOGISTICS, "log@co.com");

		mockMvc.perform(get("/api/companies/{id}/pricing", company.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.logisticsBaseFare").value(5.00))
				.andExpect(jsonPath("$.logisticsRatePerKg").value(0.05));
	}

	// ---- POST creates ----

	@Test
	void createPricing_asAdmin_returnsCreated() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi2@co.com");
		savedAdmin("admin@test.com");

		var request = CompanyPricingRequestDTO.builder()
				.baseFare(3.00).ratePerKm(1.50).nightMultiplier(1.20).nightStartHour(22).nightEndHour(6).build();

		mockMvc.perform(post("/api/companies/{id}/pricing", company.getId())
						.with(adminJwt("admin@test.com"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.baseFare").value(3.00))
				.andExpect(jsonPath("$.ratePerKm").value(1.50));
	}

	@Test
	void createPricing_asCompanyOwner_returnsCreated() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi3@co.com");
		savedOwner("owner@test.com", company);

		var request = CompanyPricingRequestDTO.builder()
				.baseFare(2.80).ratePerKm(1.10).nightMultiplier(1.20).nightStartHour(22).nightEndHour(6).build();

		mockMvc.perform(post("/api/companies/{id}/pricing", company.getId())
						.with(companyAdminJwt("owner@test.com"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.baseFare").value(2.80));
	}

	@Test
	void createPricing_alreadyExists_returnsConflict() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi4@co.com");
		savedAdmin("admin@test.com");

		var request = CompanyPricingRequestDTO.builder()
				.baseFare(3.00).ratePerKm(1.50).nightMultiplier(1.20).nightStartHour(22).nightEndHour(6).build();

		mockMvc.perform(post("/api/companies/{id}/pricing", company.getId())
						.with(adminJwt("admin@test.com"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated());

		mockMvc.perform(post("/api/companies/{id}/pricing", company.getId())
						.with(adminJwt("admin@test.com"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isConflict());
	}

	@Test
	void createPricing_nonOwner_returnsForbidden() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi5@co.com");
		CompanyEntity other = savedCompany(CompanyType.TAXI, "taxi6@co.com");
		savedOwner("nonowner@test.com", other);

		var request = CompanyPricingRequestDTO.builder().baseFare(3.00).build();

		mockMvc.perform(post("/api/companies/{id}/pricing", company.getId())
						.with(companyAdminJwt("nonowner@test.com"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void createPricing_asCustomer_returnsForbidden() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi7@co.com");
		mockMvc.perform(post("/api/companies/{id}/pricing", company.getId())
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(CompanyPricingRequestDTO.builder().build())))
				.andExpect(status().isForbidden());
	}

	@Test
	void createPricing_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(post("/api/companies/{id}/pricing", 1L)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(CompanyPricingRequestDTO.builder().build())))
				.andExpect(status().isUnauthorized());
	}

	// ---- PUT updates ----

	@Test
	void updatePricing_asAdmin_returnsOk() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi8@co.com");
		savedAdmin("admin@test.com");

		var create = CompanyPricingRequestDTO.builder()
				.baseFare(3.00).ratePerKm(1.50).nightMultiplier(1.20).nightStartHour(22).nightEndHour(6).build();
		mockMvc.perform(post("/api/companies/{id}/pricing", company.getId())
						.with(adminJwt("admin@test.com"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(create)))
				.andExpect(status().isCreated());

		var update = CompanyPricingRequestDTO.builder()
				.baseFare(4.00).ratePerKm(1.80).nightMultiplier(1.30).nightStartHour(23).nightEndHour(5).build();

		mockMvc.perform(put("/api/companies/{id}/pricing", company.getId())
						.with(adminJwt("admin@test.com"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(update)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.baseFare").value(4.00))
				.andExpect(jsonPath("$.nightStartHour").value(23));
	}

	@Test
	void updatePricing_noRow_returnsNotFound() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi9@co.com");
		savedAdmin("admin@test.com");

		var request = CompanyPricingRequestDTO.builder().baseFare(4.00).build();

		mockMvc.perform(put("/api/companies/{id}/pricing", company.getId())
						.with(adminJwt("admin@test.com"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isNotFound());
	}

	@Test
	void updatePricing_nonOwner_returnsForbidden() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi10@co.com");
		CompanyEntity other = savedCompany(CompanyType.TAXI, "taxi11@co.com");
		savedOwner("nonowner2@test.com", other);

		var request = CompanyPricingRequestDTO.builder().baseFare(3.00).build();

		mockMvc.perform(put("/api/companies/{id}/pricing", company.getId())
						.with(companyAdminJwt("nonowner2@test.com"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void updatePricing_asCustomer_returnsForbidden() throws Exception {
		CompanyEntity company = savedCompany(CompanyType.TAXI, "taxi12@co.com");
		mockMvc.perform(put("/api/companies/{id}/pricing", company.getId())
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(CompanyPricingRequestDTO.builder().build())))
				.andExpect(status().isForbidden());
	}

	@Test
	void updatePricing_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(put("/api/companies/{id}/pricing", 1L)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(CompanyPricingRequestDTO.builder().build())))
				.andExpect(status().isUnauthorized());
	}

	// ---- GET auth ----

	@Test
	void getPricing_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/companies/{id}/pricing", 1L))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getPricing_asGuest_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/companies/{id}/pricing", 1L)
						.with(TestData.guestJwt()))
				.andExpect(status().isForbidden());
	}
}
