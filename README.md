# AutoNow

**AutoNow** is a SaaS platform for renting auto services — private ambulances, taxis, funeral transport, logistics, moving, and more. Customers can browse and book services, while companies can register and offer their fleet through the platform.

> Diploma project — built with Java 21, Spring Boot 4, and PostgreSQL.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Authentication & Roles](#authentication--roles)
- [Testing](#testing)
- [CI/CD](#cicd)
- [License](#license)

---

## Features

- **Multi-service marketplace** — supports taxi, ambulance, logistics, moving, and rental companies
- **Company registration** — businesses register, add drivers and vehicles, and manage their fleet
- **Order lifecycle** — full workflow: created, accepted, in progress, completed, or cancelled
- **Payments** — track payments per order with status management (pending, completed, failed, refunded)
- **Ratings & reviews** — customers rate completed orders (1-5 stars with optional comment)
- **Role-based access** — Admin, Customer, Driver, and Company Admin roles with fine-grained permissions
- **JWT authentication** — stateless, token-based security
- **API documentation** — auto-generated OpenAPI/Swagger spec

---

## Tech Stack

| Layer            | Technology                                      |
|------------------|------------------------------------------------|
| Language         | Java 21                                         |
| Framework        | Spring Boot 4.0                                 |
| Security         | Spring Security + JWT (Auth0 java-jwt)          |
| Database         | PostgreSQL 18                                   |
| ORM              | Spring Data JPA / Hibernate                     |
| DTO Mapping      | MapStruct 1.6                                   |
| API Docs         | SpringDoc OpenAPI 3.0                           |
| Build            | Maven (with Maven Wrapper)                      |
| Containerization | Docker + Docker Compose                         |
| Code Quality     | JaCoCo, SonarQube                               |
| CI/CD            | GitHub Actions                                  |
| Testing          | JUnit 5, Spring Boot Test, H2 (in-memory)      |

---

## Architecture

```
AutoNow/
├── backend/                     # Spring Boot REST API
│   └── src/main/java/com/angel/autonow/
│       ├── company/             # Company management
│       ├── driver/              # Driver management
│       ├── vehicle/             # Vehicle/fleet management
│       ├── order/               # Order lifecycle
│       ├── payment/             # Payment processing
│       ├── rating/              # Ratings & reviews
│       ├── user/                # User accounts & roles
│       ├── security/            # JWT auth & authorization
│       ├── expertise/           # Driver license categories
│       └── exception/           # Global error handling
├── docs/                        # Generated OpenAPI spec + Swagger UI
├── .github/workflows/           # CI/CD pipelines
└── compose.yaml                 # Docker Compose (PostgreSQL)
```

Each domain module follows a consistent structure: **Entity, Repository, Service, Controller, DTOs (Request/Response), Mapper**.

---

## Getting Started

### Prerequisites

- Java 21+
- Docker & Docker Compose
- Maven 3.9+ (or use the included `mvnw` wrapper)

### 1. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 18 instance on port `5432`.

### 2. Configure environment

Create a `.env` file in the project root (or set environment variables):

```env
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600000
DB_URL=jdbc:postgresql://localhost:5432/autoNow
DB_USERNAME=postgres
DB_PASSWORD=12345
```

### Mobile app (React Native / Expo)

```bash
cd frontend
npm install
npx expo start --host localhost   # see "Running on a physical Android device" below
```

#### Running on a physical Android device

The standard `npx expo start` requires the phone to reach Metro on port 8081 over Wi-Fi. On a managed Mac where the firewall blocks incoming connections and cannot be modified, use USB forwarding instead:

1. Connect the Android device via USB and enable USB debugging.
2. Forward Metro and the Expo manifest port through the USB cable:
   ```bash
   adb reverse tcp:8081 tcp:8081
   adb reverse tcp:19000 tcp:19000
   ```
3. Start Metro advertising `localhost` (the phone resolves this through the USB tunnel):
   ```bash
   cd frontend && npx expo start --host localhost
   ```
4. Scan the QR code in Expo Go.

> **Note:** Do not use `--tunnel` (ngrok not permitted on managed machines) or `--host lan` (blocked by the firewall).
> The backend API URL in `frontend/app.json` stays as `http://192.168.1.11:8080/` — the backend is reached over Wi-Fi and is not affected by the firewall rule.

---



The API starts on **http://localhost:8081**.

### 4. View API documentation

OpenAPI spec is available in [`docs/openapi.yaml`](docs/openapi.yaml). You can also open [`docs/index.html`](docs/index.html) for the Swagger UI.

---

## API Overview

All endpoints are prefixed with `/api` and require JWT authentication unless noted.

| Resource       | Endpoint              | Key Operations                              |
|----------------|-----------------------|---------------------------------------------|
| Auth           | `/api/auth`           | Register, login                             |
| Companies      | `/api/companies`      | CRUD, join a company                        |
| Drivers        | `/api/drivers`        | CRUD, search by license, filter by company  |
| Vehicles       | `/api/vehicles`       | CRUD, filter by company                     |
| Orders         | `/api/orders`         | CRUD, filter by user, full status lifecycle |
| Payments       | `/api/payments`       | CRUD, lookup by order                       |
| Ratings        | `/api/ratings`        | CRUD, lookup by order                       |

### Example: Register and create an order

```bash
# Register a new customer
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "secret123"}'

# Login to get a JWT token
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "secret123"}' | jq -r '.token')

# Create an order
curl -X POST http://localhost:8081/api/orders \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "pickupAddress": "123 Main St",
    "dropoffAddress": "456 Oak Ave",
    "vehicleType": "TAXI",
    "specialRequirements": "Need child seat"
  }'
```

---

## Authentication & Roles

AutoNow uses **JWT tokens** with role-based access control:

| Role            | Description                                             |
|-----------------|---------------------------------------------------------|
| `CUSTOMER`      | Default role — book orders, make payments, leave ratings |
| `DRIVER`        | View assigned orders and ratings                        |
| `COMPANY_ADMIN` | Manage company drivers, vehicles, and settings          |
| `ADMIN`         | Full system access                                      |

Passwords are stored with **BCrypt** encryption. Tokens expire after 1 hour by default.

---

## Testing

The project has both unit and integration tests:

```bash
# Run all tests
cd backend
./mvnw test

# Run only unit tests
./mvnw test -Dtest='!*IT'

# Run only integration tests
./mvnw test -Dtest='*IT'
```

Tests use an **H2 in-memory database** — no external services required.

---

## CI/CD

Three GitHub Actions workflows automate quality and delivery:

| Workflow              | Trigger          | Purpose                                       |
|-----------------------|------------------|-----------------------------------------------|
| `test.yml`            | Push / PR to main | Runs unit and integration tests               |
| `build.yml`           | Push / PR to main | Builds, runs JaCoCo coverage, SonarQube scan  |
| `publish-api-docs.yml`| Push to main     | Generates OpenAPI spec and creates a docs PR   |

---

## License

This project was built as a diploma thesis and is not currently licensed for redistribution.
