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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
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
	@WithMockUser
	void createRating() throws Exception {
		RatingRequestDTO request = TestData.createRatingRequest(order.getId());

		mockMvc.perform(post("/api/ratings")
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
	@WithMockUser
	void createRating_invalidInput_returnsBadRequest() throws Exception {
		RatingRequestDTO invalidRequest = new RatingRequestDTO(null, null, null);

		mockMvc.perform(post("/api/ratings")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser
	void createRating_ratingOutOfRange_returnsBadRequest() throws Exception {
		RatingRequestDTO invalidRequest = TestData.createRatingRequest(order.getId(), 6, null);

		mockMvc.perform(post("/api/ratings")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(invalidRequest)))
				.andExpect(status().isBadRequest());
	}

	@Test
	@WithMockUser
	void createRating_orderNotFound_returnsBadRequest() throws Exception {
		RatingRequestDTO request = TestData.createRatingRequest(999L);

		mockMvc.perform(post("/api/ratings")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isBadRequest());
	}

	@Test
	void createRating_withoutAuth_returnsUnauthorized() throws Exception {
		RatingRequestDTO request = TestData.createRatingRequest(order.getId());

		mockMvc.perform(post("/api/ratings")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(request)))
				.andExpect(status().isUnauthorized());
	}

	@Test
	@WithMockUser
	void getRatingById() throws Exception {
		RatingEntity rating = TestData.createRatingEntity(order, 4, "Good ride");
		ratingRepository.save(rating);

		mockMvc.perform(get("/api/ratings/{id}", rating.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rating").value(4))
				.andExpect(jsonPath("$.comment").value("Good ride"));
	}

	@Test
	@WithMockUser
	void getRatingById_notFound_returnsOkEmpty() throws Exception {
		mockMvc.perform(get("/api/ratings/{id}", 999L))
				.andExpect(status().isOk())
				.andExpect(content().string(""));
	}

	@Test
	@WithMockUser
	void getRatingByOrderId() throws Exception {
		RatingEntity rating = TestData.createRatingEntity(order, 3, "OK");
		ratingRepository.save(rating);

		mockMvc.perform(get("/api/ratings/order/{orderId}", order.getId()))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.rating").value(3))
				.andExpect(jsonPath("$.comment").value("OK"));
	}

	@Test
	@WithMockUser
	void getRatingByOrderId_notFound_returnsOkEmpty() throws Exception {
		mockMvc.perform(get("/api/ratings/order/{orderId}", 999L))
				.andExpect(status().isOk())
				.andExpect(content().string(""));
	}

	@Test
	@WithMockUser
	void getAllRatings() throws Exception {
		RatingEntity rating = TestData.createRatingEntity(order, 5, null);
		ratingRepository.save(rating);

		mockMvc.perform(get("/api/ratings"))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.length()").value(1));
	}

	@Test
	@WithMockUser
	void getAllRatings_noEntries_returnsEmptyList() throws Exception {
		mockMvc.perform(get("/api/ratings"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$").isEmpty());
	}

	@Test
	void getAllRatings_withoutAuth_returnsUnauthorized() throws Exception {
		mockMvc.perform(get("/api/ratings"))
				.andExpect(status().isUnauthorized());
	}
}
