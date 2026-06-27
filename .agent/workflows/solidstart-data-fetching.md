---
description: SolidStart data fetching, Suspense, and async data rules
---

# SolidStart Data Fetching & Suspense Rules

## Core Principles

1. **Components are always synchronous.** Never make a component function `async`. Async data is handled through primitives, not the component itself.
2. **Use `createAsync` over `createResource`.** `createAsync` (from `@solidjs/router`) is the recommended primitive for all async data in SolidStart. It integrates with routing, caching, and revalidation. Only use `createResource` (from `solid-js`) for non-route-related, purely client-side async state (e.g., a debounced search input).
3. **Wrap data fetchers with `query()`.** Every async function that fetches data should be wrapped with `query()` (from `@solidjs/router`) and given a unique cache key. This enables deduplication, caching, and revalidation.

---

## Data Fetching Pattern (The Standard Way)

Every route or data-dependent component should follow this 3-layer pattern:

### Layer 1: Define the data fetcher with `query()`

```tsx
// src/lib/api/get-products.ts
import { query } from "@solidjs/router";

export const getProducts = query(async () => {
  "use server"; // Add this if the fetch needs server-only context (cookies, secrets, DB)
  const res = await fetch("/api/products");
  return res.json();
}, "products"); // <-- unique cache key for deduplication & revalidation
```

### Layer 2: Preload in the route definition

```tsx
// src/routes/products.tsx
import { getProducts } from "~/lib/api/get-products";
import type { RouteDefinition } from "@solidjs/router";

export const route = {
  preload: () => getProducts(),
} satisfies RouteDefinition;
```

### Layer 3: Consume with `createAsync` + `Suspense`

```tsx
// src/routes/products.tsx (continued)
import { createAsync } from "@solidjs/router";
import { Suspense, For } from "solid-js";

export default function ProductsPage() {
  const products = createAsync(() => getProducts());

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <For each={products()}>
        {(product) => <ProductCard product={product} />}
      </For>
    </Suspense>
  );
}
```

---

## When to Use `Suspense`

### ✅ USE `Suspense` when:

| Scenario | Why |
|---|---|
| **Route-level data** (pages that load API data) | Shows a loading state while the page data streams in. Prevents blank screens. |
| **Multiple independent async sections on one page** | Each section gets its own `<Suspense>` boundary so they load independently without blocking each other. |
| **Nested async data** (a child component fetches its own data) | Prevents the parent from "tearing" (showing partial data) while the child is loading. |
| **Deferred / non-critical content** (e.g., comments, recommendations) | Lets the main content render first. The deferred section loads in its own boundary. |

### ❌ DO NOT add extra `Suspense` when:

| Scenario | Why |
|---|---|
| **The root `<Suspense>` in `app.tsx` already covers the route** | SolidStart's root layout typically wraps `{props.children}` in a `<Suspense>`. Route-level data is already caught by this boundary. Only add a *nested* `<Suspense>` if you want a *different* fallback or independent loading. |
| **Static/synchronous components** | Components without any `createAsync` or `createResource` calls never suspend. Adding `<Suspense>` around them is dead code. |
| **Data that is already preloaded and cached** | If `preload` already fired and the cache is warm, `createAsync` resolves instantly. `<Suspense>` won't even flash. It's harmless but don't add it "just in case" around every component. |
| **Client-only data via `onMount`** | If you're fetching inside `onMount` with `createSignal`, you're outside the Suspense system entirely. Use a manual `loading` signal + `<Show>` instead. |

---

## Suspense Placement Strategy

```
app.tsx
└─ <Suspense>  ← ROOT boundary (catches all route transitions)
   └─ Route Page
      ├─ <Suspense fallback={<PageSkeleton />}>  ← PAGE-LEVEL (main content)
      │   └─ Main content using createAsync
      └─ <Suspense fallback={<Spinner />}>  ← SECTION-LEVEL (independent)
          └─ Comments section using createAsync
```

