package com.angel.autonow.dispatch;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.company.CompanyType;
import com.angel.autonow.data.TestData;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
import com.angel.autonow.vehicle.VehicleType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class DispatchControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private DriverRepository driverRepository;

	@Autowired
	private VehicleRepository vehicleRepository;

	@Autowired
	private CompanyRepository companyRepository;

	@MockitoBean
	private DispatchLlmClient dispatchLlmClient;

	private UserEntity user;
	private OrderEntity order;
	private DriverEntity driver;
	private VehicleEntity vehicle;

	@BeforeEach
	void setUp() {
		user = TestData.createUserEntity();
		userRepository.save(user);

		CompanyEntity company = TestData.createCompanyEntity();
		company.setCompanyType(CompanyType.TAXI);
		companyRepository.save(company);

		driver = TestData.createDriverEntity();
		driver.setCompany(company);
		driver.setAvailable(true);
		driver.setExpertiseType(Set.of(ExpertiseType.B));
		driverRepository.save(driver);

		vehicle = TestData.createVehicleEntity();
		vehicle.setVehicleType(VehicleType.TAXI);
		vehicle.setCompany(company);
		vehicle.setDriver(driver);
		vehicleRepository.save(vehicle);

		order = OrderEntity.builder()
				.user(user)
				.vehicleType(VehicleType.TAXI)
				.pickupAddress(TestData.DEFAULT_PICKUP_ADDRESS)
				.pickupLatitude(TestData.DEFAULT_PICKUP_LAT)
				.pickupLongitude(TestData.DEFAULT_PICKUP_LNG)
				.dropoffAddress(TestData.DEFAULT_DROPOFF_ADDRESS)
				.dropoffLatitude(TestData.DEFAULT_DROPOFF_LAT)
				.dropoffLongitude(TestData.DEFAULT_DROPOFF_LNG)
				.status(OrderStatus.CREATED)
				.build();
		orderRepository.save(order);
	}

	@Test
	void autoAssign_validOrder_returns200WithAssignedOrder() throws Exception {
		when(dispatchLlmClient.suggestDriver(any(), anyList()))
				.thenReturn(DispatchSuggestionDTO.builder().driverId(driver.getId()).build());

		mockMvc.perform(post("/api/dispatch/{orderId}/auto-assign", order.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(order.getId()))
				.andExpect(jsonPath("$.status").value("ACCEPTED"))
				.andExpect(jsonPath("$.driverId").value(driver.getId()))
				.andExpect(jsonPath("$.vehicleId").value(vehicle.getId()));
	}

	@Test
	void autoAssign_unknownOrder_returns404() throws Exception {
		mockMvc.perform(post("/api/dispatch/{orderId}/auto-assign", TestData.NON_EXISTENT_ID)
						.with(TestData.adminJwt()))
				.andExpect(status().isNotFound());
	}

	@Test
	void autoAssign_noAvailableDrivers_returns409() throws Exception {
		driver.setAvailable(false);
		driverRepository.save(driver);

		mockMvc.perform(post("/api/dispatch/{orderId}/auto-assign", order.getId())
						.with(TestData.adminJwt()))
				.andExpect(status().isConflict());
	}

	@Test
	void autoAssign_customerRole_returns403() throws Exception {
		mockMvc.perform(post("/api/dispatch/{orderId}/auto-assign", order.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void autoAssign_companyAdmin_returns200() throws Exception {
		when(dispatchLlmClient.suggestDriver(any(), anyList()))
				.thenReturn(DispatchSuggestionDTO.builder().driverId(driver.getId()).build());

		mockMvc.perform(post("/api/dispatch/{orderId}/auto-assign", order.getId())
						.with(TestData.companyAdminJwt()))
				.andExpect(status().isOk());
	}
}
