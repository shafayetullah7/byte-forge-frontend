# Homepage featured listings — phased execution plan

**Status:** v1 complete (Phases 1–5)  
**Audience:** Frontend contributors and AI agents  
**Replaces:** Static `FeaturedPlants` category tiles (`src/components/home/FeaturedPlants.tsx`)  
**Aligns with:** [PRODUCT_MODEL.md](../../docs/PRODUCT_MODEL.md) — marketplace proof before generic browse chrome

---

## Context

The homepage section below `TrustBar` currently shows hardcoded category cards with broken Unsplash URLs. All CTAs go to `/plants` with no filter. This is generic marketplace UI and does not prove live inventory.

**Decision:** Replace with **in-stock plants you can order today** — real listings from `getPublicPlants`, reusing `PlantCard`, following the same pattern as `FeaturedShops` (API-driven, hide when empty, preload on `/`).

### Why not categories or articles?

| Option | Fit now |
|--------|---------|
| Category tiles | Low differentiation; duplicates `/plants` filters |
| Seller articles | Best long-term differentiator, but **0 articles** today |
| **In-stock listings** | **Best fit** — proves COD commerce is real |

### Homepage narrative after v1

```text
Hero              → What is Byte Forge?
TrustBar          → Platform credibility
FeaturedListings  → Proof: real plants for sale today   ← this plan
FeaturedShops     → Proof: who sells them
HowItWorks        → COD flow
Reviews           → Social proof (when present)
```

---

## Overview

```text
Phase 1 → Data layer + constants
Phase 2 → UI component
Phase 3 → Homepage integration
Phase 4 → i18n + copy cleanup
Phase 5 → QA + polish
Phase 6 → Deferred enhancements
```

Phases 1–5 complete v1. Each phase is independently reviewable.

---

## Phase 1 — Data layer

**Goal:** A single, reusable way to fetch homepage listings without touching UI yet.

### Scope

- Extend `src/lib/public-plants/public-plant.service.ts`
- Define frozen filter constant
- Add dedicated Solid query wrapper

### Deliverables

```ts
import { getPublicPlants } from "~/lib/api/endpoints/public/plants.api";
import type { PublicPlantFilter } from "~/lib/api/types/public/plants.types";

export const FEATURED_LISTINGS_FILTER = {
  page: 1,
  limit: 8,
  inStockOnly: true,
  sortBy: "createdAt",
  sortOrder: "desc",
} as const satisfies PublicPlantFilter;

export const listFeaturedPlants = query(
  async () => getPublicPlants(FEATURED_LISTINGS_FILTER),
  "public-plants-featured",
);
```

### Decisions locked in

| Decision | Value |
|----------|-------|
| Sort | Newest in-stock (`createdAt desc`) |
| Limit | 8 |
| Query key | `public-plants-featured` (separate from `/plants` browse cache) |
| Backend changes | None |

### Exit criteria

- [x] `listFeaturedPlants()` returns paginated response from API
- [x] Only in-stock plants from entitled sellers (existing backend rules)
- [x] No new endpoint required

### Out of scope

- UI, i18n, homepage wiring

---

## Phase 2 — UI component

**Goal:** A self-contained section that renders real plant cards or nothing.

### Scope

- Create `src/components/home/FeaturedListings.tsx`
- Reuse `PlantCard` from `~/routes/(app)/plants/plant-card`
- Mirror structure of `FeaturedShops.tsx`

### Behavior

| State | UI |
|-------|-----|
| `undefined` (loading) | Render nothing (Option A — matches `FeaturedShops`) |
| `data.length === 0` | Render nothing |
| `data.length ≥ 1` | Full section with grid + CTA |

Do **not** show an empty-state message on the homepage — omit the section entirely.

### Layout

- Section: `py-24`, `bg-white dark:bg-forest-900/50` (alternates with `FeaturedShops` on `cream-50`)
- Header: eyebrow + title + description
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`
- CTA: `LinkButton` → `/plants`

### Component sketch

```tsx
export function FeaturedListings() {
  const { t } = useI18n();
  const plants = createAsync(() => listFeaturedPlants(), { deferStream: true });

  return (
    <Show when={plants() !== undefined && (plants()?.data.length ?? 0) > 0}>
      {/* header + For each plant → PlantCard + browse CTA */}
    </Show>
  );
}
```

### Exit criteria

- [x] Renders 1–8 `PlantCard`s from API data
- [x] Section absent when empty or still loading
- [x] Card → PDP, shop row → shop page (via existing `PlantCard`)
- [x] CTA links to `/plants`

### Out of scope

- Homepage preload (Phase 3)
- Error boundary (Phase 3)
- Final EN/BN copy (Phase 4)

---

## Phase 3 — Homepage integration

**Goal:** Wire the section into `/` with SSR preload and safe failure.

### Scope

- Update `src/routes/(app)/index.tsx`
- Update `src/components/home/index.ts`
- Delete `src/components/home/FeaturedPlants.tsx`

### `index.tsx` changes

```ts
import { FeaturedListings } from "~/components/home";
import { listFeaturedPlants } from "~/lib/public-plants/public-plant.service";

export const route = {
  preload: () => {
    getFeaturedPublicReviews(6);
    listShops({ sort: "popular", limit: 3 });
    listFeaturedPlants();
  },
};
```

### Render order

```text
Hero → TrustBar → FeaturedListings → FeaturedShops → HowItWorks → …
```

### Error boundary

Wrap like `FeaturedShops`:

```tsx
<SafeErrorBoundary
  fallback={(error, reset) => (
    <InlineErrorFallback error={error} reset={reset} label="featured plants" />
  )}
