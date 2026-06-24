# Public Shop Phase A — Field matrix

Maps API-backed fields vs mock-defaulted UI fields. Mocks are **retained** as fallback until each slice is enabled via env flags.

## Env flags

| Flag | Facade function |
|------|-----------------|
| _(none — always API)_ | `listShops` |
| `VITE_PUBLIC_SHOP_API_PROFILE` | `getShopBySlug` |
| `VITE_PUBLIC_SHOP_API_PRODUCTS` | `getShopProducts` |
| `VITE_PUBLIC_SHOP_API_REVIEWS` | `getShopReviews` |

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

## Mock-defaulted in mappers (Phase B/C)

| UI field | Default |
|----------|---------|
| `badges` | `[]` — see [shop-badges-phase-b.md](./shop-badges-phase-b.md) |
| `metrics.followerCount`, engagement extras | `0` |
| `featuredProductPreviews` | `[]` |
| Statistics, community, campaigns, articles, similar shops | Mock facade functions |

## Explicitly mock (unchanged)

- `getShopStatistics`, `getShopCommunityMetrics`, `getSimilarShops`
- `getShopCampaigns`, `getShopCampaignHighlights`, `getShopArticles`
