package com.angel.autonow.driver;

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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class DriverControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private DriverRepository driverRepository;

	@Test
	void createDriver_asAdmin() throws Exception {
		var request = TestData.createDriverRequest();

		mockMvc.perform(post("/api/drivers")
						.with(TestData.adminJwt())
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
		var invalidRequest = new DriverRequestDTO(null, null, null, null, null, false, null);

		mockMvc.perform(post("/api/drivers")
						.with(TestData.adminJwt())
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
						.with(TestData.adminJwt()))
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
}
