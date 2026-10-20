# Gesta project guidelines

## Build, test, and lint

Run commands from the repository root. The project requires Node.js `>=22.14.0` and
uses npm workspaces for `backend` and `frontend`.

```bash
npm ci
npm run setup
npm run dev
```

Common validation commands:

```bash
npm run lint       # Oxlint, warnings are errors
npm run typecheck  # TypeScript checks for both workspaces
npm test           # Vitest suites for both workspaces
npm run build      # Compile backend and build frontend
npm run check      # lint + typecheck + test + build
```

Run one workspace or one test file with the workspace selector:

```bash
npm run test -w backend -- tests/offers.test.ts
npm run test -w frontend -- tests/CompaniesPage.test.tsx
```

Use Vitest's name filter to run one test case:

```bash
npm run test -w backend -- tests/auth.test.ts -t "relit les rôles en base"
npm run test -w frontend -- tests/App.test.tsx -t "ouvre une session"
```

`npm run setup` creates `backend/.env` and initializes the local SQLite database.
Stop the dev server before `npm run db:reset`. The API listens on port 3000 by
default (`API_PORT`), and Vite serves the frontend on port 5173.

## Architecture

Gesta is a React/Vite frontend backed by an Express/TypeScript API and a local
SQLite database accessed through `better-sqlite3`. Vite proxies `/api/...` to the
backend and removes the `/api` prefix.

The backend is assembled in `backend/src/app.ts` using dependency factories:

```text
HTTP request
  -> middleware (authentication/authorization)
  -> controller (HTTP validation and response)
  -> service (business rules)
  -> repository (SQL)
  -> SQLite
```

Repositories return database objects, mappers convert database objects to domain
objects and API DTOs, and controllers must not contain business rules. Services
must not depend on Express `Request` or `Response`. `HttpError` is thrown for
expected failures and `errorHandler` serializes errors as
`{ "error": { "code", "message" } }`.

The frontend follows the course's MVVM structure:

```text
pages -> hooks -> services/utils -> models
  pages -> reusable components
```

`App.tsx` is the single owner of `useAuth`; it supplies the session token and
logout callback to pages. Frontend services call `/api`, validate response JSON
with type guards, and hooks turn API results into display state. A 401 should
invoke the supplied unauthorized callback so the user returns to login.

The main cross-layer examples are the companies flow and offers flow. Follow the
existing matching controller, service, repository, mapper, frontend service,
hook, page, and test files when adding a related feature. See
[`docs/architecture.md`](../docs/architecture.md) for the complete map and
[`backend/API.md`](../backend/API.md) for the public API contract.

## Repository conventions

- Backend relative imports include the `.ts` extension. TypeScript rewrites these
  to `.js` in the compiled output; preserve this convention.
- Keep authentication and authorization server-side. JWTs contain only `kind` and
  `id`; `authenticate` reloads the account, roles, and company relationships from
  SQLite on every request. Use named permission functions in
  `backend/src/services/permissions.ts` and `authorize(...)` middleware for route
  access.
- The demo login is intentionally development-only. Do not weaken the guard that
  rejects `DEMO_AUTH_ENABLED=true` when `NODE_ENV=production`.
- Use the raw `Authorization` header token without a `Bearer` prefix, matching the
  current API and frontend storage behavior.
- Keep API status/error shapes stable. Validate query parameters and request bodies
  in controllers; use `HttpError(status, code, message)` for expected errors.
- Add database schema changes as a new, numerically ordered SQL file in
  `backend/src/db/migrations/`; never edit an already-applied migration.
  SQLite enforces structural constraints, while services enforce permissions and
  other business rules.
- Persist status values as English codes (for example `PUBLISHED`, `ACTIVE`,
  `P1`), and translate them to French labels in the frontend utilities.
- Backend API tests use Vitest and Supertest with an isolated in-memory SQLite
  database created by `tests/helpers/testApp.ts`; do not use the development
  database in tests. Seed identifiers in `backend/src/db/seed/seedIds.ts` are the
  stable references for fixtures.
- Frontend tests use Vitest, Testing Library, and `tests/helpers/fetchMock.ts` to
  stub API responses. Keep tests at the page/component boundary and use the same
  API payload shapes as the type guards.
- Keep the documented project scope and business rules in
  [`docs/cdc_gesta_developpement.md`](../docs/cdc_gesta_developpement.md) and
  [`README.md`](../README.md) authoritative when implementing new workflows.
