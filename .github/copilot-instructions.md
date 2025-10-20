# Copilot instructions for cms-backend

- Goal: Help contributors and AI agents implement and modify the multi-company recruitment backend (Node + TypeScript + Prisma).

- Big picture

  - Express-based REST API. App bootstrapping: `src/app.ts` wires routes and middleware, `src/server.ts` starts the server.
  - Data access via Prisma client located at `src/Config/prisma.ts`. Prisma schema is in `prisma/schema.prisma` (Postgres datasource via env var `DATABASE_URL`).
  - Routes are under `src/api/Routes/*` and map 1:1 to controllers in `src/api/Controllers/*` which call Prisma directly for DB operations.
  - Middlewares live in `src/api/Middlewares/*` (authentication, permission checks, validation, file uploads).
  - Utilities and helpers are in `src/Utils/*` and `src/Services/*` for logic like token generation, hashing, mail, error handling.

- Build / run / dev

  - Development: use `npm run dev` (invokes `nodemon src/server.ts`). The project uses `ts-node` to run TypeScript directly.
  - Prisma seed: `npm run seed` runs `ts-node prisma/seed.ts`.
  - TypeScript compile output configured to `./dist` (see `tsconfig.json`) but no `build` script is provided; add one if you need to compile to JS for production.
  - Environment: important env vars include `DATABASE_URL` and any SMTP or JWT secrets used in `src/Config/index.ts` (inspect this file before making changes).

- Conventions and patterns

  - Folder-by-feature: each resource has `Routes`, `Controllers`, `Middlewares` and `Validators` grouped under `src/api`.
  - Controllers return express Request/Response handlers named `view*` (e.g., `viewCreateJob`, `viewCompanyJob` in `src/api/Controllers/job.ts`). Follow the same naming to remain consistent.
  - Controllers directly use Prisma client (`import prisma from '../../Config/prisma'`)—no separate repository layer exists. Keep Prisma calls concise and prefer `select`/`where` clauses to avoid over-fetching.
  - Soft deletes: many models use `isDeleted` boolean. Prefer updating `isDeleted: true` instead of physical deletes unless adding a migration.
  - Permissions: `hasPermission` middleware expects permission codename strings (e.g., `view_company_job`, `add_company_job`). Look at `src/api/Middlewares/permission.ts` to match expected usage.
  - Validation: Zod schemas live in `src/Validators/validations.ts`. Routes frequently call `validate(schema)` middleware.

- Common tasks & examples

  - Add an API route: add route file in `src/api/Routes/`, import its router in `src/app.ts`, and implement controller in `src/api/Controllers/` using `prisma` client. Protect with `isAuthenticated` and `hasPermission` where needed.
  - Read-only public endpoints: endpoints that are open (e.g., `GET /api/job/published`) are mounted without `isAuthenticated` in `src/api/Routes/job.ts`.
  - Pagination: controllers commonly read `page` and `limit` from `req.query` and compute `skip = (page-1)*limit` before calling `prisma.findMany({ skip, take: limit })`.
  - Creating relations: when creating related records (e.g., Job -> Department), controllers often `findFirst` the related record first and then use its id in create data (see `viewCreateJob`).

- Testing & linters

  - No test framework or linter configured in repo. If you add tests, prefer Jest or Vitest and run them via a new `npm run test` script.

- Database and migrations

  - Prisma migrations exist under `prisma/migrations`. Use `npx prisma migrate dev` locally to apply changes; the project has `prisma` and `@prisma/client` in package.json.
  - Seeding is `prisma/seed.ts` and is run with `npm run seed`.

- Troubleshooting & debugging

  - Common runtime entrypoints: `src/server.ts` (starts server) and `src/app.ts` (Express wiring). To debug, run `npm run dev` and attach debugger to the running `ts-node` process.
  - If you change Prisma schema, run `npx prisma generate` and then `npx prisma migrate dev` (or run through VS Code task if you add one).

- What to avoid

  - Don't bypass `isDeleted` checks: many controllers expect soft-delete semantics and filtering by `isDeleted: false`.
  - Avoid adding heavy business logic into route files; follow existing controllers + service/util split (put reusable logic into `src/Services/*` or `src/Utils/*`).

- Files to inspect when altering behavior
  - `src/app.ts` — routing and middleware ordering
  - `src/server.ts` — startup, logger
  - `src/Config/prisma.ts` and `prisma/schema.prisma` — DB client and models
  - `src/api/Controllers/*` — business logic and DB calls
  - `src/api/Middlewares/*` — auth and permission enforcement
  - `src/Validators/validations.ts` — request schemas

If anything is unclear or you'd like more examples (tests, PR checklist, or CI setup), tell me which area to expand and I'll iterate.
