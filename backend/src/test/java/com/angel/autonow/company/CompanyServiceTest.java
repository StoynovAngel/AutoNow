package com.angel.autonow.company;

import com.angel.autonow.data.TestData;
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
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CompanyServiceTest {

	@Mock
	private CompanyRepository companyRepository;

	@Mock
	private CompanyMapper companyMapper;

	@Mock
	private UserRepository userRepository;

	@InjectMocks
	private CompanyService companyService;

	@Test
	void createCompany_returnCompanyResponse() {
		CompanyRequestDTO request = TestData.createCompanyRequest();
		CompanyEntity entity = CompanyEntity.builder().name("Test Fleet Co").build();
		CompanyEntity saved = CompanyEntity.builder().id(1L).name("Test Fleet Co").build();
		CompanyResponseDTO response = TestData.createCompanyResponse(1L);

		when(companyMapper.toEntity(request)).thenReturn(entity);
		when(companyRepository.save(entity)).thenReturn(saved);
		when(companyMapper.toDTO(saved)).thenReturn(response);

		var result = companyService.createCompany(request);

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		assertEquals("Test Fleet Co", result.get().name());
	}

	@Test
	void joinCompany_returnTrue() {
		CompanyEntity company = CompanyEntity.builder().id(1L).build();
		UserEntity user = UserEntity.builder()
				.id(1L)
				.email("test@example.com")
				.authorities(new HashSet<>())
				.build();

		when(companyRepository.findById(1L)).thenReturn(Optional.of(company));
		when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(user));

		var result = companyService.joinCompany(1L, "test@example.com");

		assertTrue(result);
		assertEquals(company, user.getCompany());
		assertTrue(user.getAuthorities().contains(Role.COMPANY_ADMIN.getAuthority()));
		verify(userRepository).save(user);
	}

	@Test
	void joinCompany_companyNotFound_returnFalse() {
		when(companyRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());
		when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(UserEntity.builder().build()));

		var result = companyService.joinCompany(NON_EXISTENT_ID, "test@example.com");

		assertFalse(result);
		verify(userRepository, never()).save(any());
	}

	@Test
	void joinCompany_userNotFound_returnFalse() {
		when(companyRepository.findById(1L)).thenReturn(Optional.of(CompanyEntity.builder().build()));
		when(userRepository.findByEmail("invalid@example.com")).thenReturn(Optional.empty());

		var result = companyService.joinCompany(1L, "invalid@example.com");

		assertFalse(result);
		verify(userRepository, never()).save(any());
	}

	@Test
	void getCompanyById_returnCompanyResponse() {
		CompanyEntity entity = CompanyEntity.builder().id(1L).name("Test Fleet Co").build();
		CompanyResponseDTO response = TestData.createCompanyResponse(1L);

		when(companyRepository.findById(1L)).thenReturn(Optional.of(entity));
		when(companyMapper.toDTO(entity)).thenReturn(response);

		var result = companyService.getCompanyById(1L);

		assertTrue(result.isPresent());
		assertEquals("Test Fleet Co", result.get().name());
	}

	@Test
	void getCompanyById_notFound_returnsEmpty() {
		when(companyRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = companyService.getCompanyById(NON_EXISTENT_ID);

		assertTrue(result.isEmpty());
	}

	@Test
	void getAllCompanies_returnList() {
		CompanyEntity first = CompanyEntity.builder().id(1L).name("Fleet A").build();
		CompanyEntity second = CompanyEntity.builder().id(2L).name("Fleet B").build();
		CompanyResponseDTO firstResponse = TestData.createCompanyResponse(1L);
		CompanyResponseDTO secondResponse = CompanyResponseDTO.builder()
				.id(2L).name("Fleet B").build();

		when(companyRepository.findAll()).thenReturn(List.of(first, second));
		when(companyMapper.toDTO(first)).thenReturn(firstResponse);
		when(companyMapper.toDTO(second)).thenReturn(secondResponse);

		var result = companyService.getAllCompanies();

		assertEquals(2, result.size());
	}

	@Test
	void getAllCompanies_emptyList() {
		when(companyRepository.findAll()).thenReturn(List.of());

		var result = companyService.getAllCompanies();

		assertTrue(result.isEmpty());
	}

	@Test
	void updateCompany_asAdmin_returnUpdatedResponse() {
		CompanyRequestDTO request = TestData.createCompanyRequest();
		CompanyEntity existing = CompanyEntity.builder().id(1L).name("Old Name").build();
		CompanyEntity saved = CompanyEntity.builder().id(1L).name("Test Fleet Co").build();
		CompanyResponseDTO response = TestData.createCompanyResponse(1L);
		UserEntity admin = UserEntity.builder()
				.id(1L)
				.email("admin@test.com")
				.authorities(new HashSet<>(Set.of(Role.ADMIN.getAuthority())))
				.build();

		when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));
		when(companyRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(companyRepository.save(existing)).thenReturn(saved);
		when(companyMapper.toDTO(saved)).thenReturn(response);

		var result = companyService.updateCompany(1L, request, "admin@test.com");

		assertTrue(result.isPresent());
		assertEquals(1L, result.get().id());
		verify(companyMapper).updateEntity(request, existing);
	}

	@Test
	void updateCompany_asOwner_returnUpdatedResponse() {
		CompanyRequestDTO request = TestData.createCompanyRequest();
		CompanyEntity existing = CompanyEntity.builder().id(1L).name("Old Name").build();
		CompanyEntity saved = CompanyEntity.builder().id(1L).name("Test Fleet Co").build();
		CompanyResponseDTO response = TestData.createCompanyResponse(1L);
		UserEntity owner = UserEntity.builder()
				.id(2L)
				.email("owner@test.com")
				.authorities(new HashSet<>(Set.of(Role.COMPANY_ADMIN.getAuthority())))
				.company(existing)
				.build();

		when(userRepository.findByEmail("owner@test.com")).thenReturn(Optional.of(owner));
		when(companyRepository.findById(1L)).thenReturn(Optional.of(existing));
		when(companyRepository.save(existing)).thenReturn(saved);
		when(companyMapper.toDTO(saved)).thenReturn(response);

		var result = companyService.updateCompany(1L, request, "owner@test.com");

		assertTrue(result.isPresent());
	}

	@Test
	void updateCompany_notOwner_returnsEmpty() {
		CompanyRequestDTO request = TestData.createCompanyRequest();
		CompanyEntity otherCompany = CompanyEntity.builder().id(2L).build();
		UserEntity user = UserEntity.builder()
				.id(3L)
				.email("other@test.com")
				.authorities(new HashSet<>(Set.of(Role.COMPANY_ADMIN.getAuthority())))
				.company(otherCompany)
				.build();

		when(userRepository.findByEmail("other@test.com")).thenReturn(Optional.of(user));

		var result = companyService.updateCompany(1L, request, "other@test.com");

		assertTrue(result.isEmpty());
		verify(companyRepository, never()).save(any());
	}

	@Test
	void updateCompany_notFound_returnsEmpty() {
		CompanyRequestDTO request = TestData.createCompanyRequest();
		UserEntity admin = UserEntity.builder()
				.id(1L)
				.email("admin@test.com")
				.authorities(new HashSet<>(Set.of(Role.ADMIN.getAuthority())))
				.build();

		when(userRepository.findByEmail("admin@test.com")).thenReturn(Optional.of(admin));
		when(companyRepository.findById(NON_EXISTENT_ID)).thenReturn(Optional.empty());

		var result = companyService.updateCompany(NON_EXISTENT_ID, request, "admin@test.com");

		assertTrue(result.isEmpty());
	}

	@Test
	void updateCompany_userNotFound_returnsEmpty() {
		CompanyRequestDTO request = TestData.createCompanyRequest();

		when(userRepository.findByEmail("unknown@test.com")).thenReturn(Optional.empty());

		var result = companyService.updateCompany(1L, request, "unknown@test.com");

		assertTrue(result.isEmpty());
		verify(companyRepository, never()).save(any());
	}

	@Test
	void deleteCompany_returnTrue() {
		when(companyRepository.existsById(1L)).thenReturn(true);

		var result = companyService.deleteCompany(1L);

		assertTrue(result);
		verify(companyRepository).deleteById(1L);
	}

	@Test
	void deleteCompany_notFound_returnFalse() {
		when(companyRepository.existsById(NON_EXISTENT_ID)).thenReturn(false);

		var result = companyService.deleteCompany(NON_EXISTENT_ID);

		assertFalse(result);
		verify(companyRepository, never()).deleteById(any());
	}
}
