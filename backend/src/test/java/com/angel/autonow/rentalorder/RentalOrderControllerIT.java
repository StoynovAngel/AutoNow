package com.angel.autonow.rentalorder;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.data.TestData;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
import com.angel.autonow.vehicle.VehicleType;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class RentalOrderControllerIT {

	@Autowired private MockMvc mockMvc;
	@Autowired private ObjectMapper objectMapper;
	@Autowired private RentalOrderRepository rentalOrderRepository;
	@Autowired private UserRepository userRepository;
	@Autowired private VehicleRepository vehicleRepository;
	@Autowired private CompanyRepository companyRepository;

	private UserEntity user;

	@BeforeEach
	void setUp() {
		user = TestData.createUserEntity();
		userRepository.save(user);
	}

	@Test
	void createRentalOrder_returnsCreated() throws Exception {
		var request = TestData.createRentalOrderRequest(user.getId());

		mockMvc.perform(post("/api/rental-orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.userId").value(user.getId()))
				.andExpect(jsonPath("$.status").value("CREATED"));
	}

	@Test
	void createRentalOrder_userNotFound_returnsBadRequest() throws Exception {
		var request = TestData.createRentalOrderRequest(NON_EXISTENT_ID);

		mockMvc.perform(post("/api/rental-orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createRentalOrder_invalidInput_returnsBadRequest() throws Exception {
		var invalid = RentalOrderRequestDTO.builder().build();

		mockMvc.perform(post("/api/rental-orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalid)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createRentalOrder_withoutAuth_returnsUnauthorized() throws Exception {
		var request = TestData.createRentalOrderRequest(user.getId());

		mockMvc.perform(post("/api/rental-orders")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void createRentalOrder_endBeforeStart_returnsConflict() throws Exception {
		var request = RentalOrderRequestDTO.builder()
				.userId(user.getId())
				.rentalStartDate(LocalDateTime.now().plusDays(5))
				.rentalEndDate(LocalDateTime.now().plusDays(1))
				.build();

		mockMvc.perform(post("/api/rental-orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isConflict());
	}

	@Test
	void createRentalOrder_withRentalVehicle_storesVehicleAndPrice() throws Exception {
		CompanyEntity company = companyRepository.save(TestData.createCompanyEntity());
		VehicleEntity vehicle = vehicleRepository.save(VehicleEntity.builder()
				.brand("Toyota").model("Corolla").licensePlate("CA1111AB")
				.vehicleType(VehicleType.RENTAL).numberOfSeats(5).trunkCapacity(300.0)
				.airConditioning(true)
				.imageUrl("https://example.com/car.jpg")
				.company(company).build());

		var request = RentalOrderRequestDTO.builder()
				.userId(user.getId())
				.vehicleId(vehicle.getId())
				.rentalStartDate(LocalDateTime.now().plusDays(1))
				.rentalEndDate(LocalDateTime.now().plusDays(4))
				.build();

		mockMvc.perform(post("/api/rental-orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.vehicleId").value(vehicle.getId()))
				.andExpect(jsonPath("$.totalPrice").exists());
	}

	@Test
	void createRentalOrder_nonRentalVehicle_returnsConflict() throws Exception {
		VehicleEntity vehicle = vehicleRepository.save(VehicleEntity.builder()
				.brand("Toyota").model("Camry").licensePlate("CA2222BC")
				.vehicleType(VehicleType.TAXI).numberOfSeats(5).trunkCapacity(450.0)
				.airConditioning(true)
				.imageUrl("https://example.com/taxi.jpg")
				.build());

		var request = RentalOrderRequestDTO.builder()
				.userId(user.getId())
				.vehicleId(vehicle.getId())
				.rentalStartDate(LocalDateTime.now().plusDays(1))
				.rentalEndDate(LocalDateTime.now().plusDays(4))
				.build();

		mockMvc.perform(post("/api/rental-orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isConflict());
	}

	@Test
	void createRentalOrder_userHasActiveRental_returnsConflict() throws Exception {
		var existing = TestData.createRentalOrderEntity(user);
		existing.setStatus(RentalOrderStatus.CREATED);
		rentalOrderRepository.save(existing);

		var request = TestData.createRentalOrderRequest(user.getId());

		mockMvc.perform(post("/api/rental-orders")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isConflict());
	}

	@Test
	void getRentalOrderById_returnsOrder() throws Exception {
		var order = TestData.createRentalOrderEntity(user);
		rentalOrderRepository.save(order);

		mockMvc.perform(get("/api/rental-orders/{id}", order.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(order.getId()));
	}

	@Test
	void getRentalOrderById_notFound_returnsNotFound() throws Exception {
		mockMvc.perform(get("/api/rental-orders/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt()))
				.andExpect(status().isNotFound());
	}

	@Test
	void getRentalOrdersByUserId_returnsList() throws Exception {
		rentalOrderRepository.save(TestData.createRentalOrderEntity(user));

		mockMvc.perform(get("/api/rental-orders/user/{userId}", user.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getRentalOrdersByCompanyId_returnsOrders() throws Exception {
		CompanyEntity company = companyRepository.save(TestData.createCompanyEntity());
		var order = TestData.createRentalOrderEntity(user);
		order.setCompany(company);
		rentalOrderRepository.save(order);

		mockMvc.perform(get("/api/rental-orders/company/{companyId}", company.getId())
						.with(TestData.companyAdminJwt(company.getId())))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getAllRentalOrders_asAdmin_returnsAll() throws Exception {
		rentalOrderRepository.save(TestData.createRentalOrderEntity(user));

		mockMvc.perform(get("/api/rental-orders")
						.with(TestData.adminJwt()))
				.andExpect(status().isOk());
	}

	@Test
	void getAllRentalOrders_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(get("/api/rental-orders")
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void updateRentalOrder_asCustomer_returnsOk() throws Exception {
		var order = TestData.createRentalOrderEntity(user);
		rentalOrderRepository.save(order);

		var update = RentalOrderRequestDTO.builder()
				.userId(user.getId())
				.rentalStartDate(LocalDateTime.now().plusDays(2))
				.rentalEndDate(LocalDateTime.now().plusDays(6))
				.specialRequirements("Child seat")
				.build();

		mockMvc.perform(put("/api/rental-orders/{id}", order.getId())
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(update)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.specialRequirements").value("Child seat"));
	}

	@Test
	void updateRentalOrder_notFound_returnsBadRequest() throws Exception {
		var update = TestData.createRentalOrderRequest(user.getId());

		mockMvc.perform(put("/api/rental-orders/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(update)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void deleteRentalOrder_asAdmin_returnsNoContent() throws Exception {
		var order = TestData.createRentalOrderEntity(user);
		rentalOrderRepository.save(order);

		mockMvc.perform(delete("/api/rental-orders/{id}", order.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isNoContent());
	}

	@Test
	void deleteRentalOrder_notFound_returnsBadRequest() throws Exception {
		mockMvc.perform(delete("/api/rental-orders/{id}", NON_EXISTENT_ID)
						.with(TestData.adminJwt()))
				.andExpect(status().isBadRequest());
	}

	@Test
	void deleteRentalOrder_asCustomer_returnsForbidden() throws Exception {
		mockMvc.perform(delete("/api/rental-orders/{id}", 1L)
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void cancelRentalOrder_byOwner_returnsCanceled() throws Exception {
		var order = TestData.createRentalOrderEntity(user);
		order.setStatus(RentalOrderStatus.CREATED);
		rentalOrderRepository.save(order);

		mockMvc.perform(post("/api/rental-orders/{id}/cancel", order.getId())
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("CANCELED"));
	}

	@Test
	void cancelRentalOrder_byNonOwner_returnsForbidden() throws Exception {
		var order = TestData.createRentalOrderEntity(user);
		rentalOrderRepository.save(order);

		mockMvc.perform(post("/api/rental-orders/{id}/cancel", order.getId())
						.with(TestData.customerJwt("stranger@example.com")))
				.andExpect(status().isForbidden());
	}

	@Test
	void cancelRentalOrder_inProgress_returnsConflict() throws Exception {
		var order = TestData.createRentalOrderEntity(user);
		order.setStatus(RentalOrderStatus.IN_PROGRESS);
		rentalOrderRepository.save(order);

		mockMvc.perform(post("/api/rental-orders/{id}/cancel", order.getId())
						.with(TestData.customerJwt(user.getEmail())))
				.andExpect(status().isConflict());
	}

	@Test
	void adminCancelRentalOrder_returnsCanceled() throws Exception {
		var order = TestData.createRentalOrderEntity(user);
		order.setStatus(RentalOrderStatus.CREATED);
		rentalOrderRepository.save(order);

		mockMvc.perform(post("/api/rental-orders/{id}/admin-cancel", order.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("CANCELED"));
	}

	@Test
	void adminCancelRentalOrder_inProgress_returnsConflict() throws Exception {
		var order = TestData.createRentalOrderEntity(user);
		order.setStatus(RentalOrderStatus.IN_PROGRESS);
		rentalOrderRepository.save(order);

		mockMvc.perform(post("/api/rental-orders/{id}/admin-cancel", order.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isConflict());
	}

	@Test
	void adminCancelRentalOrder_notFound_returnsNotFound() throws Exception {
		mockMvc.perform(post("/api/rental-orders/{id}/admin-cancel", NON_EXISTENT_ID)
						.with(TestData.adminJwt()))
				.andExpect(status().isNotFound());
	}

	@Test
	void updateRentalOrderStatus_asCompanyAdmin_returnsOk() throws Exception {
		var order = TestData.createRentalOrderEntity(user);
		rentalOrderRepository.save(order);

		var statusUpdate = RentalOrderStatusUpdateDTO.builder().status(RentalOrderStatus.ACCEPTED).build();

		mockMvc.perform(patch("/api/rental-orders/{id}/status", order.getId())
						.with(TestData.companyAdminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(statusUpdate)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("ACCEPTED"));
	}
}
