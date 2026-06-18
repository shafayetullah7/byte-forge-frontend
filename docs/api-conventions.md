# Frontend API Conventions

## Shared Transport
- All internal API calls go through `lib/api/api-client.ts` (`fetcher`).
- Use `buildURL` + `params` options instead of manual query string construction.
- Preserve shared auth/csrf/locale behavior.

## Endpoint Module Structure
- Keep feature APIs under `lib/api/endpoints/<domain>/`.
- Typical organization:
  - `*.api.ts` for request functions
  - `*.types.ts` for contracts
  - `*.actions.ts` for route action wrappers (if used)
  - `index.ts` for barrel exports

## Read vs Write
- Reads:
  - `query(...)` + `createAsync(...)`
- Writes:
  - `action(...)` + `useAction/useSubmission`
- Do not perform state-changing requests in read queries.

## Response Handling
- Respect `unwrapData` behavior where endpoints return envelope + meta.
- Map API error responses through `ApiError`.
- Keep endpoint signatures typed and stable.

## Auth and 401 Handling
- Honor `strict` behavior and optional auth error hooks from fetcher options.
- Do not implement custom route-level auth redirects that conflict with centralized behavior.

## SSR and Locale
- Keep SSR cookie forwarding and locale header injection intact.
- Avoid direct browser-only assumptions inside shared API helpers.