>
  <FeaturedListings />
</SafeErrorBoundary>
```

### Exit criteria

- [x] Homepage preloads featured plants on server
- [x] API failure does not break the entire page
- [x] `FeaturedPlants` removed; barrel export updated
- [x] No references to old static Unsplash category data on `/`

### Out of scope

- i18n cleanup (Phase 4)
- Compact card variant (Phase 6)

---

## Phase 4 — i18n & copy

**Goal:** Proper EN/BN strings; remove misleading “category browse” framing.

### Scope

- `src/i18n/en.ts`
- `src/i18n/bn.ts`
- Wire keys in `FeaturedListings.tsx`

### New keys

```ts
landing: {
  featuredListings: {
    label: "Available now",
    title: "Plants you can order today",
    description:
      "Real listings from verified nurseries — order with cash on delivery.",
    browseAll: "Browse all plants",
  },
}
```

Add matching Bengali strings in `bn.ts`.

### Cleanup

- Remove or deprecate `landing.categories.*` if unused elsewhere
- Component uses only `landing.featuredListings.*`

### Exit criteria

- [x] All section copy via i18n
- [x] Bengali locale reads naturally
- [x] No hardcoded English in `FeaturedListings.tsx`

---

## Phase 5 — QA & polish

**Goal:** Verify behavior across real states before calling v1 done.

### Manual QA matrix

| # | Scenario | Expected |
|---|----------|----------|
| 1 | 0 in-stock plants | Section not in DOM |
| 2 | 1–3 plants | Section shows; grid not broken |
| 3 | 8+ plants | Shows 8 newest in-stock |
| 4 | Missing thumbnail | Leaf fallback on card |
| 5 | API 500 | Error fallback; rest of page OK |
| 6 | BN locale | Translated header + CTA |
| 7 | Mobile | 1-col grid; tap targets OK |
| 8 | Non-subscribed seller | Plant excluded (backend) |

### Performance checks

- [x] One `GET /api/v1/plants` on homepage load (`limit=8`) — via `listFeaturedPlants` preload
- [x] No extra PDP fetches per card — grid uses list endpoint only
- [x] Images use existing Cloudinary transforms (`PlantCard`)

### Optional polish (same phase, if quick)

- [x] `fetchpriority="high"` on first 2 card images (`PlantCard` `priority` prop)
- [x] Confirm section background alternates with `FeaturedShops` — white vs `cream-50`

### Exit criteria

- [x] Code review / static verification complete (see manual QA below)
- [ ] Manual QA on running app (empty catalog, live listings, BN locale, mobile)
- [x] v1 implementation signed off

---

## Phase 6 — Deferred (post-v1)

Not part of initial ship. Add when data or needs justify it.

| Phase | Trigger | What to build |
|-------|---------|---------------|
| **6a — Compact cards** | Homepage feels too tall | `PlantCard variant="compact"` for landing only |
| **6b — Skeleton loading** | API routinely >300ms | Pulse skeleton grid while `undefined` |
| **6c — Popular sort** | Enough orders for signal | Backend `sort=popular` + switch homepage filter |
| **6d — Seller spotlight** | &lt;4 listings total | Fallback: one shop + 3 products instead of grid |
| **6e — Articles row** | 3+ published articles | “From our growers” below listings |
| **6f — Admin curation** | Manual homepage picks | `featuredOnHomepage` flag on products |
| **6g — Dead code cleanup** | After homepage stable | Remove or wire `TrendingPlants`, `LiveCampaigns`, `SeasonalPicks` mocks |

---

## File checklist (v1)

| File | Action |
|------|--------|
| `src/lib/public-plants/public-plant.service.ts` | Add filter + `listFeaturedPlants` |
| `src/components/home/FeaturedListings.tsx` | **Create** |
| `src/components/home/FeaturedPlants.tsx` | **Delete** |
| `src/components/home/index.ts` | Export `FeaturedListings` |
| `src/routes/(app)/index.tsx` | Preload, import, error boundary |
| `src/i18n/en.ts` | `landing.featuredListings` |
| `src/i18n/bn.ts` | `landing.featuredListings` |

**No changes** to `PlantCard` required for v1.

**No backend / migration** changes for v1.

---

## Phase summary

| Phase | Focus | User-visible? |
|-------|--------|----------------|
| 1 | `listFeaturedPlants` + filter constant | No |
| 2 | `FeaturedListings` component | Dev only |
| 3 | Homepage wire + delete old component | **Yes** |
| 4 | EN/BN copy | **Yes** |
| 5 | QA + polish | **v1 complete** |
| 6 | Enhancements | Later |

Phases 3–5 can ship in one PR; phases 1–2 are a logical split for review.

---

## Effort estimate

| Phase | Rough size |
|-------|------------|
| 1 | ~30 min |
| 2 | ~1 hr |
| 3 | ~30 min |
| 4 | ~30 min |
| 5 | ~1 hr QA |
| **Total v1** | **~3–4 hrs** |

---

## Related docs

- [PRODUCT_MODEL.md](../../docs/PRODUCT_MODEL.md) — growth loop, founding-seller wedge
- [public-shop-phase-a.md](./public-shop-phase-a.md) — similar API-driven public surface pattern
- [IMAGE_OPTIMIZATION_PLAN.md](../../docs/IMAGE_OPTIMIZATION_PLAN.md) — `PlantCard` already uses Cloudinary delivery transforms
