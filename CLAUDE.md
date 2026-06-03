# CLAUDE.md

## Project Overview

AutoNow is a SaaS platform for renting auto services (taxi, ambulance, logistics, etc.). Backend is Spring Boot 4 + Java 21 + PostgreSQL. Web frontend is React 19 + Vite + TypeScript + TailwindCSS. Mobile frontend is React Native (Expo).

## Code Rules

### Priority: Backend First

When working on features or fixes, prioritize the backend (Spring Boot) over the frontend. The backend is the source of truth — define entities, DTOs, validation, and business logic there first, then build the frontend to match. When making decisions about data shape, validation rules, or behavior, defer to what the backend requires.

### TypeScript — No `any`

Never use `any` in component props, hook state, or service methods. Always define and export typed interfaces. When backend DTOs exist, mirror their fields in the frontend type.

- Props: define an interface with concrete field types
- Hooks: type all `useState` generics explicitly (e.g., `useState<Company[]>([])`)
- Services: define payload interfaces for create/update methods

### ID Type Consistency

The backend uses `Long` (number) for entity IDs. Hooks and components must use `number | null` for selected IDs. Only convert to `string` at the service layer boundary (URL path params). Never use `String()` in components for ID comparisons.

### Accessibility

- Interactive elements must be keyboard-accessible. Use `<button>` (not `<div onClick>`) for clickable items.
- Form inputs must have associated `<label>` elements with `htmlFor`/`id` linkage.
- Error containers must include `role="alert"` and `aria-live="assertive"`.
- Selection state on buttons should use `aria-pressed` or `aria-current`.

### Auth & API Client

- Never mutate `axios.defaults.headers.common`. Use the `apiClient` interceptor (reads token from `localStorage`).
- The single source of truth for API calls is `src/services/apiClient.ts`. Do not create duplicate axios instances.
- JWT decoding must validate format (3 parts) and check required claims before using them.

### ESM Compatibility

This project uses `"type": "module"`. In config files (vite.config.ts, etc.), never use bare `__dirname` or `__filename`. Define them explicitly:

```ts
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
```

### React Patterns

- Use `import type { ReactNode }` instead of `React.ReactNode` (the project uses `jsx: "react-jsx"` and `verbatimModuleSyntax: true`).
- Shared interfaces (Company, Driver, Vehicle) are exported from their primary component file and imported where needed — don't redefine them.

## Project Structure

### Backend (`backend/`)

Domain-driven package structure. Each domain module contains the same set of files:

```
backend/src/main/java/com/angel/autonow/{domain}/
├── {Domain}Entity.java        # JPA entity
├── {Domain}Repository.java    # Spring Data JPA repository
├── {Domain}Service.java       # Business logic
├── {Domain}Controller.java    # REST controller (prefixed /api/{domain}s)
├── {Domain}RequestDTO.java    # Inbound payload (validated with Jakarta)
├── {Domain}ResponseDTO.java   # Outbound payload (Java record with @Builder)
├── {Domain}Mapper.java        # MapStruct mapper (Entity <-> DTO)
└── {Domain}Type.java          # Enum (if applicable)
```

When adding a new domain, follow this exact structure. All domain packages live flat under `com.angel.autonow`.

### Web Frontend (`web/src/`)

```
web/src/
├── components/{domain}/       # UI components grouped by domain
│   ├── {Domain}Info.tsx       # Detail/display component (exports the domain interface)
│   ├── {Domain}List.tsx       # List component
│   └── ...
├── contexts/                  # React contexts (AuthContext)
├── hooks/                     # Custom hooks (use{Domain}.ts) — one per domain
├── pages/                     # Route-level page components
├── services/
│   ├── apiClient.ts           # Singleton axios instance with interceptors
│   └── {domain}/
│       └── {domain}Service.ts # API methods + payload interfaces for one domain
└── assets/
```

Rules:
- One hook per domain (`useCompanies.ts`, `useDrivers.ts`) — handles fetching, selection, and state
- One service file per domain — exports payload interfaces and CRUD methods
- Interfaces for response types are exported from the primary component (e.g., `Company` from `CompanyInfo.tsx`)
- Pages compose components and hooks; they don't contain business logic or direct API calls
- Components receive typed props — no internal fetching; data comes from hooks via pages

### Mobile Frontend (`frontend/src/`)

```
frontend/src/
├── components/{domain}/       # Styled components (Body.tsx + Body.style.tsx)
├── screens/{domain}/          # Screen components (Screen.tsx + Screen.style.tsx)
├── navigation/                # React Navigation setup
├── hooks/                     # Custom hooks
├── services/                  # API client + domain services
├── config/                    # i18n, env config
├── constants/                 # Theme, enums
├── types/                     # Shared TypeScript interfaces
└── utils/                     # Helper functions
```

## Build & Run

```bash
# Backend
cd backend && ./mvnw spring-boot:run

# Web frontend
cd web && npm install && npm run dev  # port 3000

# Database
docker compose up -d  # PostgreSQL on port 5432
```

## Testing

Every change must include tests. Write tests before reporting a task as complete, and run them to confirm they pass.

### Rules

- **Backend**: Every new or modified Service/Controller must have corresponding unit and/or integration tests. Run `cd backend && ./mvnw test` after changes and confirm all tests pass.
- **Web frontend**: Every new or modified hook, service, or component with logic must have a test file. Run `cd web && npm test` (or `npx vitest run`) after changes and confirm all tests pass.
- **Do not skip tests**. If a test fails, fix the code or the test — never leave failing tests.
- **Test naming**: backend tests go in `src/test/java` mirroring the main package structure. Frontend tests go in a `__tests__/` subdirectory next to the source file (e.g., `src/hooks/__tests__/useCompanies.test.ts` for `src/hooks/useCompanies.ts`).
- **Integration tests**: backend integration test classes end with `IT` (e.g., `CompanyControllerIT.java`). They use H2 in-memory DB — no Docker needed.
- **What to test**:
  - Services: business logic, edge cases, error paths
  - Controllers: request/response mapping, status codes, validation errors
  - Hooks: state transitions, API call behavior (mock the service)
  - Utilities (JWT decode, etc.): happy path + malformed input

### Commands

```bash
# Backend — all tests
cd backend && ./mvnw test

# Backend — single test class
cd backend && ./mvnw test -Dtest=CompanyServiceTest

# Web frontend — all tests
cd web && npx vitest run

# Web frontend — single file
cd web && npx vitest run src/hooks/__tests__/useCompanies.test.ts
```
