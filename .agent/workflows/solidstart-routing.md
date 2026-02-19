---
description: SolidStart file-based routing, layouts, route groups, params, navigation, and route protection rules
---

# SolidStart Routing Rules

## File-Based Routing Fundamentals

SolidStart uses the `src/routes/` directory to automatically generate routes. Every file becomes a URL path.

### File → URL Mapping

| File Path | URL | Notes |
|---|---|---|
| `routes/index.tsx` | `/` | Home page |
| `routes/about.tsx` | `/about` | Static page |
| `routes/about/index.tsx` | `/about` | Same as above (folder style) |
| `routes/blog/[slug].tsx` | `/blog/:slug` | Dynamic param |
| `routes/blog/[slug]/index.tsx` | `/blog/:slug` | Same (folder style) |
| `routes/docs/[...path].tsx` | `/docs/*path` | Catch-all param |
| `routes/users/[[id]].tsx` | `/users/:id?` | Optional param |

**Convention:** Always prefer `folder/index.tsx` over `folder.tsx` for page components. Reserve `folder.tsx` (same name as a folder) exclusively for **layout components**.

---

## Route Groups (Parenthesized Folders)

Folders wrapped in parentheses `()` create **logical groups** that do NOT appear in the URL.

```
routes/
├── (auth)/           ← group (no /auth in URL)
│   ├── (auth).tsx    ← layout for all auth routes
│   ├── login/
│   │   └── index.tsx ← URL: /login
│   └── register/
│       └── index.tsx ← URL: /register
├── (app)/            ← group
│   ├── (app).tsx     ← layout for public app routes
│   └── index.tsx     ← URL: /
└── (protected)/      ← group
    ├── (protected).tsx ← layout with auth guard
    └── dashboard/
        └── index.tsx   ← URL: /dashboard
```

### When to use route groups:
- **Shared layouts** — Group routes that share a common layout (e.g., all auth pages share a centered card layout)
- **Shared guards** — Group routes that share the same access control (e.g., all protected routes behind auth)
- **Organizational clarity** — Separate public vs authenticated vs admin routes

### Rules:
1. The group folder name in parentheses does NOT affect the URL.
2. A layout file for a group is named `(groupName).tsx` and placed **next to** (not inside) the group folder.
3. Route groups can be nested: `(protected)/app/(buyer)/` is valid.

---

## Layouts

A layout wraps a set of routes with shared UI (navbar, sidebar, footer, etc.).

### How to create a layout:

A file with the **same name as a folder** (or route group) becomes the layout for that folder's routes.

```
routes/
├── (app).tsx          ← Layout for everything inside (app)/
├── (app)/
│   └── index.tsx      ← Wrapped by (app).tsx
```

### Layout component pattern:

```tsx
// routes/(app).tsx
import { RouteSectionProps } from "@solidjs/router";

export default function AppLayout(props: RouteSectionProps) {
  return (
    <>
      <Navbar />
      <main>{props.children}</main>  {/* ← child routes render here */}
      <Footer />
    </>
  );
}
```

### Rules:
1. **Always use `props.children`** — This is where nested routes render. Forgetting it means child pages won't appear.
2. **Always type props as `RouteSectionProps`** — This gives you `children`, `params`, `location`, and `data`.
3. **Layouts are isomorphic** — They run on both server and client. Do not use browser APIs directly in the layout body.
4. **One root layout** — Defined via `<Router root={...}>` in `app.tsx`. This is the outermost shell.
5. **Nested layouts stack** — If you have `(protected).tsx` → `app/seller.tsx` → `(seller-protected).tsx`, all three layouts wrap the final page in order.

---

## Dynamic Parameters

### Defining params:

| Syntax | Meaning | Example URL |
|---|---|---|
| `[id]` | Required param | `/orders/abc123` |
| `[[id]]` | Optional param | `/orders` or `/orders/abc123` |
| `[...path]` | Catch-all (rest) | `/docs/a/b/c` → `path = "a/b/c"` |

### Accessing params:

```tsx
import { useParams } from "@solidjs/router";

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  // params.id is reactive — access it in JSX or effects
  return <div>Order: {params.id}</div>;
}
```

### Rules:
1. **Always type `useParams` with a generic** — `useParams<{ id: string }>()` for type safety.
2. **Params are reactive** — Access `params.id` inside JSX or `createEffect`, not destructured at the top level.
3. **Use folder style for parameterized routes** — `orders/[id]/index.tsx`, not `orders/[id].tsx`. This allows adding sibling routes like `orders/[id]/edit/index.tsx` later.

---

## Navigation

### Declarative navigation with `<A>`:

```tsx
import { A } from "@solidjs/router";

// Basic link
<A href="/about">About</A>

// Active link styling
<A href="/dashboard" activeClass="text-blue-500" inactiveClass="text-gray-500">
  Dashboard
</A>

// With query params
<A href="/products?category=plants">Plants</A>
```

### Programmatic navigation with `useNavigate`:

```tsx
import { useNavigate } from "@solidjs/router";

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login();
    navigate("/dashboard");          // push
    navigate("/dashboard", { replace: true }); // replace (no back button)
  };
}
```

### Rules:
1. **Always use `<A>` instead of `<a>`** — `<A>` enables client-side navigation without full page reloads, and supports `preload` on hover.
2. **Use `useNavigate` for programmatic redirects** — After form submissions, auth flows, etc.
3. **Never use `window.location.href` for internal navigation** — It triggers a full page reload and destroys client state.

