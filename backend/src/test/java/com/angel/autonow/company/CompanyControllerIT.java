package com.angel.autonow.company;

import com.angel.autonow.data.TestData;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.user.role.Role;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class CompanyControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private CompanyRepository companyRepository;

	@Autowired
	private UserRepository userRepository;

	@Test
	void createCompany_asAdmin() throws Exception {
		var request = TestData.createCompanyRequest();

		mockMvc.perform(post("/api/companies")
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.name").value("Test Fleet Co"))
				.andExpect(jsonPath("$.email").value("test@fleet.com"))
				.andExpect(jsonPath("$.companyType").value("TAXI"));
	}

	@Test
	void createCompany_asCustomer() throws Exception {
		var request = TestData.createCompanyRequest();

		mockMvc.perform(post("/api/companies")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated());
	}

	@Test
	void createCompany_invalidInput_returnsBadRequest() throws Exception {
		var invalidRequest = CompanyRequestDTO.builder().build();

		mockMvc.perform(post("/api/companies")
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createCompany_asGuest_returnsForbidden() throws Exception {
		var request = TestData.createCompanyRequest();

		mockMvc.perform(post("/api/companies")
						.with(TestData.guestJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void createCompany_withoutAuth_returnsUnauthorized() throws Exception {
		var request = TestData.createCompanyRequest();

		mockMvc.perform(post("/api/companies")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void joinCompany_companyNotFound_returnsBadRequest() throws Exception {
		mockMvc.perform(post("/api/companies/{id}/join", NON_EXISTENT_ID)
						.with(TestData.customerJwt()))
				.andExpect(status().isBadRequest());
	}

	@Test
	void joinCompany_asGuest_returnsForbidden() throws Exception {
		mockMvc.perform(post("/api/companies/{id}/join", 1L)
						.with(TestData.guestJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void joinCompany_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(post("/api/companies/{id}/join", 1L))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getAllCompanyByCompanyType_multipleCompanies() throws Exception {
		var company = TestData.createCompanyEntity();
		var company2 = TestData.createAnotherCompanyEntity();
		companyRepository.save(company);
		companyRepository.save(company2);

		mockMvc.perform(get("/api/companies/type/{companyType}", company.getCompanyType())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(2))
				.andExpect(jsonPath("$[0].name").value("Test Fleet Co"))
				.andExpect(jsonPath("$[0].companyType").value("TAXI"))
				.andExpect(jsonPath("$[1].name").value("Test Fleet Co 2"))
				.andExpect(jsonPath("$[1].companyType").value("TAXI"));
	}

	@Test
	void getAllCompanyByCompanyType_singleCompany() throws Exception {
		var company = CompanyEntity.builder()
				.name("Logistics Fleet")
				.address("456 Warehouse Ave")
				.phone("+1234567891")
				.email("logistics@fleet.com")
				.companyType(CompanyType.LOGISTICS)
				.build();
		companyRepository.save(company);

		mockMvc.perform(get("/api/companies/type/{companyType}", CompanyType.LOGISTICS)
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].name").value("Logistics Fleet"))
				.andExpect(jsonPath("$[0].companyType").value("LOGISTICS"));
	}

	@Test
	void getAllCompanyByCompanyType_emptyList() throws Exception {
		var taxiCompany = TestData.createCompanyEntity();
		companyRepository.save(taxiCompany);

		mockMvc.perform(get("/api/companies/type/{companyType}", CompanyType.AMBULANCE)
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(0))
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getAllCompanyByCompanyType_filterCorrectly() throws Exception {
		var taxi1 = CompanyEntity.builder()
				.name("Taxi Co 1")
				.address("123 Taxi St")
				.phone("+1111111111")
				.email("taxi1@test.com")
				.companyType(CompanyType.TAXI)
				.build();
		var taxi2 = CompanyEntity.builder()
				.name("Taxi Co 2")
				.address("456 Taxi Ave")
				.phone("+2222222222")
				.email("taxi2@test.com")
				.companyType(CompanyType.TAXI)
				.build();
		var ambulance = CompanyEntity.builder()
				.name("Ambulance Co")
				.address("789 Hospital Rd")
				.phone("+3333333333")
				.email("ambulance@test.com")
				.companyType(CompanyType.AMBULANCE)
				.build();
		var rental = CompanyEntity.builder()
				.name("Rental Co")
				.address("321 Rental Blvd")
				.phone("+4444444444")
				.email("rental@test.com")
				.companyType(CompanyType.RENTAL)
				.build();

		companyRepository.save(taxi1);
		companyRepository.save(taxi2);
		companyRepository.save(ambulance);
		companyRepository.save(rental);

		mockMvc.perform(get("/api/companies/type/{companyType}", CompanyType.TAXI)
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(2))
				.andExpect(jsonPath("$[0].companyType").value("TAXI"))
				.andExpect(jsonPath("$[1].companyType").value("TAXI"));
	}

	@Test
	void getAllCompanyByCompanyType_caseInsensitive() throws Exception {
		var company = TestData.createCompanyEntity();
		companyRepository.save(company);

		mockMvc.perform(get("/api/companies/type/{companyType}", "taxi")
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].companyType").value("TAXI"));
	}

	@Test
	void getAllCompanyByCompanyType_invalidType_returnsBadRequest() throws Exception {
		mockMvc.perform(get("/api/companies/type/{companyType}", "INVALID_TYPE")
						.with(TestData.customerJwt()))
				.andExpect(status().isBadRequest());
	}

	@Test
	void getAllCompanyByCompanyType_asGuest_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/companies/type/{companyType}", CompanyType.TAXI)
						.with(TestData.guestJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void getAllCompanyByCompanyType_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/companies/type/{companyType}", CompanyType.TAXI))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getAllCompanyByCompanyType_asAdmin() throws Exception {
		var company = TestData.createCompanyEntity();
		companyRepository.save(company);

		mockMvc.perform(get("/api/companies/type/{companyType}", CompanyType.TAXI)
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getCompanyById() throws Exception {
		var company = TestData.createCompanyEntity();
		companyRepository.save(company);

		mockMvc.perform(get("/api/companies/{id}", company.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Test Fleet Co"));
	}

	@Test
	void getCompanyById_notFound_returnsOkEmpty() throws Exception {
		mockMvc.perform(get("/api/companies/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(content().string(""));
	}

	@Test
	void getCompanyById_asGuest_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/companies/{id}", 1L)
						.with(TestData.guestJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void getAllCompanies_asAdmin() throws Exception {
		var company = TestData.createCompanyEntity();
		companyRepository.save(company);

		mockMvc.perform(get("/api/companies")
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getAllCompanies_noEntries_returnsEmptyList() throws Exception {
		mockMvc.perform(get("/api/companies")
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getAllCompanies_asCustomer_returnsOk() throws Exception {
		mockMvc.perform(get("/api/companies")
						.with(TestData.customerJwt()))
				.andExpect(status().isOk());
	}

	@Test
	void getAllCompanies_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/companies"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void updateCompany_asAdmin() throws Exception {
		var company = TestData.createCompanyEntity();
		companyRepository.save(company);

		var admin = UserEntity.builder()
				.email("admin@test.com")
				.password("encodedPassword")
				.authorities(new HashSet<>(Set.of(Role.ADMIN.getAuthority())))
				.build();
		userRepository.save(admin);

		var updateRequest = CompanyRequestDTO.builder()
				.name("Updated Fleet")
				.address("456 New St")
				.phone("+9876543210")
				.email("updated@fleet.com")
				.companyType(CompanyType.LOGISTICS)
				.build();

		mockMvc.perform(put("/api/companies/{id}", company.getId())
						.with(jwt().jwt(j -> j.subject("admin@test.com"))
								.authorities(new SimpleGrantedAuthority(Role.ADMIN.getAuthority())))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Updated Fleet"))
				.andExpect(jsonPath("$.companyType").value("LOGISTICS"));
	}

	@Test
	void updateCompany_asCompanyAdmin_owner() throws Exception {
		var company = TestData.createCompanyEntity();
		companyRepository.save(company);

		var owner = UserEntity.builder()
				.email("owner@test.com")
				.password("encodedPassword")
				.authorities(new HashSet<>(Set.of(Role.COMPANY_ADMIN.getAuthority())))
				.company(company)
				.build();
		userRepository.save(owner);

		var updateRequest = TestData.createCompanyRequest();

		mockMvc.perform(put("/api/companies/{id}", company.getId())
						.with(jwt().jwt(j -> j.subject("owner@test.com"))
								.authorities(new SimpleGrantedAuthority(Role.COMPANY_ADMIN.getAuthority())))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk());
	}

	@Test
	void updateCompany_asCompanyAdmin_notOwner_returnsBadRequest() throws Exception {
		var company = TestData.createCompanyEntity();
		companyRepository.save(company);

		var otherCompany = CompanyEntity.builder()
				.name("Other Co")
				.address("Other St")
				.phone("+1111111111")
				.email("other@co.com")
				.companyType(CompanyType.LOGISTICS)
				.build();
		companyRepository.save(otherCompany);

		var nonOwner = UserEntity.builder()
				.email("nonowner@test.com")
				.password("encodedPassword")
				.authorities(new HashSet<>(Set.of(Role.COMPANY_ADMIN.getAuthority())))
				.company(otherCompany)
				.build();
		userRepository.save(nonOwner);

		var updateRequest = TestData.createCompanyRequest();

		mockMvc.perform(put("/api/companies/{id}", company.getId())
						.with(jwt().jwt(j -> j.subject("nonowner@test.com"))
								.authorities(new SimpleGrantedAuthority(Role.COMPANY_ADMIN.getAuthority())))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateCompany_notFound_returnsBadRequest() throws Exception {
		var admin = UserEntity.builder()
				.email("admin@test.com")
				.password("encodedPassword")
				.authorities(new HashSet<>(Set.of(Role.ADMIN.getAuthority())))
				.build();
		userRepository.save(admin);

		var updateRequest = TestData.createCompanyRequest();

		mockMvc.perform(put("/api/companies/{id}", NON_EXISTENT_ID)
						.with(jwt().jwt(j -> j.subject("admin@test.com"))
								.authorities(new SimpleGrantedAuthority(Role.ADMIN.getAuthority())))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateCompany_asCustomer_returnsForbidden() throws Exception {
		var updateRequest = TestData.createCompanyRequest();

		mockMvc.perform(put("/api/companies/{id}", 1L)
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isForbidden());
	}

	@Test
	void updateCompany_withoutAuth_returnsUnauthorized() throws Exception {
		var updateRequest = TestData.createCompanyRequest();

		mockMvc.perform(put("/api/companies/{id}", 1L)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void deleteCompany_asAdmin() throws Exception {
		var company = TestData.createCompanyEntity();
		companyRepository.save(company);
		mockMvc.perform(delete("/api/companies/{id}", company.getId()).with(TestData.adminJwt())).andExpect(status().isNoContent());
	}

	@Test
	void deleteCompany_notFound_returnsBadRequest() throws Exception {
		mockMvc.perform(delete("/api/companies/{id}", NON_EXISTENT_ID).with(TestData.adminJwt())).andExpect(status().isBadRequest());
	}

	@Test
	void deleteCompany_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(delete("/api/companies/{id}", 1L).with(TestData.customerJwt())).andExpect(status().isForbidden());
	}

	@Test
	void deleteCompany_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(delete("/api/companies/{id}", 1L)).andExpect(status().isUnauthorized());
	}
}
