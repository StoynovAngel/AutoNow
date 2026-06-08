package com.angel.autonow;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.company.CompanyType;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.user.UserEntity;
import com.angel.autonow.user.UserRepository;
import com.angel.autonow.vehicle.VehicleEntity;
import com.angel.autonow.vehicle.VehicleRepository;
import com.angel.autonow.vehicle.VehicleType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Slf4j
@Component
@Profile("!test")
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

	private final UserRepository userRepository;
	private final CompanyRepository companyRepository;
	private final VehicleRepository vehicleRepository;
	private final DriverRepository driverRepository;
	private final PasswordEncoder passwordEncoder;

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		if (userRepository.count() > 0) {
			log.info("Database already seeded, skipping.");
			return;
		}

		log.info("Seeding database...");
		seedData();
		log.info("Database seeding complete.");
	}

	private void seedData() {
		String password = passwordEncoder.encode("Password123");

		userRepository.save(UserEntity.builder()
				.email("admin@autonow.com")
				.password(password)
				.authorities(Set.of("ROLE_ADMIN", "ROLE_CUSTOMER", "ROLE_COMPANY_ADMIN"))
				.build());

		userRepository.save(UserEntity.builder()
				.email("john.doe@example.com")
				.password(password)
				.authorities(Set.of("ROLE_CUSTOMER"))
				.build());

		userRepository.save(UserEntity.builder()
				.email("jane.smith@example.com")
				.password(password)
				.authorities(Set.of("ROLE_CUSTOMER"))
				.build());

		seedTaxi(password);
		seedLogistics(password);
		seedAmbulance(password);
		seedRental(password);
		seedFuneral(password);
		seedProm(password);
	}

	private DriverEntity saveDriverWithVehicle(DriverEntity driver, VehicleEntity vehicle) {
		DriverEntity saved = driverRepository.save(driver);
		vehicle.setDriver(saved);
		vehicleRepository.save(vehicle);
		return saved;
	}

	private void seedTaxi(String password) {
		CompanyEntity company = companyRepository.save(CompanyEntity.builder()
				.name("AutoNow Taxi Sofia")
				.address("100 Vitosha Blvd, Sofia")
				.phone("+359888100001")
				.email("contact@taxi-sofia.bg")
				.description("Premium taxi service in Sofia")
				.companyType(CompanyType.TAXI)
				.build());

		userRepository.save(UserEntity.builder()
				.email("admin@taxi-sofia.bg")
				.password(password)
				.authorities(Set.of("ROLE_COMPANY_ADMIN"))
				.company(company)
				.build());

		VehicleEntity v1 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Toyota").model("Camry").licensePlate("CA1234AB")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg/1280px-2018_Toyota_Camry_%28ASV70R%29_Ascent_sedan_%282018-08-27%29_01.jpg")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(450.0)
				.vehicleType(VehicleType.TAXI)
				.company(company).build());

		VehicleEntity v2 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Skoda").model("Octavia").licensePlate("CA2345BE")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/0/05/Octavia_taxi_chisinau_004.jpg")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(530.0)
				.vehicleType(VehicleType.TAXI)
				.company(company).build());

		VehicleEntity v3 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Volkswagen").model("Passat").licensePlate("CA3456KH")
				.imageUrl("https://www.dalamanairporttaxi.com/en/img-page/340-volkswagen-passat.jpg")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(480.0)
				.vehicleType(VehicleType.TAXI)
				.company(company).build());

		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Michael").lastName("Johnson")
				.phoneNumber("+359888100100")
				.expertiseType(Set.of(ExpertiseType.B)).available(true)
				.company(company).build(), v1);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Sarah").lastName("Williams")
				.phoneNumber("+359888100101")
				.expertiseType(Set.of(ExpertiseType.B)).available(true)
				.company(company).build(), v2);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Daniel").lastName("Taylor")
				.phoneNumber("+359888100102")
				.expertiseType(Set.of(ExpertiseType.B)).available(true)
				.company(company).build(), v3);
	}

	private void seedLogistics(String password) {
		CompanyEntity company = companyRepository.save(CompanyEntity.builder()
				.name("BG Cargo Logistics")
				.address("12 Industrial Zone, Plovdiv")
				.phone("+359888200002")
				.email("ops@bgcargo.bg")
				.description("Long-haul freight across the Balkans")
				.companyType(CompanyType.LOGISTICS)
				.build());

		userRepository.save(UserEntity.builder()
				.email("admin@bgcargo.bg")
				.password(password)
				.authorities(Set.of("ROLE_COMPANY_ADMIN"))
				.company(company)
				.build());

		VehicleEntity v1 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Volvo").model("FH16").licensePlate("PB1122MT")
				.imageUrl("https://blog.truckscout24.com/de/wp-content/uploads/2013/10/Volvo-FH16-750-19-fotoshowImageNew-58e110e5-80060.jpg")
				.airConditioning(true).numberOfSeats(2).trunkCapacity(40000.0)
				.vehicleType(VehicleType.SEMI)
				.company(company).build());

		VehicleEntity v2 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Scania").model("R450").licensePlate("PB2233HK")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Scania_R_450_-_2017.jpg/1280px-Scania_R_450_-_2017.jpg")
				.airConditioning(true).numberOfSeats(2).trunkCapacity(38000.0)
				.vehicleType(VehicleType.SEMI)
				.company(company).build());

		VehicleEntity v3 = vehicleRepository.save(VehicleEntity.builder()
				.brand("MAN").model("TGX").licensePlate("PB3344TX")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/MAN_TGX_18.500_4x2_BLS_Efficient_Line_3_%28cropped%29.jpg/1280px-MAN_TGX_18.500_4x2_BLS_Efficient_Line_3_%28cropped%29.jpg")
				.airConditioning(true).numberOfSeats(2).trunkCapacity(42000.0)
				.vehicleType(VehicleType.SEMI)
				.company(company).build());

		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("David").lastName("Brown")
				.phoneNumber("+359888200200")
				.expertiseType(Set.of(ExpertiseType.C, ExpertiseType.CE)).available(true)
				.company(company).build(), v1);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Peter").lastName("Anderson")
				.phoneNumber("+359888200201")
				.expertiseType(Set.of(ExpertiseType.CE)).available(true)
				.company(company).build(), v2);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Lyudmila").lastName("Koleva")
				.phoneNumber("+359888200202")
				.expertiseType(Set.of(ExpertiseType.C, ExpertiseType.CE)).available(true)
				.company(company).build(), v3);
	}

	private void seedAmbulance(String password) {
		CompanyEntity company = companyRepository.save(CompanyEntity.builder()
				.name("MedTransport BG")
				.address("25 Hospital St, Sofia")
				.phone("+359888300003")
				.email("info@medtransport.bg")
				.description("24/7 ambulance and medical transport")
				.companyType(CompanyType.AMBULANCE)
				.build());

		userRepository.save(UserEntity.builder()
				.email("admin@medtransport.bg")
				.password(password)
				.authorities(Set.of("ROLE_COMPANY_ADMIN"))
				.company(company)
				.build());

		VehicleEntity v1 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Mercedes").model("Sprinter").licensePlate("CB1010AM")
				.imageUrl("https://www.nvsuk.com/images/sprinter/IMG-20210905-WA0020.jpg")
				.airConditioning(true).numberOfSeats(3).trunkCapacity(1500.0)
				.vehicleType(VehicleType.AMBULANCE)
				.company(company).build());

		VehicleEntity v2 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Volkswagen").model("Crafter").licensePlate("CB2020BO")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/VW_Crafter_Ambulance_%282021%29_-_Front_view.jpg/1280px-VW_Crafter_Ambulance_%282021%29_-_Front_view.jpg")
				.airConditioning(true).numberOfSeats(3).trunkCapacity(1400.0)
				.vehicleType(VehicleType.AMBULANCE)
				.company(company).build());

		VehicleEntity v3 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Ford").model("Transit").licensePlate("CB3030EK")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Ford_Transit_Ambulance.jpg/1280px-Ford_Transit_Ambulance.jpg")
				.airConditioning(true).numberOfSeats(3).trunkCapacity(1300.0)
				.vehicleType(VehicleType.AMBULANCE)
				.company(company).build());

		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Emily").lastName("Davis")
				.phoneNumber("+359888300300")
				.expertiseType(Set.of(ExpertiseType.B, ExpertiseType.C1)).available(true)
				.company(company).build(), v1);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Robert").lastName("Miller")
				.phoneNumber("+359888300301")
				.expertiseType(Set.of(ExpertiseType.C1)).available(true)
				.company(company).build(), v2);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Stefan").lastName("Iliev")
				.phoneNumber("+359888300302")
				.expertiseType(Set.of(ExpertiseType.B, ExpertiseType.C1)).available(true)
				.company(company).build(), v3);
	}

	private void seedRental(String password) {
		CompanyEntity company = companyRepository.save(CompanyEntity.builder()
				.name("Sofia Auto Rentals")
				.address("8 Airport Rd, Sofia")
				.phone("+359888400004")
				.email("hello@sofia-rent.bg")
				.description("Self-drive car rental, airport pickup")
				.companyType(CompanyType.RENTAL)
				.build());

		userRepository.save(UserEntity.builder()
				.email("admin@sofia-rent.bg")
				.password(password)
				.authorities(Set.of("ROLE_COMPANY_ADMIN"))
				.company(company)
				.build());

		VehicleEntity v1 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Renault").model("Clio").licensePlate("CA4040HP")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Renault_Clio_V_in_Aalborg.jpg/1280px-Renault_Clio_V_in_Aalborg.jpg")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(300.0)
				.vehicleType(VehicleType.RENTAL)
				.company(company).build());

		VehicleEntity v2 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Hyundai").model("Tucson").licensePlate("CA5050PT")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/2021_Hyundai_Tucson_%28NX4%29_Premium_2.0.jpg/1280px-2021_Hyundai_Tucson_%28NX4%29_Premium_2.0.jpg")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(620.0)
				.vehicleType(VehicleType.RENTAL)
				.company(company).build());

		VehicleEntity v3 = vehicleRepository.save(VehicleEntity.builder()
				.brand("BMW").model("3 Series").licensePlate("CA6060TY")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/BMW_G20_IMG_0028.jpg/1280px-BMW_G20_IMG_0028.jpg")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(480.0)
				.vehicleType(VehicleType.RENTAL)
				.company(company).build());

		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Anna").lastName("Petrova")
				.phoneNumber("+359888400400")
				.expertiseType(Set.of(ExpertiseType.B)).available(true)
				.company(company).build(), v1);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Ivan").lastName("Dimitrov")
				.phoneNumber("+359888400401")
				.expertiseType(Set.of(ExpertiseType.B)).available(true)
				.company(company).build(), v2);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Teodora").lastName("Mihaylova")
				.phoneNumber("+359888400402")
				.expertiseType(Set.of(ExpertiseType.B)).available(true)
				.company(company).build(), v3);
	}

	private void seedFuneral(String password) {
		CompanyEntity company = companyRepository.save(CompanyEntity.builder()
				.name("Last Journey BG")
				.address("3 Memorial Park, Varna")
				.phone("+359888500005")
				.email("office@lastjourney.bg")
				.description("Respectful funeral transport services")
				.companyType(CompanyType.FUNERAL)
				.build());

		userRepository.save(UserEntity.builder()
				.email("admin@lastjourney.bg")
				.password(password)
				.authorities(Set.of("ROLE_COMPANY_ADMIN"))
				.company(company)
				.build());

		VehicleEntity v1 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Cadillac").model("XTS Hearse").licensePlate("BT1010YX")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Cadillac_XTS_hearse.jpg/1280px-Cadillac_XTS_hearse.jpg")
				.airConditioning(true).numberOfSeats(2).trunkCapacity(2500.0)
				.vehicleType(VehicleType.FUNERAL)
				.company(company).build());

		VehicleEntity v2 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Lincoln").model("MKT Hearse").licensePlate("BT2020XA")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Lincoln_MKT_Hearse.jpg/1280px-Lincoln_MKT_Hearse.jpg")
				.airConditioning(true).numberOfSeats(2).trunkCapacity(2400.0)
				.vehicleType(VehicleType.FUNERAL)
				.company(company).build());

		VehicleEntity v3 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Mercedes").model("E-Class Hearse").licensePlate("BT3030AE")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Mercedes_Benz_W212_hearse.jpg/1280px-Mercedes_Benz_W212_hearse.jpg")
				.airConditioning(true).numberOfSeats(2).trunkCapacity(2300.0)
				.vehicleType(VehicleType.FUNERAL)
				.company(company).build());

		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("George").lastName("Stoyanov")
				.phoneNumber("+359888500500")
				.expertiseType(Set.of(ExpertiseType.B)).available(true)
				.company(company).build(), v1);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Maria").lastName("Hristova")
				.phoneNumber("+359888500501")
				.expertiseType(Set.of(ExpertiseType.B)).available(true)
				.company(company).build(), v2);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Vasil").lastName("Marinov")
				.phoneNumber("+359888500502")
				.expertiseType(Set.of(ExpertiseType.B)).available(true)
				.company(company).build(), v3);
	}

	private void seedProm(String password) {
		CompanyEntity company = companyRepository.save(CompanyEntity.builder()
				.name("Royal Prom Limos")
				.address("44 Boyana St, Sofia")
				.phone("+359888600006")
				.email("book@royalprom.bg")
				.description("Luxury limousines for proms and weddings")
				.companyType(CompanyType.PROM)
				.build());

		userRepository.save(UserEntity.builder()
				.email("admin@royalprom.bg")
				.password(password)
				.authorities(Set.of("ROLE_COMPANY_ADMIN"))
				.company(company)
				.build());

		VehicleEntity v1 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Chrysler").model("300 Limousine").licensePlate("CA7070EM")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Chrysler_300_limo.jpg/1280px-Chrysler_300_limo.jpg")
				.airConditioning(true).numberOfSeats(8).trunkCapacity(400.0)
				.vehicleType(VehicleType.PROM)
				.company(company).build());

		VehicleEntity v2 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Lincoln").model("Stretch").licensePlate("CA8080MO")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Lincoln_Town_Car_Stretch_Limo.jpg/1280px-Lincoln_Town_Car_Stretch_Limo.jpg")
				.airConditioning(true).numberOfSeats(10).trunkCapacity(450.0)
				.vehicleType(VehicleType.PROM)
				.company(company).build());

		VehicleEntity v3 = vehicleRepository.save(VehicleEntity.builder()
				.brand("Hummer").model("H2 Limo").licensePlate("CA9090OT")
				.imageUrl("https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Hummer_H2_Limousine.jpg/1280px-Hummer_H2_Limousine.jpg")
				.airConditioning(true).numberOfSeats(14).trunkCapacity(500.0)
				.vehicleType(VehicleType.PROM)
				.company(company).build());

		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Nikolay").lastName("Georgiev")
				.phoneNumber("+359888600600")
				.expertiseType(Set.of(ExpertiseType.B, ExpertiseType.D1)).available(true)
				.company(company).build(), v1);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Elena").lastName("Vasileva")
				.phoneNumber("+359888600601")
				.expertiseType(Set.of(ExpertiseType.D1)).available(true)
				.company(company).build(), v2);
		saveDriverWithVehicle(DriverEntity.builder()
				.firstName("Boris").lastName("Tonev")
				.phoneNumber("+359888600602")
				.expertiseType(Set.of(ExpertiseType.B, ExpertiseType.D1)).available(true)
				.company(company).build(), v3);
	}
}
