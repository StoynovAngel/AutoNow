package com.angel.autonow.vehicle;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.company.CompanyType;
import com.angel.autonow.data.TestData;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.expertise.ExpertiseType;
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

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class VehicleControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private VehicleRepository vehicleRepository;

	@Autowired
	private CompanyRepository companyRepository;

	@Autowired
	private DriverRepository driverRepository;

	@Test
	void createVehicle_asAdmin() throws Exception {
		var request = TestData.createVehicleRequest();

		mockMvc.perform(post("/api/vehicles")
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.brand").value("Toyota"))
				.andExpect(jsonPath("$.model").value("Camry"))
				.andExpect(jsonPath("$.licensePlate").value("CB1234AB"))
				.andExpect(jsonPath("$.vehicleType").value("TAXI"))
				.andExpect(jsonPath("$.vehicleClasses").isArray())
				.andExpect(jsonPath("$.vehicleClasses[0]").value("STANDARD"));
	}

	@Test
	void createVehicle_xlSeating_returnsXlAndStandard() throws Exception {
		var request = VehicleRequestDTO.builder()
				.brand("Mercedes")
				.model("V-Class")
				.licensePlate("CB7777AC")
				.airConditioning(true)
				.numberOfSeats(7)
				.trunkCapacity(900.0)
				.vehicleType(VehicleType.TAXI)
				.build();

		mockMvc.perform(post("/api/vehicles")
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.vehicleClasses", org.hamcrest.Matchers.containsInAnyOrder("XL", "STANDARD")));
	}

	@Test
	void createVehicle_asCustomer_returnsForbidden() throws Exception {
		var request = TestData.createVehicleRequest();

		mockMvc.perform(post("/api/vehicles")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void createVehicle_invalidInput_returnsBadRequest() throws Exception {
		var invalidRequest = VehicleRequestDTO.builder().build();

		mockMvc.perform(post("/api/vehicles")
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createVehicle_withoutAuth_returnsUnauthorized() throws Exception {
		var request = TestData.createVehicleRequest();

		mockMvc.perform(post("/api/vehicles")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getVehicleById() throws Exception {
		var vehicle = TestData.createVehicleEntity();
		vehicleRepository.save(vehicle);

		mockMvc.perform(get("/api/vehicles/{id}", vehicle.getId())
						.with(TestData.guestJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.brand").value("Toyota"));
	}

	@Test
	void getVehicleById_notFound_returnsOkEmpty() throws Exception {
		mockMvc.perform(get("/api/vehicles/{id}", NON_EXISTENT_ID)
						.with(TestData.guestJwt()))
				.andExpect(status().isOk())
				.andExpect(content().string(""));
	}

	@Test
	void getAllVehicles() throws Exception {
		var vehicle = TestData.createVehicleEntity();
		vehicleRepository.save(vehicle);

		mockMvc.perform(get("/api/vehicles")
						.with(TestData.guestJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getAllVehicles_noEntries_returnsEmptyList() throws Exception {
		mockMvc.perform(get("/api/vehicles")
						.with(TestData.guestJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getAllVehicles_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/vehicles"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void updateVehicle_asAdmin() throws Exception {
		var vehicle = TestData.createVehicleEntity();
		vehicleRepository.save(vehicle);

		var updateRequest = VehicleRequestDTO.builder()
				.brand("Honda")
				.model("Civic")
				.licensePlate("CB9876BA")
				.airConditioning(false)
				.numberOfSeats(4)
				.trunkCapacity(380.0)
				.vehicleType(VehicleType.TAXI)
				.build();

		mockMvc.perform(put("/api/vehicles/{id}", vehicle.getId())
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.brand").value("Honda"))
				.andExpect(jsonPath("$.model").value("Civic"))
				.andExpect(jsonPath("$.licensePlate").value("CB9876BA"))
				.andExpect(jsonPath("$.numberOfSeats").value(4));
	}

	@Test
	void updateVehicle_notFound_returnsBadRequest() throws Exception {
		var updateRequest = TestData.createVehicleRequest();

		mockMvc.perform(put("/api/vehicles/{id}", NON_EXISTENT_ID)
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateVehicle_invalidInput_returnsBadRequest() throws Exception {
		var vehicle = TestData.createVehicleEntity();
		vehicleRepository.save(vehicle);

		var invalidRequest = VehicleRequestDTO.builder().build();

		mockMvc.perform(put("/api/vehicles/{id}", vehicle.getId())
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateVehicle_asCustomer_returnsForbidden() throws Exception {
		var updateRequest = TestData.createVehicleRequest();

		mockMvc.perform(put("/api/vehicles/{id}", 1L)
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isForbidden());
	}

	@Test
	void updateVehicle_withoutAuth_returnsUnauthorized() throws Exception {
		var updateRequest = TestData.createVehicleRequest();

		mockMvc.perform(put("/api/vehicles/{id}", 1L)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getVehiclesByCompanyId_asAdmin() throws Exception {
		var company = companyRepository.save(CompanyEntity.builder()
				.name("Fleet Co").address("123 St").phone("+359888500100")
				.email("fleet@co.com").companyType(CompanyType.TAXI).build());

		var vehicle = TestData.createVehicleEntity();
		vehicle.setCompany(company);
		vehicleRepository.save(vehicle);

		mockMvc.perform(get("/api/vehicles/company/{companyId}", company.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].brand").value("Toyota"));
	}

	@Test
	void getVehiclesByCompanyId_noVehicles_returnsEmptyList() throws Exception {
		mockMvc.perform(get("/api/vehicles/company/{companyId}", NON_EXISTENT_ID)
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getVehiclesByCompanyId_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/vehicles/company/{companyId}", 1L)
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void getVehiclesByCompanyId_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/vehicles/company/{companyId}", 1L))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void deleteVehicle_asAdmin() throws Exception {
		var vehicle = TestData.createVehicleEntity();
		vehicleRepository.save(vehicle);
		mockMvc.perform(delete("/api/vehicles/{id}", vehicle.getId()).with(TestData.adminJwt())).andExpect(status().isNoContent());
	}

	@Test
	void deleteVehicle_notFound_returnsBadRequest() throws Exception {
		mockMvc.perform(delete("/api/vehicles/{id}", NON_EXISTENT_ID).with(TestData.adminJwt())).andExpect(status().isBadRequest());
	}

	@Test
	void deleteVehicle_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(delete("/api/vehicles/{id}", 1L).with(TestData.customerJwt())).andExpect(status().isForbidden());
	}

	@Test
	void deleteVehicle_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(delete("/api/vehicles/{id}", 1L)).andExpect(status().isUnauthorized());
	}

	@Test
	void getPublicVehiclesByCompanyId_asGuest_filtersByPromAndIncludesDriverPhone() throws Exception {
		var company = companyRepository.save(CompanyEntity.builder()
				.name("Prom Co").address("1 Ball St").phone("+359888500200")
				.email("prom@co.com").companyType(CompanyType.PROM).build());

		var promVehicle = VehicleEntity.builder()
				.brand("Mercedes").model("E-Class")
				.licensePlate("CB1234AA").airConditioning(true).numberOfSeats(4)
				.trunkCapacity(450.0).vehicleType(VehicleType.PROM).company(company).build();
		vehicleRepository.save(promVehicle);

		var taxiVehicle = VehicleEntity.builder()
				.brand("Toyota").model("Camry")
				.licensePlate("CB9999BB").airConditioning(true).numberOfSeats(5)
				.trunkCapacity(450.0).vehicleType(VehicleType.TAXI).company(company).build();
		vehicleRepository.save(taxiVehicle);

		var driver = DriverEntity.builder()
				.firstName("Ivan").lastName("Petrov")
				.phoneNumber("+359888111222")
				.expertiseType(java.util.Set.of(ExpertiseType.B))
				.available(true).company(company)
				.vehicles(new java.util.HashSet<>(java.util.Set.of(promVehicle)))
				.build();
		driverRepository.save(driver);

		mockMvc.perform(get("/api/vehicles/public/company/{companyId}", company.getId())
						.param("vehicleType", "PROM")
						.with(TestData.guestJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1))
				.andExpect(jsonPath("$[0].brand").value("Mercedes"))
				.andExpect(jsonPath("$[0].vehicleType").value("PROM"))
				.andExpect(jsonPath("$[0].driverPhoneNumber").value("+359888111222"));
	}

	@Test
	void getPublicVehiclesByCompanyId_asCustomer_returnsOk() throws Exception {
		var company = companyRepository.save(CompanyEntity.builder()
				.name("Prom Co 2").address("2 Ball St").phone("+359888500201")
				.email("prom2@co.com").companyType(CompanyType.PROM).build());

		mockMvc.perform(get("/api/vehicles/public/company/{companyId}", company.getId())
						.param("vehicleType", "PROM")
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getPublicVehiclesByCompanyId_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/vehicles/public/company/{companyId}", 1L))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getPublicVehiclesByCompanyId_noTypeFilter_returnsAllForCompany() throws Exception {
		var company = companyRepository.save(CompanyEntity.builder()
				.name("Mixed Co").address("3 Mix St").phone("+359888500202")
				.email("mix@co.com").companyType(CompanyType.TAXI).build());

		var prom = VehicleEntity.builder()
				.brand("BMW").model("7").licensePlate("CB2222CC")
				.numberOfSeats(4).vehicleType(VehicleType.PROM).company(company).build();
		var taxi = VehicleEntity.builder()
				.brand("Honda").model("Civic").licensePlate("CB3333DD")
				.numberOfSeats(4).vehicleType(VehicleType.TAXI).company(company).build();
		vehicleRepository.save(prom);
		vehicleRepository.save(taxi);

		mockMvc.perform(get("/api/vehicles/public/company/{companyId}", company.getId())
						.with(TestData.guestJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(2));
	}
}
