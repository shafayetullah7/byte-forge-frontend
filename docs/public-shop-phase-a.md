# Public Shop Phase A — Field matrix

Public shop facade functions always call the API. Static placeholders fill UI fields the backend does not expose yet (see `*-placeholders.ts` under `src/lib/public-shops/`).

## Always API

| Facade function | Endpoint |
|-----------------|----------|
| `listShops` | `GET /shops` |
| `getShopBySlug` | `GET /shops/:slug` + profile placeholders |
| `getShopProducts` | `GET /shops/:slug/products` + product placeholders |
| `getShopReviews` | `GET /shops/:slug/reviews` + review placeholders when empty |

## API-backed (Phase A + storefront refactor)

| UI field | Source |
|----------|--------|
| `id`, `slug`, `name`, `description` | Shop + translation (`x-locale`) |
| `tagline`, `about`, `sellerStory`, `brandMission` | `shop_translations` (scalar text per locale) |
| `whyChooseUs` | `shop_why_choose_us` + `shop_why_choose_us_translations` |
| `values` | `shop_value_points` + `shop_value_point_translations` |
| `categoriesServed` | Derived from ACTIVE plant product `category_id` (not stored on shop) |
| `division`, `city` | Address translations |
| `logo`, `banner`, colors | Shop branding |
| `metrics.totalProducts`, `averageRating`, `reviewCount`, `completedOrders` | Aggregates |
| Products tab fields | `GET /shops/:slug/products` |
| Reviews tab | `GET /shops/:slug/reviews` |

## Seller management

| Content | API |
|---------|-----|
| Core identity (name, description, hours) | `PUT /user/seller/shop/my-shop` |
| Storefront story (tagline, about, story, mission) | `PUT /user/seller/storefront/profile` |
| Why choose us / values lists | `PUT /user/seller/storefront/why-choose-us`, `PUT .../value-points` |
| Categories served | Read-only preview on `GET /user/seller/storefront` |

## Static placeholders (temporary — refine in later phases)

| UI field | Placeholder |
|----------|-------------|
| `badges`, extended profile metrics | `profile-placeholders.ts` (non-factual defaults only in Phase 1) |
| Product `category` | `product-placeholders.ts` (`Indoor` until API returns category) |
| Reviews when API returns none | `review-placeholders.ts` — **empty state only** (no mock review injection in Phase 1) |

## Phase 1 production gating (`config.shopPhaseCEnabled = false`)

- Shop nav limited to **overview**, **products**, **reviews**
- Hidden on overview: statistics, community, similar shops
- `/shops/{slug}/campaigns` and `/articles` redirect to overview with `noindex`
- Hero KPIs: API-backed metrics only (products, orders, rating, reviews, shop age)
- Follow button remains disabled with “coming soon” tooltip

## Explicitly mock (unchanged — unreachable or Phase 3)

- `getShopStatistics`, `getShopCommunityMetrics`, `getSimilarShops`
- `getShopCampaigns`, `getShopCampaignHighlights`, `getShopArticles`
