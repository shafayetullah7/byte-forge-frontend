---
description: SolidStart SEO handling with @solidjs/meta — when and where to use meta tags, structured data, and status codes
---

# SolidStart SEO Rules

## Core Concept: SEO Levels

SEO in SolidStart operates at different levels. Each level serves a different purpose and should be applied at the right place.

```
Level 0: Root (app.tsx)          → Site-wide defaults (fallback title, charset, viewport)
Level 1: Layout (e.g. (app).tsx) → Section-wide defaults (OG image, theme branding)
Level 2: Page (e.g. index.tsx)   → Page-specific (unique title, description, canonical)
Level 3: Dynamic (data-driven)   → Generated from async data (product name, article title)
```

**Override rule:** Deeper levels override shallower ones. A `<Title>` in a page overrides a `<Title>` in a layout, which overrides the one in `app.tsx`.

---

## Level 0: Root Defaults (app.tsx)

Set global fallback meta tags that apply to every page unless overridden.

```tsx
// src/app.tsx
import { Title, Meta, Link } from "@solidjs/meta";

export default function App() {
  return (
    <>
      {/* Global Defaults */}
      <Title>ByteForge</Title>
      <Meta charset="utf-8" />
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta name="description" content="Your default site description" />

      {/* Open Graph Defaults */}
      <Meta property="og:site_name" content="ByteForge" />
      <Meta property="og:type" content="website" />
      <Meta property="og:image" content="https://yoursite.com/og-default.png" />

      {/* Twitter Card Defaults */}
      <Meta name="twitter:card" content="summary_large_image" />

      {/* Favicon */}
      <Link rel="icon" href="/favicon.ico" />

      <Router root={...}>
        <FileRoutes />
      </Router>
    </>
  );
}
```

### Rules:
1. **Always set a fallback `<Title>` and `<Meta name="description">`** — If a page forgets to set one, this catches it.
2. **Set `charset` and `viewport` once here** — Never repeat these in child components.
3. **Set Open Graph and Twitter Card defaults here** — Individual pages override only what they need.

---

## Level 1: Layout-Level SEO

Layouts set SEO defaults for an entire section of your app.

```tsx
// routes/(app).tsx
import { Meta } from "@solidjs/meta";

export default function AppLayout(props: RouteSectionProps) {
  return (
    <>
      {/* All public pages share this OG image unless overridden */}
      <Meta property="og:image" content="https://yoursite.com/public-og.png" />
      <Navbar />
      {props.children}
    </>
  );
}
```

### When to use layout-level SEO:
- Different OG images for marketing pages vs dashboard pages
- Different `robots` meta for public vs private sections
- Section-level branding (e.g., `og:site_name` differs per sub-brand)

### When NOT to use layout-level SEO:
- Don't set `<Title>` in layouts — Each page should have its own unique title
- Don't set `<Meta name="description">` in layouts — Descriptions should be page-specific

---

## Level 2: Page-Level SEO (Most Important)

Every public-facing page **MUST** have its own SEO tags.

```tsx
// routes/(app)/about/index.tsx
import { Title, Meta, Link } from "@solidjs/meta";

export default function AboutPage() {
  return (
    <>
      <Title>About Us — ByteForge</Title>
      <Meta name="description" content="Learn about ByteForge and our mission." />
      <Link rel="canonical" href="https://yoursite.com/about" />

      {/* Open Graph overrides */}
      <Meta property="og:title" content="About Us — ByteForge" />
      <Meta property="og:description" content="Learn about ByteForge and our mission." />

      <main>
        {/* page content */}
      </main>
    </>
  );
}
```

### Rules:
1. **Every public page MUST have a unique `<Title>`** — No two pages should share the same title.
2. **Every public page MUST have a unique `<Meta name="description">`** — Keep it under 160 characters.
3. **Title format:** `Page Name — Site Name` (e.g., `About Us — ByteForge`).
4. **Set `og:title` and `og:description`** — These can differ from the page title/description for social optimization.
5. **Set `<Link rel="canonical">`** — On pages that might be accessible via multiple URLs (e.g., with/without query params).

---

## Level 3: Dynamic/Data-Driven SEO

For pages driven by async data (product pages, blog posts, user profiles), generate meta tags from the data.

```tsx
// routes/(app)/plants/[slug]/index.tsx
import { Title, Meta } from "@solidjs/meta";
import { createAsync } from "@solidjs/router";
import { Suspense, Show } from "solid-js";

export const route = {
  preload: ({ params }) => getPlant(params.slug),
} satisfies RouteDefinition;

export default function PlantPage() {
  const params = useParams<{ slug: string }>();
  const plant = createAsync(() => getPlant(params.slug));

  return (
    <Suspense>
      <Show when={plant()}>
        {(p) => (
          <>
            <Title>{p().name} — ByteForge</Title>
            <Meta name="description" content={p().description.slice(0, 160)} />
            <Meta property="og:title" content={p().name} />
            <Meta property="og:description" content={p().description.slice(0, 160)} />
            <Meta property="og:image" content={p().imageUrl} />

            {/* Structured Data (JSON-LD) */}
            <script
              type="application/ld+json"
              innerHTML={JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Product",
                name: p().name,
                description: p().description,
                image: p().imageUrl,
              })}
            />

            <main>
              <PlantDetail plant={p()} />
            </main>
          </>
        )}
      </Show>
    </Suspense>
  );
}
```