**Rules:**
1. **One root `<Suspense>`** in `app.tsx` around the router's children. This is the catch-all.
2. **One page-level `<Suspense>`** per route page IF you want a page-specific skeleton/fallback different from the root.
3. **Section-level `<Suspense>`** for independent data sections that should not block each other.
4. **Never nest `<Suspense>` boundaries unnecessarily.** Each boundary is a potential loading state the user sees. Too many means a "popcorn" effect.

---

## `"use server"` Directive

Add `"use server"` as the **first statement** inside `query()` (and `action()`) functions when they call the Nest API via `fetcher`. This is the BFF pattern: the browser talks to SolidStart only; SolidStart forwards cookies/locale and calls the backend.

Use `"use server"` when:
- The function calls the Nest API (public or authenticated endpoints)
- The function needs request headers, cookies, or server-only context
- The function is a **service wrapper** that maps API responses and is consumed via `createAsync` on public routes

Service-layer wrappers (e.g. `listShops` in `public-shop.service.ts`) should be `query()` + `"use server"`, not plain `async function` — otherwise mapping runs in the client bundle and cache keys diverge from preloads.

Do NOT call `fetcher` directly from client components for SSR-critical or SEO-sensitive data. Use `query()` + `"use server"` and consume with `createAsync`.

---

## Revalidation & Mutations

**Reads:** `query()` + `"use server"` + `createAsync` (BFF — browser calls SolidStart RPC only).

**Writes:** `action()` + `"use server"` at route or lib boundaries (e.g. `cart.actions.ts`, `checkout/actions.ts`). The action calls plain `fetcher` helpers in `src/lib/api/endpoints/**` and then `revalidate()` / `invalidate*()`. Do **not** wrap API exports in `action()` — keep API layer as plain async functions.

Wire client components with `useAction` + `useSubmission` (or await the trigger for imperative flows). Return `{ success, error? }` envelopes for toast-friendly error handling.

**File uploads:** Build `FormData` on the client and pass it to the action (do not pass raw `File` in JSON). See `src/lib/media/media.actions.ts` and `useImageUpload`.

After a mutation (create, update, delete), revalidate the relevant cached query:

```tsx
import { revalidate, action } from "@solidjs/router";

const deleteProduct = action(async (id: string) => {
  "use server";
  await fetch(`/api/products/${id}`, { method: "DELETE" });
  throw revalidate("products");
});
```

---

## Quick Decision Flowchart

```
Need async data in a component?
│
├─ Is it route-level page data?
│  └─ YES → query() + preload + createAsync + page-level Suspense
│
├─ Is it a section within a page (e.g., sidebar, comments)?
│  └─ YES → query() + createAsync + its own <Suspense> boundary
│
├─ Is it triggered by user action (button click, form submit)?
│  └─ YES → action() + revalidate() (no Suspense needed, use submission state)
│
├─ Is it purely client-side with no SSR need (e.g., localStorage, browser API)?
│  └─ YES → onMount + createSignal + <Show when={!loading}>
│
└─ Is it a one-off reactive async (e.g., debounced search)?
   └─ YES → createResource with a source signal (no query/preload needed)
```

---

## Anti-Patterns to Avoid

1. **❌ `async function MyComponent()`** — Components must be synchronous.
2. **❌ Fetching in `onMount` for SSR-critical data** — The server won't wait for `onMount`. Use `query()` + `createAsync` instead.
3. **❌ Using `createResource` for route data** — It doesn't integrate with SolidStart's cache/revalidation system. Use `createAsync`.
4. **❌ Wrapping every component in `<Suspense>`** — Only wrap components that actually suspend (use `createAsync`).
5. **❌ Forgetting `preload` on routes** — Without `preload`, data fetching starts only after the route component renders, causing waterfalls.
6. **❌ Calling `query()` functions without `createAsync`** — Calling a `query()` function directly returns a raw promise. Always consume it through `createAsync` to get reactivity and Suspense integration.
7. **❌ Calling `fetcher` directly from client components for mutations** — Use `action()` + `"use server"` + `useAction` so writes go through the BFF.
