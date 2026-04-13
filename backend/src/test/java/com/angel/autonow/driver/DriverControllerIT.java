package com.angel.autonow.driver;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.company.CompanyType;
import com.angel.autonow.data.TestData;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.user.role.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.util.HashSet;
import java.util.Set;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class DriverControllerIT {

	private static final String ADMIN_EMAIL = "admin@test.com";

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private DriverRepository driverRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private CompanyRepository companyRepository;

	@BeforeEach
	void setUp() {
		var admin = UserEntity.builder()
				.email(ADMIN_EMAIL)
				.password("encodedPassword")
				.authorities(new HashSet<>(Set.of(Role.ADMIN.getAuthority())))
				.build();
		userRepository.save(admin);
	}

	@Test
	void createDriver_asAdmin() throws Exception {
		var request = TestData.createDriverRequest();

		mockMvc.perform(post("/api/drivers")
						.with(TestData.adminJwt(ADMIN_EMAIL))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.firstName").value("Michael"))
				.andExpect(jsonPath("$.lastName").value("Johnson"))
				.andExpect(jsonPath("$.licenseNumber").value("DL-TEST-001"))
				.andExpect(jsonPath("$.expertiseType").value("B"));
	}

	@Test
	void createDriver_asCustomer_returnsForbidden() throws Exception {
		var request = TestData.createDriverRequest();

		mockMvc.perform(post("/api/drivers")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void createDriver_invalidInput_returnsBadRequest() throws Exception {
		var invalidRequest = DriverRequestDTO.builder().build();

		mockMvc.perform(post("/api/drivers")
						.with(TestData.adminJwt(ADMIN_EMAIL))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createDriver_withoutAuth_returnsUnauthorized() throws Exception {
		var request = TestData.createDriverRequest();

		mockMvc.perform(post("/api/drivers")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getDriverById() throws Exception {
		var driver = TestData.createDriverEntity();
		driverRepository.save(driver);

		mockMvc.perform(get("/api/drivers/{id}", driver.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value("Michael"));
	}

	@Test
	void getDriverById_notFound_returnsOkEmpty() throws Exception {
		mockMvc.perform(get("/api/drivers/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(content().string(""));
	}

	@Test
	void getDriverByLicenseNumber() throws Exception {
		var driver = TestData.createDriverEntity();
		driverRepository.save(driver);

		mockMvc.perform(get("/api/drivers/license/{licenseNumber}", "DL-TEST-001")
						.with(TestData.adminJwt(ADMIN_EMAIL)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.licenseNumber").value("DL-TEST-001"));
	}

	@Test
	void getDriverByLicenseNumber_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/drivers/license/{licenseNumber}", "DL-TEST-001")
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void getAllDrivers() throws Exception {
		var driver = TestData.createDriverEntity();
		driverRepository.save(driver);

		mockMvc.perform(get("/api/drivers")
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getAllDrivers_noEntries_returnsEmptyList() throws Exception {
		mockMvc.perform(get("/api/drivers")
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getAllDrivers_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/drivers"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void updateDriver_asAdmin() throws Exception {
		var driver = TestData.createDriverEntity();
		driverRepository.save(driver);

		var updateRequest = DriverRequestDTO.builder()
				.firstName("Jane")
				.lastName("Smith")
				.phoneNumber("+9876543210")
				.licenseNumber("DL-UPD-001")
				.expertiseType(ExpertiseType.C)
				.available(false)
				.build();

		mockMvc.perform(put("/api/drivers/{id}", driver.getId())
						.with(TestData.adminJwt(ADMIN_EMAIL))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value("Jane"))
				.andExpect(jsonPath("$.lastName").value("Smith"))
				.andExpect(jsonPath("$.licenseNumber").value("DL-UPD-001"))
				.andExpect(jsonPath("$.expertiseType").value("C"));
	}

	@Test
	void updateDriver_notFound_returnsBadRequest() throws Exception {
		var updateRequest = TestData.createDriverRequest();

		mockMvc.perform(put("/api/drivers/{id}", NON_EXISTENT_ID)
						.with(TestData.adminJwt(ADMIN_EMAIL))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateDriver_invalidInput_returnsBadRequest() throws Exception {
		var driver = TestData.createDriverEntity();
		driverRepository.save(driver);

		var invalidRequest = DriverRequestDTO.builder().build();

		mockMvc.perform(put("/api/drivers/{id}", driver.getId())
						.with(TestData.adminJwt(ADMIN_EMAIL))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateDriver_asCustomer_returnsForbidden() throws Exception {
		var updateRequest = TestData.createDriverRequest();

		mockMvc.perform(put("/api/drivers/{id}", 1L)
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isForbidden());
	}

	@Test
	void updateDriver_withoutAuth_returnsUnauthorized() throws Exception {
		var updateRequest = TestData.createDriverRequest();

		mockMvc.perform(put("/api/drivers/{id}", 1L)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getDriversByCompanyId_asAdmin() throws Exception {
		var company = companyRepository.save(CompanyEntity.builder()
				.name("Fleet Co").address("123 St").phone("+1234567890")
				.email("fleet@co.com").companyType(CompanyType.TAXI).build());

		var driver = TestData.createDriverEntity();
		driver.setCompany(company);
		driverRepository.save(driver);

		mockMvc.perform(get("/api/drivers/company/{companyId}", company.getId())
						.with(TestData.adminJwt(ADMIN_EMAIL)))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].firstName").value("Michael"));
	}

	@Test
	void getDriversByCompanyId_noDrivers_returnsEmptyList() throws Exception {
		mockMvc.perform(get("/api/drivers/company/{companyId}", NON_EXISTENT_ID)
						.with(TestData.adminJwt(ADMIN_EMAIL)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getDriversByCompanyId_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/drivers/company/{companyId}", 1L).with(TestData.customerJwt())).andExpect(status().isForbidden());
	}

	@Test
	void getDriversByCompanyId_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/drivers/company/{companyId}", 1L)).andExpect(status().isUnauthorized());
	}

	@Test
	void deleteDriver_asAdmin() throws Exception {
		var driver = TestData.createDriverEntity();
		driverRepository.save(driver);

		mockMvc.perform(delete("/api/drivers/{id}", driver.getId()).with(TestData.adminJwt(ADMIN_EMAIL))).andExpect(status().isNoContent());
	}

	@Test
	void deleteDriver_notFound_returnsBadRequest() throws Exception {
		mockMvc.perform(delete("/api/drivers/{id}", NON_EXISTENT_ID).with(TestData.adminJwt(ADMIN_EMAIL))).andExpect(status().isBadRequest());
	}

	@Test
	void deleteDriver_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(delete("/api/drivers/{id}", 1L).with(TestData.customerJwt())).andExpect(status().isForbidden());
	}

	@Test
	void deleteDriver_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(delete("/api/drivers/{id}", 1L)).andExpect(status().isUnauthorized());
	}
}