### Rules:
1. **Dynamic meta tags MUST be inside `<Show when={data()}>` or `<Suspense>`** — Otherwise they render with `undefined` values during loading.
2. **Truncate descriptions to 160 characters** — Search engines cut off longer descriptions.
3. **Use `innerHTML` for JSON-LD `<script>` tags** — SolidStart doesn't render children inside `<script>` tags. Use `innerHTML` with `JSON.stringify`.
4. **Always use `preload`** — So crawlers get the data on the first render, not after hydration.

---

## When to DO SEO vs When NOT to

### ✅ DO add SEO meta tags:

| Page Type | What to add |
|---|---|
| **Landing / Marketing pages** | Full SEO: Title, description, OG, Twitter, canonical, structured data |
| **Public content pages** (About, Blog, Products) | Full SEO: Title, description, OG, canonical |
| **Product / Item detail pages** | Full SEO + JSON-LD structured data (`Product`, `Article`, etc.) |
| **Search-result target pages** | Title, description, canonical (minimal but critical) |
| **404 page** | `<HttpStatusCode code={404} />` + Title |
| **Error pages** | `<HttpStatusCode code={500} />` + `<Meta name="robots" content="noindex" />` |

### ❌ DO NOT add SEO meta tags:

| Page Type | Why |
|---|---|
| **Dashboard / App pages** (behind auth) | Crawlers can't access them. SEO is wasted. |
| **Settings / Profile pages** | Private content, no SEO value. |
| **Modals / Dialogs** | Not separate pages, no URL. |
| **Auth pages** (Login, Register) | Usually no SEO value. Add `<Meta name="robots" content="noindex" />` to prevent indexing. |
| **Admin pages** | Private, no SEO value. |

### Auth / Private pages — Block indexing:

```tsx
// routes/(protected).tsx — Layout for all protected routes
import { Meta } from "@solidjs/meta";

export default function ProtectedLayout(props: RouteSectionProps) {
  return (
    <>
      <Meta name="robots" content="noindex, nofollow" />
      {props.children}
    </>
  );
}
```

---

## HTTP Status Codes

Always set the correct HTTP status code. Crawlers use this to decide whether to index a page.

```tsx
import { HttpStatusCode } from "@solidjs/start";

// 404 — Page not found
<HttpStatusCode code={404} />

// 301 — Permanent redirect (handled via useNavigate or middleware)

// 410 — Gone (content permanently removed)
<HttpStatusCode code={410} />
```

### Rules:
1. **Always return `404` for missing resources** — Don't show a "not found" message with a `200` status. Crawlers will index the error page.
2. **Use `410` for permanently deleted content** — Tells crawlers to remove it from their index faster than `404`.
3. **Set status codes INSIDE the component tree** — `<HttpStatusCode>` must be rendered within the component, not called as a function.

---

## Canonical URLs

Canonical URLs tell search engines which version of a page is the "real" one.

### When to set canonical:
- Pages accessible with and without trailing slash
- Pages with query params that don't change content (e.g., `?ref=twitter`)
- Paginated content (`/blog?page=2` → canonical to `/blog?page=2`, not `/blog`)
- Content syndicated to multiple URLs

```tsx
<Link rel="canonical" href="https://yoursite.com/about" />
```

### When NOT to set canonical:
- Protected/private pages (they shouldn't be indexed at all)
- Pages that are already unique with no alternate URLs

---

## Structured Data (JSON-LD)

Use structured data to help search engines understand your content and display rich results.

### When to add structured data:
| Schema Type | Use For |
|---|---|
| `Organization` | Root layout — your brand info |
| `WebSite` | Root layout — site-level search box |
| `Product` | Product detail pages |
| `Article` / `BlogPosting` | Blog posts |
| `BreadcrumbList` | Any page with breadcrumb navigation |
| `FAQPage` | FAQ pages |
| `LocalBusiness` | Shop/store pages |

### When NOT to add structured data:
- Private/auth pages — No one will see the rich results
- Pages without specific content type — Don't force a schema where it doesn't fit

---

## Quick Checklist for New Pages

For every new **public** page, verify:

- [ ] `<Title>` — unique, under 60 characters, format: `Page — Site`
- [ ] `<Meta name="description">` — unique, under 160 characters
- [ ] `<Meta property="og:title">` and `<Meta property="og:description">`
- [ ] `<Meta property="og:image">` — if the page has a relevant image
- [ ] `<Link rel="canonical">` — if the page could have duplicate URLs
- [ ] `<HttpStatusCode>` — if showing error states
- [ ] JSON-LD — if the page represents a product, article, business, etc.
- [ ] `preload` in route definition — so crawlers get data on first render

For every new **private/auth** page:
- [ ] `<Meta name="robots" content="noindex, nofollow" />` — prevent indexing
- [ ] NO other SEO tags needed

---

## Anti-Patterns to Avoid

1. **❌ Same title on every page** — Each page needs a unique title. Don't just use the site name.
2. **❌ Missing description** — Search engines will auto-generate one from page content. It's almost always worse than writing your own.
3. **❌ SEO tags on private pages** — Wasted effort. Block indexing with `noindex` instead.
4. **❌ Rendering meta tags with undefined data** — Always wrap dynamic meta inside `<Show>` or `<Suspense>` so they don't render with empty values.
5. **❌ Using `<title>` instead of `<Title>`** — The lowercase HTML tag doesn't integrate with `@solidjs/meta` and will cause conflicts.
6. **❌ Forgetting `HttpStatusCode` on error pages** — A "404 page" that returns HTTP `200` is invisible to crawlers as an error.
7. **❌ Adding structured data without real content** — Don't add a `Product` schema to a page that doesn't display a product. Google may penalize this.
