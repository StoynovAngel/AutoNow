package com.angel.autonow.driver;

import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.data.TestData;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.user.role.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static com.angel.autonow.data.TestData.NON_EXISTENT_ID;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DriverServiceTest {

	@Mock
	private DriverRepository driverRepository;

	@Mock
	private DriverMapper driverMapper;

	@Mock
	private CompanyRepository companyRepository;

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private DriverService driverService;

	private static final String ADMIN_EMAIL = "admin@test.com";

	private UserEntity adminUser() {
		return UserEntity.builder()
				.id(1L)
				.email(ADMIN_EMAIL)
				.authorities(new HashSet<>(Set.of(Role.ADMIN.getAuthority())))
				.build();
	}

	@Test
	void createDriver_returnDriverResponse() {
		DriverRequestDTO request = TestData.createDriverRequest();

		DriverEntity entity = DriverEntity.builder()
				.firstName("Michael")
				.lastName("Johnson")
				.build();

		DriverEntity saved = DriverEntity.builder()
				.id(1L)
				.firstName("Michael")
				.lastName("Johnson")
				.build();

		DriverResponseDTO response = TestData.createDriverResponse(1L);

		when(driverMapper.toEntity(request)).thenReturn(entity);
		when(driverRepository.save(entity)).thenReturn(saved);
		when(driverMapper.toDTO(saved)).thenReturn(response);
		when(userRepository.findByEmail(ADMIN_EMAIL)).thenReturn(Optional.of(adminUser()));

		var result = driverService.createDriver(request, ADMIN_EMAIL);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		assertEquals("Michael", result.get().firstName());
	}

	@Test
	void getDriverById_returnDriverResponse() {
		DriverEntity entity = DriverEntity.builder().id(1L).firstName("Michael").build();
		DriverResponseDTO response = TestData.createDriverResponse(1L);

		when(driverRepository.findById(1L)).thenReturn(Optional.of(entity));
		when(driverMapper.toDTO(entity)).thenReturn(response);

		var result = driverService.getDriverById(1L);

		assertTrue(result.isPresent());
		assertEquals("Michael", result.get().firstName());
	}

	@Test
	void getDriverById_notFound_returnsEmpty() {
		when(driverRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());
		var result = driverService.getDriverById(NON_EXISTENT_ID);
		assertTrue(result.isEmpty());
	}

	@Test
	void getDriverByLicenseNumber_returnDriverResponse() {
		DriverEntity entity = DriverEntity.builder().id(1L).licenseNumber("DL-TEST-001").build();
		DriverResponseDTO response = TestData.createDriverResponse(1L);

		when(driverRepository.findByLicenseNumber("DL-TEST-001")).thenReturn(Optional.of(entity));
		when(driverMapper.toDTO(entity)).thenReturn(response);

		var result = driverService.getDriverByLicenseNumber("DL-TEST-001");

		assertTrue(result.isPresent());
		assertEquals("DL-TEST-001", result.get().licenseNumber());
	}

	@Test
	void getDriverByLicenseNumber_notFound_returnsEmpty() {
		when(driverRepository.findByLicenseNumber("INVALID")).thenReturn(Optional.empty());
		var result = driverService.getDriverByLicenseNumber("INVALID");
		assertTrue(result.isEmpty());
	}

	@Test
	void getAllDrivers_returnList() {
		DriverEntity firstDriver = DriverEntity.builder().id(1L).firstName("Michael").build();
		DriverEntity secondDriver = DriverEntity.builder().id(2L).firstName("Jane").build();
		DriverResponseDTO firstResponse = TestData.createDriverResponse(1L);
		DriverResponseDTO secondResponse = DriverResponseDTO.builder()
				.id(2L).firstName("Jane").lastName("Smith")
				.phoneNumber("+1234567891").licenseNumber("DL-002")
				.expertiseType(ExpertiseType.C).available(true)
				.vehicleIds(java.util.Collections.emptySet())
				.build();

		when(driverRepository.findAll()).thenReturn(List.of(firstDriver, secondDriver));
		when(driverMapper.toDTO(firstDriver)).thenReturn(firstResponse);
		when(driverMapper.toDTO(secondDriver)).thenReturn(secondResponse);

		var result = driverService.getAllDrivers();

		assertEquals(2, result.size());
	}

	@Test
	void getAllDrivers_emptyList() {
		when(driverRepository.findAll()).thenReturn(List.of());
		var result = driverService.getAllDrivers();
		assertTrue(result.isEmpty());
	}

	@Test
	void updateDriver_returnUpdatedResponse() {
		DriverRequestDTO request = TestData.createDriverRequest();
		DriverEntity existing = DriverEntity.builder().id(1L).firstName("Michael").build();
		DriverEntity saved = DriverEntity.builder().id(1L).firstName("Michael").build();
		DriverResponseDTO response = TestData.createDriverResponse(1L);

		when(userRepository.findByEmail(ADMIN_EMAIL)).thenReturn(Optional.of(adminUser()));
		when(driverRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(driverRepository.save(existing)).thenReturn(saved);
		when(driverMapper.toDTO(saved)).thenReturn(response);

		var result = driverService.updateDriver(1L, request, ADMIN_EMAIL);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		verify(driverMapper).updateEntity(request, existing);
		verify(driverRepository).save(existing);
	}

	@Test
	void updateDriver_notFound_returnsEmpty() {
		DriverRequestDTO request = TestData.createDriverRequest();

		when(userRepository.findByEmail(ADMIN_EMAIL)).thenReturn(Optional.of(adminUser()));
		when(driverRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = driverService.updateDriver(NON_EXISTENT_ID, request, ADMIN_EMAIL);

		assertTrue(result.isEmpty());
	}

	@Test
	void deleteDriver_returnTrue() {
		DriverEntity driver = DriverEntity.builder().id(1L).build();

		when(userRepository.findByEmail(ADMIN_EMAIL)).thenReturn(Optional.of(adminUser()));
		when(driverRepository.findById(1L)).thenReturn(Optional.of(driver));

		var result = driverService.deleteDriver(1L, ADMIN_EMAIL);

		assertTrue(result);
		verify(driverRepository).deleteById(1L);
	}

	@Test
	void deleteDriver_notFound_returnFalse() {
		when(userRepository.findByEmail(ADMIN_EMAIL)).thenReturn(Optional.of(adminUser()));
		when(driverRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = driverService.deleteDriver(NON_EXISTENT_ID, ADMIN_EMAIL);

		assertFalse(result);
		verify(driverRepository, never()).deleteById(any());
	}
}
