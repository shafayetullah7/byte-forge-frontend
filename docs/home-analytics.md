# Home page analytics (P-064)

Lightweight instrumentation on `/` for future dashboards. No third-party SDK is required; events are exposed on the DOM and via a browser `CustomEvent`.

## Privacy

Payloads contain **section IDs and click IDs only**. Do not add user IDs, emails, search queries, or product titles to these hooks.

## DOM contract

| Attribute | Purpose |
|-----------|---------|
| `data-analytics-section` | Stable block id on the outermost home section element |
| `data-analytics-click` | Dotted click id on high-intent links/buttons |

Section ids are defined in [`src/lib/analytics/home-analytics.ts`](../src/lib/analytics/home-analytics.ts) (`HOME_ANALYTICS_SECTIONS`).

## Custom event

**Name:** `bf:home-analytics`

**Payload shapes:**

```ts
// Fired once per section per page load when ~25% visible (IntersectionObserver)
{ type: "section_impression"; section: string }

// Fired on click (capture phase) for elements with data-analytics-click on home
{ type: "section_click"; clickId: string; section?: string }
```

**Example listener (e.g. GTM bridge later):**

```js
window.addEventListener("bf:home-analytics", (e) => {
  console.log(e.detail);
});
```

Observer and click delegation live in [`HomeSectionAnalytics.tsx`](../src/components/home/HomeSectionAnalytics.tsx), mounted from [`routes/(app)/index.tsx`](../src/routes/(app)/index.tsx) inside `#home-analytics-root`.

## Section IDs

| ID | Component |
|----|-----------|
| `hero` | Hero |
| `trust_bar` | TrustBar |
| `quick_discovery` | QuickDiscovery |
| `home_offers` | HomeOffers |
| `shop_by_category` | ShopByCategory |
| `featured_listings` | FeaturedListings |
| `budget_finds` | BudgetFinds |
| `featured_shops` | FeaturedShops |
| `shop_by_need` | ShopByNeed |
| `founding_articles` | FoundingArticles |
| `how_it_works` | HowItWorks |
| `why_byte_forge` | WhyChooseByteForge |
| `seller_cta` | SellerCTA |
| `featured_reviews` | FeaturedReviews |
| `footer` | Footer |

## Documented click IDs (v1)

| clickId | Location |
|---------|----------|
| `hero.explore_plants` | Hero primary CTA |
| `hero.explore_nurseries` | Hero shops CTA |
| `hero.start_selling` | Hero seller CTA |
| `hero.category_chip.{slug}` | Hero category chips |
| `quick_discovery.preset.{id}` | Quick discovery pills (`easyCare`, `lowLight`, …) |
| `quick_discovery.plant_finder` | Link to `/find` |
| `home_offers.view_all` | Offers “view all” links |
| `featured_listings.browse_all` | Featured listings footer CTA |
| `budget_finds.browse_all` | Budget finds footer CTA |
| `featured_shops.view_all` | Featured shops footer CTA |
| `shop_by_need.{id}` | Shop-by-need cards (`gifting`, `lowMaintenance`, …) |
| `featured_reviews.explore_plants` | Featured reviews header link |

Individual product/shop cards are intentionally not instrumented in v1.
