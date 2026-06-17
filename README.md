# AutoNow

**AutoNow** is a SaaS marketplace that connects people who need on-demand transport with the companies that operate the vehicles to provide it. It covers the full long tail of "I need a vehicle and a driver, now" — private ambulances for non-emergency medical transfers, taxis for everyday rides, funeral transport, freight and logistics, moving trucks, and celebration vehicles for weddings and events.

The platform is built around two sides of the same market:

- **For customers** — a single place to discover available services in their area, compare companies, book a vehicle for a specific pickup and drop-off, pay for the order, track its lifecycle from request to completion, and rate the experience afterwards.
- **For companies** — a self-serve back office to register the business, onboard drivers (with their license categories) and vehicles, define their own pricing rules, and manage incoming orders end-to-end. Each company is an isolated tenant with its own fleet, staff, and pricing configuration.

Under the hood, AutoNow models the real workflow these businesses run today: an order is created, accepted by a company, assigned to a driver and vehicle, moves through *in progress*, and ends in *completed* or *cancelled* — with payments and ratings hanging off the completed orders. Authentication is shared across web and mobile via JWT, and access is gated by four roles (Customer, Driver, Company Admin, Admin) so each user only sees what they should.

> Diploma project — full stack: Spring Boot 4 backend, React 19 web dashboard for companies and admins, and a React Native (Expo) mobile app for customers and drivers on the road.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [Getting Started](#getting-started)
  - [Backend](#backend)
  - [Web frontend](#web-frontend)
  - [Mobile app](#mobile-app-react-native--expo)
- [API Overview](#api-overview)
- [Authentication & Roles](#authentication--roles)
- [Testing](#testing)
- [CI/CD](#cicd)
- [License](#license)

---

## Features

- **Multi-service marketplace** — taxi, ambulance, logistics, moving, and rental companies
- **Company registration** — businesses register, add drivers and vehicles, and manage their fleet
- **Per-company pricing** — each company defines its own pricing configuration
- **Order lifecycle** — full workflow: created, accepted, in progress, completed, or cancelled
- **Payments** — track payments per order with status management (pending, completed, failed, refunded)
- **Ratings & reviews** — customers rate completed orders (1–5 stars with optional comment)
- **Role-based access** — Admin, Customer, Driver, and Company Admin roles with fine-grained permissions
- **JWT authentication** — stateless, token-based security shared across web and mobile
- **API documentation** — auto-generated OpenAPI/Swagger spec
- **Cross-platform clients** — React 19 web dashboard and React Native (Expo) mobile app

---

## Tech Stack

### Backend

| Layer            | Technology                                |
|------------------|-------------------------------------------|
| Language         | Java 21                                   |
| Framework        | Spring Boot 4.0                           |
| Security         | Spring Security + JWT (Auth0 java-jwt)    |
| Database         | PostgreSQL 18                             |
| ORM              | Spring Data JPA / Hibernate               |
| DTO Mapping      | MapStruct 1.6                             |
| API Docs         | SpringDoc OpenAPI 3.0                     |
| Build            | Maven (with Maven Wrapper)                |
| Containerization | Docker + Docker Compose                   |
| Code Quality     | JaCoCo, SonarQube                         |
| CI/CD            | GitHub Actions                            |
| Testing          | JUnit 5, Spring Boot Test, H2 (in-memory) |

### Web frontend

| Layer        | Technology                              |
|--------------|-----------------------------------------|
| Framework    | React 19                                |
| Build tool   | Vite 8                                  |
| Language     | TypeScript                              |
| Styling      | TailwindCSS 4 + Flowbite React          |
| Routing      | React Router 7                          |
| Data         | TanStack Query, Axios                   |
| Media        | Cloudinary (`@cloudinary/react`)        |
| Testing      | Vitest, Testing Library, jsdom          |

### Mobile app

| Layer         | Technology                                       |
|---------------|--------------------------------------------------|
| Framework     | React Native 0.81 (Expo SDK 54)                  |
| Language      | TypeScript                                       |
| Navigation    | React Navigation 7 (native stack)                |
| UI            | React Native Paper                               |
| Maps          | `@rnmapbox/maps` + `mapbox-gl`                   |
| State / API   | Axios, AsyncStorage, Expo SecureStore            |
| i18n          | i18next + react-i18next + expo-localization      |
| Testing       | Jest + jest-expo + Testing Library (RN)          |

---

## Repository Layout

```
AutoNow/
├── backend/                     # Spring Boot REST API
│   └── src/main/java/com/angel/autonow/
│       ├── company/             # Company management + per-company pricing
│       ├── driver/              # Driver management
│       ├── vehicle/             # Vehicle/fleet management
│       ├── order/               # Order lifecycle
│       ├── payment/             # Payment processing
│       ├── rating/              # Ratings & reviews
│       ├── user/                # User accounts & roles
│       ├── security/            # JWT auth & authorization
│       ├── expertise/           # Driver license categories
│       └── exception/           # Global error handling
├── web/                         # React 19 + Vite web dashboard
│   └── src/
│       ├── components/{domain}/ # UI components grouped by domain
│       ├── contexts/            # React contexts (AuthContext)
│       ├── hooks/               # One hook per domain (useCompanies, ...)
│       ├── pages/               # Route-level pages
│       └── services/            # apiClient + per-domain service modules
├── frontend/                    # React Native (Expo) mobile app
│   └── src/
│       ├── components/{domain}/ # Body.tsx + Body.style.tsx pairs
│       ├── screens/{domain}/    # Screen.tsx + Screen.style.tsx pairs
│       ├── navigation/          # React Navigation setup
│       ├── hooks/               # Custom hooks
│       ├── services/            # API client + domain services
│       ├── config/              # i18n, env config
│       ├── constants/           # Theme, enums
│       ├── types/               # Shared TypeScript interfaces
│       └── utils/               # Helper functions
├── docs/                        # Generated OpenAPI spec + Swagger UI
├── .github/workflows/           # CI/CD pipelines
└── compose.yaml                 # Docker Compose (PostgreSQL)
```

Each backend domain follows a consistent structure: **Entity, Repository, Service, Controller, DTOs (Request/Response), Mapper, optional Type enum.**

---

## Getting Started

### Prerequisites

- Java 21+
- Node.js 20+ and npm
- Docker & Docker Compose
- Maven 3.9+ (or use the included `mvnw` wrapper)
- For mobile: Android Studio (for Android emulator) or Xcode (for iOS), and the Expo Go app on a physical device

### 1. Start the database

```bash
docker compose up -d
```

PostgreSQL 18 starts on port `5432`.

### Backend

#### Configure environment

Create a `.env` file in the project root (or set environment variables):

```env
JWT_SECRET=your-secret-key
JWT_ALGORITHM=HS256
JWT_EXPIRATION=3600000
DB_URL=jdbc:postgresql://localhost:5432/autoNow
DB_USERNAME=postgres
DB_PASSWORD=12345
```

> Note: pricing is **per-company** and stored in `company_pricing`. Do not put pricing values in `application.properties`.

#### Run

```bash
cd backend
./mvnw spring-boot:run
```

The API starts on **http://localhost:8081**.

#### API documentation

OpenAPI spec is at [`docs/openapi.yaml`](docs/openapi.yaml). Open [`docs/index.html`](docs/index.html) for the Swagger UI.

### Web frontend

```bash
cd web
npm install
npm run dev
```

Runs on **http://localhost:3000** and proxies API calls to the backend on `:8081`.

Build for production:

```bash
npm run build && npm run preview
```

### Mobile app (React Native / Expo)

```bash
cd frontend
npm install
npx expo start
```

The backend URL the app talks to is configured in `frontend/app.json` under `expo.extra.apiUrl`. Update it to your machine's LAN IP (default looks like `http://192.168.1.11:8080/`) when developing against a physical device over Wi-Fi.

#### Running on a physical Android device behind a restrictive firewall

The standard `npx expo start` requires the phone to reach Metro on port `8081` over Wi-Fi. On a managed Mac where the firewall blocks incoming connections, use USB reverse-forwarding instead:

1. Connect the Android device via USB and enable USB debugging.
2. Forward Metro and the Expo manifest port through the cable:
   ```bash
   adb reverse tcp:8081 tcp:8081
   adb reverse tcp:19000 tcp:19000
   ```
3. Start Metro advertising `localhost` (the phone resolves it through the USB tunnel):
   ```bash
   npx expo start --host localhost
   ```
4. Scan the QR code in Expo Go.

> Do not use `--tunnel` (ngrok not permitted on managed machines) or `--host lan` (blocked by the firewall).
> The backend API URL in `frontend/app.json` stays as the LAN IP — the backend itself is reached over Wi-Fi and is not affected by the firewall rule.

---

## API Overview

All endpoints are prefixed with `/api` and require JWT authentication unless noted.

| Resource       | Endpoint              | Key Operations                              |
|----------------|-----------------------|---------------------------------------------|
| Auth           | `/api/auth`           | Register, login                             |
| Companies      | `/api/companies`      | CRUD, join a company, pricing config        |
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

AutoNow uses **JWT tokens** with role-based access control. The same tokens are consumed by both the web dashboard and the mobile app.

| Role            | Description                                              |
|-----------------|----------------------------------------------------------|
| `CUSTOMER`      | Default role — book orders, make payments, leave ratings |
| `DRIVER`        | View assigned orders and ratings                         |
| `COMPANY_ADMIN` | Manage company drivers, vehicles, and pricing            |
| `ADMIN`         | Full system access                                       |

Passwords are stored with **BCrypt** encryption. Tokens expire after 1 hour by default.

On the web client, tokens live in `localStorage` and are attached by the Axios interceptor in `web/src/services/apiClient.ts`. On mobile they live in **Expo SecureStore**.

---

## Testing

Every change must include tests. Run them and confirm they pass before reporting a task as complete.

### Backend

```bash
cd backend

# All tests
./mvnw test

# Unit tests only
./mvnw test -Dtest='!*IT'

# Integration tests only (use H2 in-memory DB — no Docker required)
./mvnw test -Dtest='*IT'

# Single test class
./mvnw test -Dtest=CompanyServiceTest
```

### Web

```bash
cd web

# All tests
npx vitest run

# Single file
npx vitest run src/hooks/__tests__/useCompanies.test.ts

# Watch mode
npm run test:watch
```

### Mobile

```bash
cd frontend

# All tests
npm test

# CI mode
npm run test:ci
```

---

## CI/CD

Three GitHub Actions workflows automate quality and delivery:

| Workflow              | Trigger           | Purpose                                       |
|-----------------------|-------------------|-----------------------------------------------|
| `test.yml`            | Push / PR to main | Runs unit and integration tests               |
| `build.yml`           | Push / PR to main | Builds, runs JaCoCo coverage, SonarQube scan  |
| `publish-api-docs.yml`| Push to main      | Generates OpenAPI spec and creates a docs PR  |

---

## License

This project was built as a diploma thesis and is not currently licensed for redistribution.
