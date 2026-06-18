# Byte Forge Frontend - Project Constants

## Stack and Runtime
- Framework: SolidStart + Solid Router (file-based routing)
- Rendering/runtime: Vinxi
- Language: TypeScript
- Validation/forms: zod + modular forms
- i18n: `@solid-primitives/i18n` (`en` + `bn`)
- Package manager: npm scripts in this project
- Minimum runtime: Node `>=22`

## Source Map
- `src/routes/` - route files with grouped shells (`(app)`, `(protected)`, `(auth)`, etc.)
- `src/components/` - reusable UI and domain components
- `src/lib/api/` - API client, endpoint modules, types
- `src/lib/auth/` - session and auth helpers
- `src/lib/orders/` - order display/route utility logic
- `src/i18n/` - locale dictionaries and i18n provider
- `src/components/layout/` - top-level app nav/sidebar structures

## App-Wide Conventions
- Keep route files focused on orchestration (load data, wire actions, compose components).
- Keep API calls inside `src/lib/api/endpoints/**`, not scattered in components.
- Keep shared UI primitives in `src/components/ui/**`.
- Preserve existing route group structure unless migration is requested.

## Query and Action Rules
- Reads should use router `query(...)` + `createAsync(...)`.
- Writes should use router `action(...)` + `useAction/useSubmission`.
- Use submission result handling for success/stale/error UX feedback.
- Revalidate relevant query keys after successful mutation.

## API Client Rules
- Route all network requests via `src/lib/api/api-client.ts` fetcher.
- Preserve:
  - locale header injection (`x-locale`)
  - cookie/credential behavior
  - CSRF header injection for state-changing requests
  - auth error handling and redirect behavior

## i18n Rules
- Dictionary sources:
  - `src/i18n/en.ts`
  - `src/i18n/bn.ts`
- For interpolated strings, prefer project pattern of function-based keys:
  - `(p) => \`...\${p.value}...\``
- Do not hardcode user-facing copy in route components when key exists or should exist.

## Routing and Navigation Rules
- Use `A` links for route navigation in rendered UI where applicable.
- Keep sidebar/nav links aligned with actual implemented routes.
- Keep disabled/unreleased nav items explicit rather than silently removing product intent.
- Preserve `returnTo` and query-param patterns used by list/detail flows.

## Order Flow and Status UX Rules
- Keep status labels and variants centralized in `src/lib/orders/order-display.utils.ts`.
- Keep seller/buyer timeline and tracking cards aligned to backend status fields.
- Preserve conflict (`409`) handling UX for stale updates.
- Keep action availability driven by backend descriptors, not hardcoded assumptions in UI.

## Form and Submission UX Rules
- Show explicit pending/loading states on submit buttons.
- Show clear success/error feedback (toasts/dialog messaging).
- Keep confirm dialogs for destructive or irreversible actions.
- Avoid silent failures.

## Definition of Done (Frontend)
- Build passes: `npm run build`
- No new lint/TS errors in touched files
- Query/action separation remains consistent
- i18n keys added/updated for new copy in both locales
- Navigation and route behavior are consistent with implemented features
- No regression in auth/session/locale behavior

## Never Do
- Bypass shared API fetcher for internal API calls
- Hardcode user-facing strings in complex feature UIs without i18n keys
- Mix write logic into read-only query functions
- Enable nav links to routes that do not exist
- Break existing URL contract (`returnTo`, query filters) without migration intent
