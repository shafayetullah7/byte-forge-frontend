# deferStream refactor — validation record

**Date:** 2026-08-14  
**Status:** Automated checks passed; manual browser QA pending

---

## Automated checks

| Check | Result |
|-------|--------|
| `npm run test:run` | 22 tests passed |
| `npm run build` | Success |
| `node scripts/audit-defer-stream.mjs` | All route `createAsync` calls have explicit `deferStream` or `initialValue` |
| `isClient()` hydration workarounds in `src/` | None found |

Run audit before merge:

```bash
npm run audit:defer-stream
```

---

## Manual test matrix

Check each route after deploy or local `npm run build && npm run start`.

| Route | SSR hard refresh | Client nav | Slow 3G | Notes |
|-------|------------------|------------|---------|-------|
| `/` Homepage | ☐ | ☐ | ☐ | Hero immediate; featured sections load independently |
| `/plants/[slug]` Plant PDP | ☐ | ☐ | ☐ | Buy box before reviews; no full-page wait on reviews |
| `/shops/[slug]` + tabs | ☐ | ☐ | — | Overview before reputation; reviews tab skeleton |
| `/cart`, `/checkout` | ☐ | ☐ | ☐ | No empty cart/address flash |
| `/app/orders` | ☐ | ☐ | ☐ | Table stays visible during filter refetch |
| `/app/orders/[id]` | ☐ | ☐ | — | Single loading state → order detail |
| `/app/seller` + `/app/seller/my-shop` | ☐ | ☐ | — | No guard redirect flash; forms pre-filled |
| Browser console (protected + PDP) | ☐ | — | — | No hydration mismatch warnings |

---

## Intentional exceptions (no `deferStream`)

| File | Reason |
|------|--------|
| `plants/[slug]/components/PlantReviews.tsx` | Secondary data; nested `Suspense` |
| `components/shops/public/ShopOverviewReputation.tsx` | Secondary data; nested `Suspense` |
| `components/shops/public/ShopReviewsTab.tsx` | Secondary data; nested `Suspense` |
| `products/plants/components/PlantWizardPage.tsx` | Wizard reference data; not route-critical SSR |
| `products/plants/components/PlantSectionFieldEditor.tsx` | Modal editor; parent gates render |

---

## Known tradeoffs

1. **Plant PDP JSON-LD** — `aggregateRating` removed from main product schema when reviews were split. Optional follow-up: inject rating JSON-LD inside `PlantReviews` when summary loads.
2. **`useSession` + `deferStream`** — session-dependent UI may render slightly later on SSR in exchange for hydration consistency.

---

## Success criteria (from refactor plan)

- [ ] Zero hydration mismatch warnings on protected + PDP routes *(manual)*
- [ ] Plant PDP main content not blocked by reviews *(manual)*
- [ ] Checkout address step: no empty-state flash *(manual)*
- [x] Orders list: stable data during refetch *(implemented)*
- [x] `deferStream` usage intentional and documented

---

## Related docs

- [DEFER_STREAM_REFACTOR_PLAN.md](./DEFER_STREAM_REFACTOR_PLAN.md)
- [.agent/workflows/solidstart-data-fetching.md](../.agent/workflows/solidstart-data-fetching.md)
