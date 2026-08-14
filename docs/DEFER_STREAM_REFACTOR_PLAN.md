# Phased refactor plan: `deferStream` + data-fetching UX

**Status:** Complete (Phases 0–6; manual browser QA checklist in validation doc)  
**Scope:** `byte-forge-frontend-2` route-level `createAsync` usage  
**Goal:** Consistent SSR/hydration behavior, faster perceived load on public pages, and no "empty then fill" flashes on transactional flows.

---

## Background

SolidStart `createAsync(..., { deferStream: true })` controls **SSR streaming**, not client-side loading per se.

| Setting | SSR behavior | UX effect |
|---|---|---|
| **No `deferStream`** (default) | Page shell can stream first; async sections may arrive in a later chunk | Faster shell / TTFB; needs matching `Suspense` fallbacks to avoid hydration issues |
| **`deferStream: true`** | Server **holds that chunk** until the promise resolves | Slower first byte for that section, but HTML arrives complete — better for SEO, guards, and forms |

On **client navigation**, both patterns use `Suspense` the same way. The difference is mainly **first visit / SSR** and **hydration safety**.

The root `app.tsx` already has a global `Suspense` with a spinner, so routes without their own boundary fall back to a full-page loader.

### Decision framework (UX-first)

```
Is this data required before the page is useful?
├─ YES, single entity / form / guard (PDP, order detail, shop status)
│  └─ deferStream: true + preload + page Suspense
│
├─ YES, but page has independent sections (dashboard, list + stats)
│  └─ deferStream: true per section + nested Suspense with section skeletons
│
├─ NO, below-the-fold / optional (reviews, recommendations)
│  └─ NO deferStream + own nested Suspense (main content shows first)
│
└─ Filtered list that refetches (plants, orders, products)
   └─ deferStream: true + stable/latest pattern (keep old results while refetching)
```

### Current state (audit summary)

**Mostly consistent:** public list pages, shop sub-routes, seller dashboards/lists, buyer favorites/addresses, checkout cart.

**Known gaps:**

| Page / area | Current | Recommended |
|---|---|---|
| Plant PDP `plants/[slug]` | `plant` — no deferStream; reviews in same `Suspense` | `plant`: add deferStream; `reviews`: nested `Suspense`, no deferStream |
| Homepage `index.tsx` | `featuredReviews` — no deferStream | Add deferStream (match `FeaturedListings` / `FeaturedShops`) |
| Cart `(cart).tsx` | no deferStream | Add deferStream (parity with checkout) |
| Checkout `useCheckout.ts` | cart deferred; addresses not | Add deferStream to addresses |
| Buyer orders list | no deferStream | Add deferStream + stable/latest pattern |
| Buyer/seller order detail | no deferStream | Add deferStream |
| Seller layout `(seller-protected).tsx` | no deferStream | Add deferStream on guard queries |
| My Shop pages | no deferStream | Add deferStream on form data |
| Setup shop / verification | no deferStream | Add deferStream; remove `isClient()` hydration workarounds |

**Correctly without `deferStream`:**

- `Navbar` cart count — uses `initialValue`
- Wizard/modal helpers (`PlantWizardPage` category/tags) — not route-critical
- Conditional derived fetches (e.g. checkout `priceBreakdown` when address selected)

---

## Phase 0 — Convention & guardrails

**Status:** Done

**Purpose:** Lock the rules so later phases don't re-debate each call site.  
**Risk:** None (documentation only).  
**Est. files:** 1

### Deliverables

1. Extend `.agent/workflows/solidstart-data-fetching.md` with a `deferStream` section covering:
   - Primary route data → `deferStream: true` + `preload` + page `Suspense`
   - Secondary sections → no `deferStream` + nested `Suspense`
   - Refetching lists → `deferStream: true` + stable/latest pattern
   - Navbar/widgets → `initialValue` where appropriate

2. Add a PR checklist (in workflow doc or team process):
   - [ ] `preload` matches `createAsync` query keys
   - [ ] Primary data has `deferStream: true`
   - [ ] Secondary data has its own `Suspense` boundary
   - [ ] Fallback DOM matches server/client (no `null` fallbacks on guarded routes)

