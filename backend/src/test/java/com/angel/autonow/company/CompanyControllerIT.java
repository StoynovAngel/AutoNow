package com.angel.autonow.company;

import com.angel.autonow.data.TestData;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class CompanyControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private CompanyRepository companyRepository;

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
	void getAllCompanies_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/companies")
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
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

		var updateRequest = CompanyRequestDTO.builder()
				.name("Updated Fleet")
				.address("456 New St")
				.phone("+9876543210")
				.email("updated@fleet.com")
				.companyType(CompanyType.LOGISTICS)
				.build();

		mockMvc.perform(put("/api/companies/{id}", company.getId())
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Updated Fleet"))
				.andExpect(jsonPath("$.companyType").value("LOGISTICS"));
	}

	@Test
	void updateCompany_asCompanyAdmin() throws Exception {
		var company = TestData.createCompanyEntity();
		companyRepository.save(company);

		var updateRequest = TestData.createCompanyRequest();

		mockMvc.perform(put("/api/companies/{id}", company.getId())
						.with(TestData.companyAdminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk());
	}

	@Test
	void updateCompany_notFound_returnsBadRequest() throws Exception {
		var updateRequest = TestData.createCompanyRequest();

		mockMvc.perform(put("/api/companies/{id}", NON_EXISTENT_ID)
						.with(TestData.adminJwt())
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
