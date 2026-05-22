package com.angel.autonow;

import com.angel.autonow.company.CompanyEntity;
import com.angel.autonow.company.CompanyRepository;
import com.angel.autonow.company.CompanyType;
import com.angel.autonow.driver.DriverEntity;
import com.angel.autonow.driver.DriverRepository;
import com.angel.autonow.expertise.ExpertiseType;
import com.angel.autonow.order.OrderEntity;
import com.angel.autonow.order.OrderRepository;
import com.angel.autonow.order.OrderStatus;
import com.angel.autonow.payment.PaymentEntity;
import com.angel.autonow.payment.PaymentMethod;
import com.angel.autonow.payment.PaymentRepository;
import com.angel.autonow.payment.PaymentStatus;
import com.angel.autonow.rating.RatingEntity;
import com.angel.autonow.rating.RatingRepository;
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

import java.time.LocalDateTime;
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
	private final OrderRepository orderRepository;
	private final PaymentRepository paymentRepository;
	private final RatingRepository ratingRepository;
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
		// Companies
		CompanyEntity fleetCompany = companyRepository.save(CompanyEntity.builder()
				.name("AutoNow Fleet Services")
				.address("100 Business Park Blvd, Sofia")
				.phone("+3590888123456")
				.email("fleet@autonow.com")
				.description("Premium taxi and logistics services in Sofia")
				.companyType(CompanyType.TAXI)
				.build());

		CompanyEntity medCompany = companyRepository.save(CompanyEntity.builder()
				.name("MedTransport BG")
				.address("25 Hospital St, Sofia")
				.phone("+3590888654321")
				.email("info@medtransport.bg")
				.description("Specialized ambulance and medical transport")
				.companyType(CompanyType.AMBULANCE)
				.build());

		// Users (password: 'Password123' BCrypt hashed at runtime)
		String bcryptPassword = passwordEncoder.encode("Password123");

		UserEntity admin = userRepository.save(UserEntity.builder()
				.email("admin@autonow.com")
				.password(bcryptPassword)
				.authorities(Set.of("ROLE_ADMIN", "ROLE_CUSTOMER", "ROLE_COMPANY_ADMIN"))
				.company(fleetCompany)
				.build());

		UserEntity john = userRepository.save(UserEntity.builder()
				.email("john.doe@example.com")
				.password(bcryptPassword)
				.authorities(Set.of("ROLE_CUSTOMER"))
				.build());

		UserEntity jane = userRepository.save(UserEntity.builder()
				.email("jane.smith@example.com")
				.password(bcryptPassword)
				.authorities(Set.of("ROLE_CUSTOMER"))
				.build());

		// Vehicles
		VehicleEntity camry = vehicleRepository.save(VehicleEntity.builder()
				.brand("Toyota").model("Camry").licensePlate("CB1234AA")
				.imageURL("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRaqTdC-vRAN7L0DOSV0gRBI0cXZNfG03svJQ&s")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(450.0)
				.vehicleType(VehicleType.TAXI).company(fleetCompany)
				.build());

		VehicleEntity crv = vehicleRepository.save(VehicleEntity.builder()
				.brand("Honda").model("CR-V").licensePlate("CB2345BB")
				.imageURL("https://www.taxi-heute.de/sites/default/files/public/styles/_news_1050x700_/public/images-news-teaser/2017-05-11-fahrzeuge-honda-automatik-suv_0.jpg")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(600.0)
				.vehicleType(VehicleType.TAXI).company(fleetCompany)
				.build());

		VehicleEntity sprinter = vehicleRepository.save(VehicleEntity.builder()
				.brand("Mercedes").model("Sprinter").licensePlate("CB3456CC")
				.imageURL("https://www.nvsuk.com/images/sprinter/IMG-20210905-WA0020.jpg")
				.airConditioning(true).numberOfSeats(2).trunkCapacity(1500.0)
				.vehicleType(VehicleType.AMBULANCE).company(medCompany)
				.build());

		VehicleEntity volvo = vehicleRepository.save(VehicleEntity.builder()
				.brand("Volvo").model("FH16").licensePlate("CB4567KH")
				.imageURL("https://blog.truckscout24.com/de/wp-content/uploads/2013/10/Volvo-FH16-750-19-fotoshowImageNew-58e110e5-80060.jpg")
				.airConditioning(true).numberOfSeats(2).trunkCapacity(5000.0)
				.vehicleType(VehicleType.SEMI)
				.build());

		VehicleEntity octavia = vehicleRepository.save(VehicleEntity.builder()
				.brand("Skoda").model("Octavia").licensePlate("CB5678MT")
				.imageURL("https://upload.wikimedia.org/wikipedia/commons/0/05/Octavia_taxi_chisinau_004.jpg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(530.0)
				.vehicleType(VehicleType.TAXI).company(fleetCompany)
				.build());

		VehicleEntity passat = vehicleRepository.save(VehicleEntity.builder()
				.brand("Volkswagen").model("Passat").licensePlate("CB6789TX")
				.imageURL("https://www.dalamanairporttaxi.com/en/img-page/340-volkswagen-passat.jpg")
				.airConditioning(true).numberOfSeats(5).trunkCapacity(480.0)
				.vehicleType(VehicleType.TAXI).company(fleetCompany)
				.build());

		// Drivers
		DriverEntity michael = driverRepository.save(DriverEntity.builder()
				.firstName("Michael").lastName("Johnson")
				.phoneNumber("+359888100100")
				.expertiseType(ExpertiseType.B).available(true)
				.imageUrl("https://i.redd.it/oufits-goku-kid-v0-8utkgtut35xg1.jpg?width=736&format=pjpg&auto=webp&s=ff7228651faae2febec4a09148e33ed62f7c20a9")
				.company(fleetCompany).vehicles(Set.of(camry, crv))
				.build());

		DriverEntity sarah = driverRepository.save(DriverEntity.builder()
				.firstName("Sarah").lastName("Williams")
				.phoneNumber("+359888100101")
				.expertiseType(ExpertiseType.B).available(true)
				.company(fleetCompany).vehicles(Set.of(octavia))
				.build());

		DriverEntity david = driverRepository.save(DriverEntity.builder()
				.firstName("David").lastName("Brown")
				.phoneNumber("+359888100102")
				.expertiseType(ExpertiseType.C).available(true)
				.vehicles(Set.of(volvo))
				.build());

		DriverEntity emily = driverRepository.save(DriverEntity.builder()
				.firstName("Emily").lastName("Davis")
				.phoneNumber("+359888100103")
				.expertiseType(ExpertiseType.CE).available(false)
				.company(medCompany).vehicles(Set.of(sprinter))
				.build());

		DriverEntity robert = driverRepository.save(DriverEntity.builder()
				.firstName("Robert").lastName("Miller")
				.phoneNumber("+359888100104")
				.expertiseType(ExpertiseType.B).available(true)
				.company(fleetCompany).vehicles(Set.of(passat))
				.build());

		// Orders
		LocalDateTime now = LocalDateTime.now();

		OrderEntity order1 = orderRepository.save(OrderEntity.builder()
				.user(john).driver(michael).vehicle(camry).vehicleType(VehicleType.TAXI)
				.pickupAddress("123 Main St, Sofia").pickupLatitude(42.6977).pickupLongitude(23.3219)
				.dropoffAddress("456 Oak Ave, Sofia").dropoffLatitude(42.7105).dropoffLongitude(23.3238)
				.status(OrderStatus.COMPLETED).estimatedPrice(15.50).finalPrice(16.00)
				.distanceKm(5.2).estimatedDurationMinutes(15)
				.createdAt(now.minusDays(7)).updatedAt(now.minusDays(7))
				.build());

		OrderEntity order2 = orderRepository.save(OrderEntity.builder()
				.user(john).driver(sarah).vehicle(octavia).vehicleType(VehicleType.TAXI)
				.pickupAddress("789 Pine Rd, Sofia").pickupLatitude(42.6850).pickupLongitude(23.3150)
				.dropoffAddress("321 Elm St, Sofia").dropoffLatitude(42.7000).dropoffLongitude(23.3400)
				.status(OrderStatus.COMPLETED).estimatedPrice(35.00).finalPrice(38.50)
				.distanceKm(8.7).estimatedDurationMinutes(22)
				.createdAt(now.minusDays(3)).updatedAt(now.minusDays(3))
				.build());

		OrderEntity order3 = orderRepository.save(OrderEntity.builder()
				.user(jane).driver(michael).vehicle(crv).vehicleType(VehicleType.TAXI)
				.pickupAddress("555 Cedar Ln, Sofia").pickupLatitude(42.7100).pickupLongitude(23.2900)
				.dropoffAddress("777 Birch Dr, Sofia").dropoffLatitude(42.6800).dropoffLongitude(23.3500)
				.status(OrderStatus.COMPLETED).estimatedPrice(22.00).finalPrice(22.00)
				.distanceKm(6.8).estimatedDurationMinutes(18)
				.createdAt(now.minusDays(1)).updatedAt(now.minusDays(1))
				.build());

		orderRepository.save(OrderEntity.builder()
				.user(jane).vehicleType(VehicleType.TAXI)
				.pickupAddress("999 Maple Way, Sofia").pickupLatitude(42.6900).pickupLongitude(23.3100)
				.dropoffAddress("111 Spruce Ct, Sofia").dropoffLatitude(42.7200).dropoffLongitude(23.3300)
				.status(OrderStatus.CREATED).estimatedPrice(18.00)
				.distanceKm(4.5).estimatedDurationMinutes(12)
				.createdAt(now).updatedAt(now)
				.build());

		paymentRepository.save(PaymentEntity.builder()
				.order(order1).amount(16.00).paymentMethod(PaymentMethod.CREDIT_CARD)
				.status(PaymentStatus.COMPLETED).transactionId("TXN-001-2024").currency("EUR")
				.build());

		paymentRepository.save(PaymentEntity.builder()
				.order(order2).amount(38.50).paymentMethod(PaymentMethod.DEBIT_CARD)
				.status(PaymentStatus.COMPLETED).transactionId("TXN-002-2024").currency("EUR")
				.build());

		paymentRepository.save(PaymentEntity.builder()
				.order(order3).amount(22.00).paymentMethod(PaymentMethod.CASH)
				.status(PaymentStatus.COMPLETED).currency("EUR")
				.build());

		ratingRepository.save(RatingEntity.builder()
				.order(order1).rating(5)
				.comment("Excellent service! Driver was very professional and the car was clean.")
				.build());

		ratingRepository.save(RatingEntity.builder()
				.order(order2).rating(4)
				.comment("Great experience, arrived on time.")
				.build());

		ratingRepository.save(RatingEntity.builder()
				.order(order3).rating(5)
				.comment("Very comfortable ride, would recommend!")
				.build());
	}
}