### Exit criteria

Team can answer "defer or not?" from the doc without reading Solid source.

---

## Phase 1 — High-impact public UX

**Status:** Done

**Purpose:** Fix pages that affect SEO, conversion, and first impressions.  
**Risk:** Medium (PDP structure change).  
**Est. files:** 4

| # | File(s) | Change |
|---|---------|--------|
| 1.1 | `src/routes/(app)/plants/[slug]/(index).tsx` | `plant` → add `deferStream: true`; move `reviewData` into nested `Suspense` **without** deferStream |
| 1.2 | `src/routes/(app)/index.tsx` | `featuredReviews` → add `deferStream: true` |
| 1.3 | `src/routes/(app)/checkout/useCheckout.ts` | `addresses` → add `deferStream: true` |
| 1.4 | `src/routes/(app)/cart/(cart).tsx` | `cart` → add `deferStream: true` |

### UX wins

- Plant PDP shows buy box immediately; reviews load independently
- Homepage sections stream consistently
- Checkout/cart don't flash empty address or cart state

### Testing

- Hard refresh (SSR) + client navigation on each changed route
- Slow 3G throttle on PDP and checkout
- View source / crawler check on plant PDP (title, JSON-LD, product content present)

### Exit criteria

- No full-page spinner on PDP waiting for reviews
- Checkout address step never renders empty then populates

---

## Phase 2 — Auth guards & seller shell

**Status:** Done

**Purpose:** Eliminate redirect flashes and hydration mismatches on protected routes.  
**Risk:** Medium (auth/guard behavior).  
**Est. files:** 3–4

| # | File(s) | Change |
|---|---------|--------|
| 2.1 | `src/routes/(protected)/app/seller/(seller-protected).tsx` | `shopStatus`, `subscription` → `deferStream: true` |
| 2.2 | `src/lib/auth/session.ts` | `useSession` → `deferStream: true` |
| 2.3 | `src/components/seller/SubscriptionDashboardBanner.tsx` | Align with session/subscription pattern |

### Related work

Ensure all `Suspense` fallbacks on `(protected).tsx` and seller layout are explicit non-`null` skeletons (see `audits/hydration-mismatch-fix-proposal-2026-03-19.md`).

### Testing

- Logged-out visit to `/app/seller/*` → clean redirect, no content flash
- Logged-in seller with incomplete shop → setup redirect without flicker
- Hydration console: no mismatch warnings on seller dashboard

### Exit criteria

Seller guard routes show one loading state, then correct content or redirect — never both.

---

## Phase 3 — Seller form pages

**Status:** Done

**Purpose:** Forms should render pre-filled, not skeleton → empty fields → populated.  
**Risk:** Low.  
**Est. files:** 5–6

| # | File(s) | Change |
|---|---------|--------|
| 3.1 | `src/routes/(protected)/app/seller/(seller-protected)/my-shop/(my-shop).tsx`, `edit.tsx`, `history.tsx`, `delete.tsx` | `getShop()` / status queries → `deferStream: true` |
| 3.2 | `src/routes/(protected)/app/seller/setup-shop/(setup-shop).tsx` | `getShop()` → `deferStream: true`; remove `isClient()` guards masking hydration |
| 3.3 | `src/routes/(protected)/app/seller/(seller-protected)/verification/(verification).tsx` | shop + verification data → `deferStream: true` |

### Testing

- SSR hard refresh on each form page
- No field value "jump" after hydration
- Edit modals open with correct pre-filled data

### Exit criteria

All seller setup/my-shop pages show loading skeleton, then complete form — no intermediate empty state.

---

## Phase 4 — Buyer transactional pages

**Status:** Done

**Purpose:** Consistent loading on order flows.  
**Risk:** Low.  
**Est. files:** 3

