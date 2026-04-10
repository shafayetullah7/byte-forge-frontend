---
description: ByteForge layout rules — viewport zones, z-index scale, sidebar/navbar dimensions, modals, forms, tables, images for mobile and desktop
---

# ByteForge Layout Rules

> **Companion to:** `/style-guide` · `/light-theme-design` · `/dark-theme-design`
> **Principle:** Open and spacious — never cramped, cluttered, or dense.
> **Views:** Public (browsing), Buyer (dashboard), Seller (dashboard)

---

## 1. Viewport Zones

### Public Pages

```
┌──────────────────────────────────────┐
│  Navbar (sticky top, h-16)           │
├──────────────────────────────────────┤
│  Full-width hero / content           │
│  (max-w-7xl centered for text/cards) │
├──────────────────────────────────────┤
│  Footer                             │
└──────────────────────────────────────┘
```

- Entire page scrolls, navbar sticks. No sidebar
- Hero sections can be full-bleed (edge-to-edge)
- Content: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`

### Buyer Dashboard

```
┌─────────┬────────────────────────────┐
│ Sidebar │  Topbar (sticky, h-14)     │
│  w-60   ├────────────────────────────┤
│ (fixed) │  Content: max-w-6xl        │
│         │  px-4 sm:px-6 lg:px-8 py-6 │
└─────────┴────────────────────────────┘
```

Sidebar `w-60` (240px) — fewer links. Content `max-w-6xl` (1152px) — simpler pages.

### Seller Dashboard

```
┌─────────┬────────────────────────────┐
│ Sidebar │  Topbar (sticky, h-14)     │
│  w-64   ├────────────────────────────┤
│ (fixed) │  Content: max-w-7xl        │
│         │  px-4 sm:px-6 lg:px-8 py-6 │
└─────────┴────────────────────────────┘
```

Sidebar `w-64` (256px) — more nav sections. Content `max-w-7xl` (1280px) — room for data tables.

---

## 2. Fixed Dimensions

| Element | Dimension | Notes |
|---|---|---|
| **Public Navbar** | `h-16` (64px) | All viewports, consistent |
| **Dashboard Topbar** | `h-14` (56px) | Slimmer — utilitarian |
| **Buyer Sidebar** | `w-60` (240px) | ~5 nav items |
| **Seller Sidebar** | `w-64` (256px) | ~8+ nav items |
| **Content (buyer)** | `max-w-6xl` (1152px) | Simpler pages |
| **Content (seller/public)** | `max-w-7xl` (1280px) | Complex pages / grids |
| **Content padding** | `px-4 sm:px-6 lg:px-8` | Universal |
| **Content vertical** | `py-6` (dashboard), `py-8` (public) | — |

### Total Viewport Utilization

Max width the UI ever occupies — beyond this, background fills the excess.

| View | **Total Max** |
|---|---|
| **Public** | ~1344px (1280 + padding) |
| **Buyer** | ~1456px (240 + 1152 + padding) |
| **Seller** | ~1600px (256 + 1280 + padding) |

**Full-bleed exceptions:** Landing hero, product gallery, map views — use `max-w-full` on that section only.

---

## 3. Z-Index Scale

| Layer | Z-Index | Elements |
|---|---|---|
| **Content** | `z-0` | Page content, cards |
| **Sticky bars** | `z-10` | Dashboard topbar |
| **Dropdowns** | `z-20` | Menus, selects, popovers |
| **Public navbar** | `z-30` | Sticky navbar |
| **Sidebar backdrop** | `z-40` | Mobile overlay |
| **Sidebar panel** | `z-50` | Sidebar (above backdrop) |
| **Modal backdrop** | `z-[60]` | Modal overlay |
| **Modal content** | `z-[65]` | Modal panel |
| **Toasts** | `z-[70]` | Always on top |

**Rules:** Never `z-[9999]`. Toasts > modals > sidebar > navbar > content. Max 3 levels visible at once.

---

## 4. Responsive Breakpoints

| Breakpoint | Width | Changes |
|---|---|---|
| **Mobile** | `< 768px` | Sidebar hidden. Hamburger. Single-column. Full-width cards |
| **Tablet** | `768–1023px` | Sidebar overlay (slide-in + backdrop). 2-column grids |
| **Desktop** | `≥ 1024px` | Sidebar persistent. 3–4 column grids |

### Sidebar Behavior

- **`< lg`:** Hidden. Slides from left with backdrop. Close on link tap or backdrop tap
- **`≥ lg`:** Always visible. No toggle. Part of flex layout

### Navbar Behavior

- **`< md`:** Logo + icons + hamburger. Links → dropdown
- **`≥ md`:** Full horizontal: logo + links + icons + auth

### Touch Targets

| Element | Min Size |
|---|---|
| Buttons | `min-h-[44px]` (Apple HIG / WCAG) |
| Icon buttons | `p-2` (40px) or `p-2.5` (44px) |
| Nav links (mobile) | `py-3 px-4` |
| Tappable list items | `min-h-[48px]` |

### Content by Width

| Element | Mobile | Tablet | Desktop |
|---|---|---|---|
| Card grids | 1 col | 2 col | 3–4 col |
| Product grids | `grid-cols-2` | `grid-cols-3` | `grid-cols-4` |
| Form actions | Stacked | Horizontal | Same |
| Tables | Scroll/stack | Standard | Standard |
| Title + actions | Stacked | Side-by-side | Same |
| Stat cards | 2 col | 3 col | 4 col |

**Grid heuristic:** ≤3 items → stack, no grid. 4–8 items → 2 col mobile, 3 desktop. 9+ items → compact (2→3→4 cols).

### Anti-Patterns

1. Never hide critical content on mobile — simplify, don't remove
2. Never fixed pixel widths — use `w-full` + `max-w-*`
3. Never rely on hover for essential info — mobile has no hover
4. Never horizontal scroll for primary content (tables excepted)
5. Max 3 breakpoint prefixes per element (`sm:`, `md:`, `lg:`)

---

## 5. Scroll Behavior

| Context | Scrolls | Fixed |
|---|---|---|
| Public | Entire page | Navbar (sticky `top-0`) |
| Dashboard | Content only | Sidebar + Topbar |
| Modal open | Body locked | Modal scrolls internally if tall |

**Rules:** Dashboard root: `h-screen flex overflow-hidden`. Sidebar: `overflow-y-auto`. Lock body on modal open.

---

## 6. Modals

| Property | Standard |
|---|---|
| **Sizes** | `max-w-sm` (alert), `max-w-lg` (form), `max-w-2xl` (detail), `max-w-4xl` (complex) |
| **Radius** | `rounded-xl` |
| **Backdrop** | `bg-black/40` |
| **Close** | ESC + backdrop click + close button |
| **Z-index** | Backdrop `z-[60]`, content `z-[65]` |
| **Position** | `fixed inset-0 flex items-center justify-center` |
| **Padding** | `p-6 sm:p-8` |
| **Mobile** | Near-fullscreen: `mx-3 my-4 sm:mx-auto sm:max-w-*` |

**Rules:** Always closeable. One at a time. **Size heuristic:** ≤2 actions, no inputs → `max-w-sm`. 1–4 inputs → `max-w-lg`. Multi-section or preview → `max-w-2xl`. Full editor/wizard → `max-w-4xl`.

---

## 7. Form Layout

| Aspect | Standard |
|---|---|
| **Columns** | Single column. Two-column at `sm+` only for paired fields |
| **Field spacing** | `space-y-4` |
| **Label** | Above input (`mb-1.5`), never beside |
| **Required** | Red `*` after label |
| **Actions** | Bottom, right-aligned: `flex justify-end gap-3` |
| **Divider** | `border-t border-gray-200 dark:border-forest-700 my-6` |
| **Max width** | `max-w-xl` standalone, full-width in modals/cards |

**Mobile:** Buttons stack: `flex-col-reverse sm:flex-row` (primary on top for thumb reach).

---

## 8. Tables

| Aspect | Standard |
|---|---|
| **Container** | `rounded-xl overflow-hidden border border-gray-200 dark:border-forest-700` |
| **Header** | `bg-cream-50 dark:bg-forest-800` · `text-xs font-medium text-gray-500 uppercase tracking-wider` |
| **Row hover** | `hover:bg-cream-50/50 dark:hover:bg-forest-700/30` |
| **Divider** | `divide-y divide-gray-100 dark:divide-forest-700` |
| **Cells** | `px-4 py-3`. Left for text, right for numbers |
| **Empty** | Empty state from `/style-guide` §8 |

**Mobile:** `overflow-x-auto` scroll or convert rows to stacked cards.

---

## 9. Images

| Context | Ratio | Fit | Radius |
|---|---|---|---|
| Product thumb | `aspect-square` | `object-cover` | `rounded-lg` |
| Product detail | `aspect-[4/3]` | `object-cover` | `rounded-xl` |
| Shop banner | `aspect-[3/1]` | `object-cover` | `rounded-xl` |
| Avatar | `aspect-square` | `object-cover` | `rounded-full` |
| Hero | `min-h-[50vh] max-h-[70vh]` | `object-cover` | None (edge-to-edge) |

**Rules:** Always `object-cover`. Skeleton: `bg-cream-200 dark:bg-forest-700 animate-pulse`. `loading="lazy"` below fold. Alt text required. Product images always 1:1.

---

## Layout DNA Checklist

| ☐ | Check |
|---|---|
| ☐ | Correct shell (public / buyer / seller)? |
| ☐ | Content within correct max-width? |
| ☐ | Padding `px-4 sm:px-6 lg:px-8`? |
| ☐ | Z-index from scale only? |
| ☐ | Sidebar hidden `< lg`, persistent `≥ lg`? |
| ☐ | Forms single-column, labels above, buttons right? |
| ☐ | Tables mobile-readable? |
| ☐ | Images: ratio + cover + skeleton? |
| ☐ | Modals closeable (ESC + backdrop + button)? |
