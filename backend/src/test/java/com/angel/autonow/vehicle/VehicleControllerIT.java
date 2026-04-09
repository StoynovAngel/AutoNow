package com.angel.autonow.vehicle;

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
class VehicleControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private VehicleRepository vehicleRepository;

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
				.andExpect(jsonPath("$.vehicleType").value("TAXI"));
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
		var invalidRequest = new VehicleRequestDTO(null, null, null, false, null, null, null);

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
}
