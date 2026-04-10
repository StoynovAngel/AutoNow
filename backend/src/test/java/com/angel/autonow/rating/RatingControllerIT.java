package com.angel.autonow.rating;

import com.angel.autonow.data.TestData;
import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import tools.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
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
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@Transactional
@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
class RatingControllerIT {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Autowired
	private RatingRepository ratingRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private UserRepository userRepository;

	private OrderEntity order;

	@BeforeEach
	void setUp() {
		UserEntity user = TestData.createUserEntity();
		userRepository.save(user);

		order = TestData.createOrderEntity(user);
		orderRepository.save(order);
	}

	@Test
	void createRating() throws Exception {
		var request = TestData.createRatingRequest(order.getId());

		mockMvc.perform(post("/api/ratings")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.orderId").value(order.getId()))
				.andExpect(jsonPath("$.rating").value(5))
				.andExpect(jsonPath("$.comment").value("Excellent service!"))
				.andExpect(jsonPath("$.createdAt").exists());
	}

	@Test
	void createRating_asAdmin() throws Exception {
		var request = TestData.createRatingRequest(order.getId());

		mockMvc.perform(post("/api/ratings")
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isCreated());
	}

	@Test
	void createRating_asDriver_returnsForbidden() throws Exception {
		var request = TestData.createRatingRequest(order.getId());

		mockMvc.perform(post("/api/ratings")
						.with(TestData.driverJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void createRating_asGuest_returnsForbidden() throws Exception {
		var request = TestData.createRatingRequest(order.getId());

		mockMvc.perform(post("/api/ratings")
						.with(TestData.guestJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isForbidden());
	}

	@Test
	void createRating_invalidInput_returnsBadRequest() throws Exception {
		var invalidRequest = new RatingRequestDTO(null, null, null);

		mockMvc.perform(post("/api/ratings")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createRating_ratingOutOfRange_returnsBadRequest() throws Exception {
		var invalidRequest = TestData.createRatingRequest(order.getId(), 6, null);

		mockMvc.perform(post("/api/ratings")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createRating_orderNotFound_returnsBadRequest() throws Exception {
		var request = TestData.createRatingRequest(NON_EXISTENT_ID);

		mockMvc.perform(post("/api/ratings")
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createRating_withoutAuth_returnsUnauthorized() throws Exception {
		var request = TestData.createRatingRequest(order.getId());

		mockMvc.perform(post("/api/ratings")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void getRatingById() throws Exception {
		var rating = TestData.createRatingEntity(order, 4, "Good ride");
		ratingRepository.save(rating);

		mockMvc.perform(get("/api/ratings/{id}", rating.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rating").value(4))
				.andExpect(jsonPath("$.comment").value("Good ride"));
	}

	@Test
	void getRatingById_asGuest_returnsForbidden() throws Exception {
		var rating = TestData.createRatingEntity(order, 4, "Good ride");
		ratingRepository.save(rating);

		mockMvc.perform(get("/api/ratings/{id}", rating.getId())
						.with(TestData.guestJwt()))
				.andExpect(status().isForbidden());
	}

	@Test
	void getRatingById_notFound_returnsOkEmpty() throws Exception {
		mockMvc.perform(get("/api/ratings/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(content().string(""));
	}

	@Test
	void getRatingByOrderId() throws Exception {
		var rating = TestData.createRatingEntity(order, 3, "OK");
		ratingRepository.save(rating);

		mockMvc.perform(get("/api/ratings/order/{orderId}", order.getId())
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rating").value(3))
				.andExpect(jsonPath("$.comment").value("OK"));
	}

	@Test
	void getRatingByOrderId_notFound_returnsOkEmpty() throws Exception {
		mockMvc.perform(get("/api/ratings/order/{orderId}", NON_EXISTENT_ID)
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(content().string(""));
	}

	@Test
	void getAllRatings() throws Exception {
		var rating = TestData.createRatingEntity(order, 5, null);
		ratingRepository.save(rating);

		mockMvc.perform(get("/api/ratings")
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	void getAllRatings_noEntries_returnsEmptyList() throws Exception {
		mockMvc.perform(get("/api/ratings")
						.with(TestData.customerJwt()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getAllRatings_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/ratings"))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void updateRating_asCustomer() throws Exception {
		var rating = TestData.createRatingEntity(order, 3, "OK");
		ratingRepository.save(rating);

		var updateRequest = TestData.createRatingRequest(order.getId(), 5, "Actually great!");

		mockMvc.perform(put("/api/ratings/{id}", rating.getId())
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rating").value(5))
				.andExpect(jsonPath("$.comment").value("Actually great!"));
	}

	@Test
	void updateRating_asAdmin() throws Exception {
		var rating = TestData.createRatingEntity(order, 3, "OK");
		ratingRepository.save(rating);

		var updateRequest = TestData.createRatingRequest(order.getId(), 4, "Updated by admin");

		mockMvc.perform(put("/api/ratings/{id}", rating.getId())
						.with(TestData.adminJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rating").value(4));
	}

	@Test
	void updateRating_notFound_returnsBadRequest() throws Exception {
		var updateRequest = TestData.createRatingRequest(order.getId());

		mockMvc.perform(put("/api/ratings/{id}", NON_EXISTENT_ID)
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateRating_invalidInput_returnsBadRequest() throws Exception {
		var rating = TestData.createRatingEntity(order, 3, "OK");
		ratingRepository.save(rating);

		var invalidRequest = new RatingRequestDTO(null, null, null);

		mockMvc.perform(put("/api/ratings/{id}", rating.getId())
						.with(TestData.customerJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void updateRating_asDriver_returnsForbidden() throws Exception {
		var updateRequest = TestData.createRatingRequest(order.getId());

		mockMvc.perform(put("/api/ratings/{id}", 1L)
						.with(TestData.driverJwt())
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isForbidden());
	}

	@Test
	void updateRating_withoutAuth_returnsUnauthorized() throws Exception {
		var updateRequest = TestData.createRatingRequest(order.getId());

		mockMvc.perform(put("/api/ratings/{id}", 1L)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(updateRequest)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void deleteRating_asCustomer() throws Exception {
		var rating = TestData.createRatingEntity(order, 5, "Great");
		ratingRepository.save(rating);
		mockMvc.perform(delete("/api/ratings/{id}", rating.getId()).with(TestData.customerJwt())).andExpect(status().isNoContent());
	}

	@Test
	void deleteRating_asAdmin() throws Exception {
		var rating = TestData.createRatingEntity(order, 5, "Great");
		ratingRepository.save(rating);
		mockMvc.perform(delete("/api/ratings/{id}", rating.getId()).with(TestData.adminJwt())).andExpect(status().isNoContent());
	}

	@Test
	void deleteRating_notFound_returnsBadRequest() throws Exception {
		mockMvc.perform(delete("/api/ratings/{id}", NON_EXISTENT_ID).with(TestData.customerJwt())).andExpect(status().isBadRequest());
	}

	@Test
	void deleteRating_asDriver_returnsForbidden() throws Exception {
		mockMvc.perform(delete("/api/ratings/{id}", 1L).with(TestData.driverJwt())).andExpect(status().isForbidden());
	}

	@Test
	void deleteRating_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(delete("/api/ratings/{id}", 1L)).andExpect(status().isUnauthorized());
	}
}