| # | File(s) | Change |
|---|---------|--------|
| 4.1 | `src/routes/(protected)/app/(buyer)/orders/(orders).tsx` | `ordersData`, `statsData` → `deferStream: true`; stable/latest for `ordersData` (copy plants list pattern) |
| 4.2 | `src/routes/(protected)/app/(buyer)/orders/[id]/([id]).tsx` | `group` → `deferStream: true` |
| 4.3 | `src/routes/(protected)/app/seller/(seller-protected)/orders/[orderId]/([orderId]).tsx` | `order` → `deferStream: true` |

### Reference pattern (stable/latest)

See `src/routes/(app)/plants/(plants).tsx`:

```ts
const plantsData = createAsync(
  () => getPublicPlants(filterParams()),
  { deferStream: true }
);

const [stablePlants, setStablePlants] = createSignal(undefined);
const [isRefreshing, setIsRefreshing] = createSignal(false);

createEffect(() => {
  const d = plantsData();
  if (d !== undefined) {
    setStablePlants(d);
    setIsRefreshing(false);
  } else if (stablePlants() !== undefined) {
    setIsRefreshing(true);
  }
});
```

### Testing

- Filter/search on orders list → table doesn't blank during refetch
- Order detail SSR shows complete order or explicit not-found

### Exit criteria

Orders list behaves like plants list during filter changes.

---

## Phase 5 — Remaining inconsistencies

**Status:** Done

**Purpose:** Sweep stragglers; no new patterns.  
**Risk:** Low.  
**Est. files:** 3–5

| # | File(s) | Change |
|---|---------|--------|
| 5.1 | `products/[productId]/reviews`, `ProductWizardPage`, `PlantSectionFieldEditor` | Evaluate case-by-case; wizard helpers can stay without deferStream |
| 5.2 | `shops/[slug]/index.tsx`, `reviews.tsx` | Nested `Suspense` for reviews (shop header deferStream, reviews no deferStream) |
| 5.3 | `checkout/confirmation.tsx` | `paymentMethods` → `deferStream: true` if SSR-critical |

### Exit criteria

Every route-level `createAsync` has an intentional `deferStream` choice (or `initialValue`), documented inline or in the workflow doc.

---

## Phase 6 — Validation & cleanup

**Status:** Done

**Purpose:** Prevent regression.  
**Risk:** None.

### Automated checks (done)

- `npm run test:run` — 22 tests passed
- `npm run build` — success
- `npm run audit:defer-stream` — route `createAsync` audit script
- No `isClient()` hydration workarounds in `src/`

See [DEFER_STREAM_VALIDATION.md](./DEFER_STREAM_VALIDATION.md) for the manual test matrix and sign-off checklist.

### Optional follow-ups

- ESLint custom rule or review bot: flag `createAsync` in `routes/` without `deferStream` or `initialValue` unless `// deferStream: intentional` comment is present
- Remove `isClient()` guards added only for hydration workarounds (Phase 3)

---

## PR order & sizing

| PR | Phase | Est. files | Risk |
|----|-------|------------|------|
| PR 1 | Phase 0 | 1 | None |
| PR 2 | Phase 1 | 4 | Medium |
| PR 3 | Phase 2 | 3–4 | Medium |
| PR 4 | Phase 3 | 5–6 | Low |
| PR 5 | Phase 4 | 3 | Low |
| PR 6 | Phase 5 | 3–5 | Low |

**Total: ~6 small PRs**, each independently shippable.

---

## Out of scope

- Backend/API changes
- New skeleton components (reuse existing `StatsLoading`, `OrdersLoading`, plant grid loaders)
- `preload` additions where queries are already preloaded (add only where missing after Phase 1 PDP review)
- Payment/subscription billing infra

---

## Success metrics

- Zero hydration mismatch warnings on protected + PDP routes
- Plant PDP LCP improves (main content not blocked by reviews)
- Checkout address step: no empty-state flash
- Orders list: no table blanking on filter change
- `deferStream` usage is intentional and documented, not accidental

---

## Related docs

- `.agent/workflows/solidstart-data-fetching.md` — base data-fetching patterns (to be extended in Phase 0)
- `docs/DEFER_STREAM_VALIDATION.md` — validation record and manual QA checklist
- `audits/hydration-mismatch-fix-proposal-2026-03-19.md` — hydration context and `deferStream` rationale