---

## Route Protection (Guards)

SolidStart does not have a built-in "route guard" API. Use these patterns instead:

### Pattern 1: Layout-level redirect (recommended for UI guards)

```tsx
// routes/(protected).tsx
import { RouteSectionProps } from "@solidjs/router";
import { createAsync, useNavigate } from "@solidjs/router";
import { Show } from "solid-js";

export default function ProtectedLayout(props: RouteSectionProps) {
  const user = createAsync(() => getSession());
  const navigate = useNavigate();

  createEffect(() => {
    if (user() === null) {
      navigate("/login", { replace: true });
    }
  });

  return (
    <Show when={user()}>
      {props.children}
    </Show>
  );
}
```

### Pattern 2: Middleware (recommended for security-critical guards)

```tsx
// src/middleware/index.ts
import { createMiddleware } from "@solidjs/start/middleware";

export default createMiddleware({
  onRequest: [
    (event) => {
      // Runs on the SERVER for every request
      // Check cookies, tokens, etc.
      // Redirect if unauthorized
    },
  ],
});
```

### Rules:
1. **Never rely solely on client-side guards for security** — A user can bypass client redirects. Always enforce authorization on the server (in `query()` functions with `"use server"`, middleware, or API routes).
2. **Use layout-level guards for UX** — Redirect users away from pages they shouldn't see (e.g., logged-in users away from `/login`).
3. **Use middleware for global, server-enforced rules** — Rate limiting, authentication checks, CORS. But note: middleware may not run on every client-side navigation.
4. **Protect the data, not just the route** — Even if a protected page loads, the `query()` function behind it should independently verify authorization and throw/redirect if invalid.

---

## Route Preloading

Preloading tells SolidStart to fetch data **before** the component renders, eliminating waterfalls.

```tsx
// routes/products/index.tsx
import { createAsync } from "@solidjs/router";
import type { RouteDefinition } from "@solidjs/router";
import { getProducts } from "~/lib/api/get-products";

export const route = {
  preload: () => getProducts(),
} satisfies RouteDefinition;

export default function ProductsPage() {
  const products = createAsync(() => getProducts());
  // Data is already fetching (or cached) by the time this runs
  return <ProductList products={products()} />;
}
```

### Rules:
1. **Always export a `route` with `preload`** for pages that fetch data — This is the #1 performance optimization.
2. **`preload` must call the same `query()` function** that `createAsync` uses — This is how the cache connects the two. If they call different functions, preloading is wasted.
3. **`preload` fires on link hover** — When a user hovers over an `<A>` link, the data starts loading before they even click. This is free performance.
4. **`preload` receives `{ params, location }`** — Use these to pass dynamic values to the query function.

```tsx
export const route = {
  preload: ({ params }) => getOrder(params.id),
} satisfies RouteDefinition;
```

---

## 404 / Catch-All Routes

```tsx
// routes/[...404].tsx
export default function NotFound() {
  return (
    <main>
      <h1>404 — Page Not Found</h1>
      <A href="/">Go Home</A>
    </main>
  );
}
```

### Rules:
1. **Name the file `[...404].tsx`** — The `...` makes it a catch-all. It matches any URL not matched by other routes.
2. **Place it at the root of `routes/`** — So it catches everything.
3. **Set the HTTP status** — Use `HttpStatusCode` from `@solidjs/start` to return a proper 404 to crawlers.

```tsx
import { HttpStatusCode } from "@solidjs/start";

export default function NotFound() {
  return (
    <>
      <HttpStatusCode code={404} />
      <h1>Page Not Found</h1>
    </>
  );
}
```

---

## Quick Reference: Common Hooks

| Hook | Purpose | Example |
|---|---|---|
| `useParams()` | Access dynamic route params | `const { id } = useParams()` |
| `useSearchParams()` | Access query string `?key=val` | `const [params, setParams] = useSearchParams()` |
| `useLocation()` | Get current path, search, hash | `const loc = useLocation()` |
| `useNavigate()` | Programmatic navigation | `navigate("/path")` |
| `useMatch(() => path)` | Check if a path matches | `const match = useMatch(() => "/about")` |
| `useIsRouting()` | Check if a navigation is in progress | `const isRouting = useIsRouting()` |
| `usePreloadRoute()` | Imperatively preload a route | `const preload = usePreloadRoute()` |
| `useBeforeLeave()` | Prompt user before leaving a page | Unsaved form confirmation |

---

## Anti-Patterns to Avoid

1. **❌ Using `<a href="...">` for internal links** — Always use `<A>` from `@solidjs/router`.
2. **❌ Putting page components in `folder.tsx` instead of `folder/index.tsx`** — Reserve `folder.tsx` for layouts only.
3. **❌ Destructuring params at the top level** — `const { id } = useParams()` loses reactivity. Access `params.id` directly.
4. **❌ Forgetting `props.children` in layouts** — Child routes won't render.
5. **❌ Creating a route group for a single route** — Route groups are for shared layouts/guards across multiple routes. A single route doesn't need one.
6. **❌ Relying only on client-side redirects for security** — Always protect data on the server.
7. **❌ Skipping `preload` on data-heavy pages** — This is the easiest performance win in SolidStart.
