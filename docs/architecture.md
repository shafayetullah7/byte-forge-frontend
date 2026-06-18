# Byte Forge Frontend - Architecture Overview

## Layered Architecture
- **Route layer** (`src/routes/**`): page orchestration and route-level async state.
- **Composition layer** (`src/components/**`): reusable presentational and container components.
- **Data layer** (`src/lib/api/**`): typed endpoint modules and shared fetch transport.
- **Domain utility layer** (`src/lib/**`): feature-specific helpers (orders, auth, config, contexts).
- **Localization layer** (`src/i18n/**`): dictionaries and i18n provider/hooks.

## High-Level Route Grouping
- Public app routes: `(app)`
- Auth routes: `(auth)`
- Protected user/seller routes: `(protected)` with nested buyer/seller sections
- Seller and buyer have distinct dashboards and flow components

## Core Data Flow
1. Route loads via `createAsync` and/or route-level query helper.
2. Endpoint module uses shared `fetcher`.
3. Data is mapped to typed models in `lib/api/types`.
4. UI components render based on loading/error/data states.
5. Mutations run via `action` + `useAction/useSubmission`.
6. Related queries are revalidated.

## API Layer Design
- `lib/api/endpoints/**` contains feature APIs.
- `lib/api/types/**` contains contracts consumed by route/components.
- `lib/api/api-client.ts` is the unified transport and auth/csrf/locale policy.

## i18n Design
- Provider and `useI18n` from `src/i18n/index.ts`.
- Locale dictionary files:
  - `src/i18n/en.ts`
  - `src/i18n/bn.ts`
- Many dynamic messages are function keys; keep consistency across locales.

## State and UX Patterns
- Query-driven reads with suspense and fallback boundaries.
- Submission-driven writes with explicit pending/success/error UX.
- Status-heavy domains (orders/shipping) use shared display utility mapping.

## Navigation Architecture
- Layout and dashboard sidebars under `components/layout/**`.
- Route availability and nav labels must remain synchronized.
- Feature rollouts should preserve “coming soon” UX where route exists but functionality is incomplete.

## Boundary Principles
- Route files coordinate; endpoint modules communicate.
- Do not bypass shared fetcher or i18n systems.
- Prefer extending existing feature utilities over introducing parallel logic.
