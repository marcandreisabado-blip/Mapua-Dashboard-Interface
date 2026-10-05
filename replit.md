# Mapúa Findr

A campus lost-and-found board for reporting and finding publicly shareable found-item listings.

## Run & Operate

- `pnpm --filter @workspace/mapua-findr run dev` — run the web app
- `pnpm --filter @workspace/api-server run dev` — run the API server, routed through `/api`
- `pnpm run typecheck` — typecheck shared libraries and workspace artifacts
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — apply Drizzle schema changes to the development database only
- Replit provides `DATABASE_URL` for the managed PostgreSQL database.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/mapua-findr/` — React/Vite interface and Mapúa palette
- `artifacts/api-server/src/routes/` — Express API endpoints
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/` — Drizzle database schema
- `lib/api-client-react/` and `lib/api-zod/` — generated API hooks and validation schemas

## Architecture decisions

- Keep the API contract in OpenAPI and run codegen after endpoint or schema changes.
- Use the Replit-managed PostgreSQL database through the shared Drizzle package.
- Treat found-item descriptions and locations as public listing fields; do not store personal identity or private claim-verification clues in this public flow.
- Mapúa sign-in, claims, moderation, and custody tracking are not implemented yet. Add access controls before using the board for production campus operations.

## Product

Visitors can report found items, browse and search saved listings, filter by found date, and see current item counts. Claims and custody screens remain placeholders.

## User preferences

The interface uses the Mapúa-inspired red, gold, white, and gray palette specified by the user.

## Gotchas

- Re-run `pnpm --filter @workspace/api-spec run codegen` whenever `lib/api-spec/openapi.yaml` changes.
- Push schema changes to development with the Drizzle command above. Replit applies managed production schema changes during Publish; do not run schema DDL against production from the app.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
