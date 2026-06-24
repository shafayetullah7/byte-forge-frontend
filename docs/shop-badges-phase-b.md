# Shop Badges — Phase B (planned)

Badges shown on the public shop profile (`PublicShopBadge` enum in `shops.types.ts`) are **not** persisted or computed in the current storefront refactor.

## Planned model

- `shop_badge_definitions` — catalog of badge codes with translations (label, description)
- `shop_badge_assignments` — `shop_id`, `badge_id`, `source` (`computed` | `manual`), `granted_at`
- Computation engine for platform-awarded badges (e.g. `HIGHLY_RATED`, `TOP_SELLER`)
- Admin API to grant/revoke manual badges

## Current behavior

- Buyer UI: `badges` defaults to `[]` when profile API is used; overview sections may still use mock data when API slices are off
- Seller UI: no badge management
- Do not add JSONB or free-text badge fields on `shop_translations`

## When picking up

1. Define badge catalog seed data
2. Implement assignment table + public read on `GET /shops/:slug`
3. Add admin grant/revoke
4. Add optional batch job for computed rules
5. Remove mock badge source from `mock-shops.data.ts` once API slice is stable
