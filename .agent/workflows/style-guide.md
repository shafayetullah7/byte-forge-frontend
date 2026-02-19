---
description: ByteForge component style guide — typography, shape, spacing, elevation, motion, icons, states, layout, and visual weight rules for consistent UI design
---

# ByteForge Component Style Guide

> **Theme:** Modern Nursery Marketplace — warm, organic, trustworthy  
> **Audience:** Nursery owners + plant enthusiasts  
> **Device:** Balanced mobile and desktop  
> **Color rules:** `/color-palette-rules` · `/light-theme-design` · `/dark-theme-design`

---

## 1. Typography

### Font: Plus Jakarta Sans (Google Fonts — free)

Rounded letterforms — organic, professional, distinctive. Load via Google Fonts CDN or `@fontsource/plus-jakarta-sans`.

### Scale

| Element | Size | Weight | Color (Light) | Color (Dark) |
|---|---|---|---|---|
| Page title (h1) | `text-2xl md:text-3xl` | `font-bold` (700) | `text-forest-800` | `dark:text-cream-50` |
| Section title (h2) | `text-xl md:text-2xl` | `font-bold` (700) | `text-forest-800` | `dark:text-cream-100` |
| Card title (h3) | `text-lg` | `font-semibold` (600) | `text-forest-700` | `dark:text-cream-100` |
| Subtitle | `text-base` | `font-normal` (400) | `text-gray-600` | `dark:text-gray-400` |
| Body | `text-base` | `font-normal` (400) | `text-forest-800` | `dark:text-gray-200` |
| Body small | `text-sm` | `font-normal` (400) | `text-forest-700` | `dark:text-gray-300` |
| Caption/hint | `text-xs` | `font-normal` (400) | `text-gray-500` | `dark:text-gray-500` |
| Label | `text-sm` | `font-medium` (500) | `text-forest-700` | `dark:text-gray-300` |
| Button | `text-sm` to `text-base` | `font-medium` (500) | Depends on variant | — |
| Badge | `text-xs` to `text-sm` | `font-medium` (500) | Palette-specific | — |

**Rules:** Weights 400/500/600/700 only. `leading-tight` headings, `leading-normal` body. Max 3 sizes per section. No ALL CAPS beyond 2 words. Truncate cards: `line-clamp-2`/`line-clamp-3`.

---

## 2. Shape — Organic, Not Geometric

| Element | Border Radius | Rule |
|---|---|---|
| Cards, panels, modals | `rounded-xl` | Large containers = generous rounding |
| Buttons, inputs, selects | `rounded-lg` | Interactive elements = medium rounding |
| Badges, tags | `rounded-full` | Small indicators = pill shape |
| Avatars | `rounded-full` | Always circular |
| Images (product/plant) | `rounded-lg` to `rounded-xl` | Matches their container |
| Toasts | `rounded-lg` | Same as interactive elements |
| Tooltips | `rounded-md` | Small, secondary elements |

**Rules:** Never `rounded-none` or `rounded-sm`. All elements in a group share the same radius.

---

## 3. Density & Breathing Room

Open and airy, like a well-spaced nursery.

### Internal Padding (inside elements)

| Element | Padding |
|---|---|
| Cards | `p-5 sm:p-6` |
| Modals | `p-6 sm:p-8` |
| Buttons (sm) | `px-4 py-2` |
| Buttons (md) | `px-5 py-2.5` |
| Buttons (lg) | `px-6 py-3` |
| Inputs | `px-4 py-2.5` |
| Badges | `px-2.5 py-0.5` (sm) or `px-3 py-1` (md) |
| Table cells | `px-4 py-3` |

### External Spacing

| Context | Spacing |
|---|---|
| Page sections | `space-y-8` or `gap-8` |
| Card grids | `gap-5 sm:gap-6` |
| Form fields | `space-y-4` |
| Text paragraphs | `space-y-2` |
| Label → input | `mb-1.5` |
| Title → content | `mb-4`–`mb-6` |

### Page Container

```
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

**Rules:** Min card gap: `gap-4`. Never `p-2` for cards (`p-5` min). Mobile edge padding: `px-4`. Empty states: `py-12`–`py-16`.

---

## 4. Elevation & Depth

Subtle depth. A gentle hill, not a skyscraper.

| Level | Light Mode | Dark Mode | Use For |
|---|---|---|---|
| **Flat** | No shadow | No shadow | Inline, text, badges |
| **Resting** | `shadow-sm` | `dark:shadow-none` + border | Cards at rest |
| **Hover** | `shadow-md` | `dark:shadow-sm dark:shadow-black/20` | Hovered cards |
| **Floating** | `shadow-lg` | `dark:shadow-md dark:shadow-black/30` | Dropdowns, menus |
| **Overlay** | `shadow-xl` | `dark:shadow-lg dark:shadow-black/40` | Modals |

**Rules:** Dark mode: borders over shadows. Escalate only on interaction (rest → hover). Never heavy shadow + heavy border. Max 3 levels per screen.

---

## 5. Motion & Animation

Minimal. A gentle breeze, not a carnival.

### Transitions (the only motion in the app)

| Property | Duration | Easing | Class |
|---|---|---|---|
| Color/opacity changes | 200ms | ease-in-out | `transition-colors duration-200` |
| Shadow/elevation changes | 200ms | ease-out | `transition-shadow duration-200` |
| Border changes | 150ms | ease-in-out | `transition-colors duration-150` |
| Visibility (fade in/out) | 200–300ms | ease-out | `transition-opacity duration-200` |

**✅ Animates:** bg color, border color, shadow, opacity (enter/exit), skeleton pulse.

**❌ Never:** Sliding transitions, bouncing/rotating/scaling, parallax, spring physics, staggered reveals.

**Rules:** `transition-colors` on every interactive element. Duration: `200ms`. Never `duration-500`+. No animation on page load.

---

## 6. Interactive Feedback

Every interactive element must respond — gentle, not aggressive.

### Hover States

| Element | Hover Effect |
|---|---|
| Primary button | Darken bg one shade (`forest-600 → forest-700`) |
| Card | Lift shadow (`shadow-sm → shadow-md`) + brighten border |
| Link | Darken color one shade + optional underline |
| Nav item | Shift text color to `forest-600` |
| Icon button | Soft bg circle appears (`hover:bg-forest-50`) |

### Focus States

| Element | Focus Effect |
|---|---|
| Buttons | `focus:ring-2 focus:ring-forest-200 focus:ring-offset-1` |
| Inputs | `focus:border-forest-500 focus:ring-2 focus:ring-forest-200` |
| Links | `focus-visible:outline-2 focus-visible:outline-forest-500 focus-visible:outline-offset-2` |

**Disabled:** `opacity-50 cursor-not-allowed`. No hover effects.

**Rules:** Every clickable element needs visible hover. Focus must be visible (keyboard a11y). No special active/pressed style needed.

---

## 7. Iconography

Heroicons outline only. `stroke-width="1.5"`. Always `currentColor`.

### Sizes

| Context | Size |
|---|---|
| Inline with text | `w-4 h-4` |
| Standalone small | `w-5 h-5` |
| Standalone medium | `w-6 h-6` |
| Decorative/empty state | `w-8 h-8`–`w-10 h-10` |

**Rules:** Never mix outline/filled. Icon + text: `gap-2`. Icon buttons: `p-2 rounded-lg`.

---

## 8. State Communication

### Loading

| Context | Treatment |
|---|---|
| Page/section | Skeleton `animate-pulse` in `bg-cream-200 dark:bg-forest-700` |
| Button | Spinner inside, text stays, button disabled |
| Inline | `text-gray-400` placeholder or small spinner |

### Empty States

```
[  Icon (w-10 h-10, gray-400)  ]
    Title (text-lg, font-medium)
  Description (text-sm, gray-500)
     [ Action Button ]
```

Centered (`py-12 px-4`). Friendly tone ("No plants yet" not "No data found"). Always include an action.

### Error States

| Context | Treatment |
|---|---|
| Form field error | Red border (`border-red-400`) + message below (`text-red-600 text-xs`) |
| Full page error | Centered message with retry button |
| Toast error | Red-accented toast, auto-dismiss after 4s |
| API error | Friendly message: "Something went wrong" + retry action |

### Success States

| Context | Treatment |
|---|---|
| Form submitted | Sage/forest toast, auto-dismiss after 3s |
| Action completed | Brief inline confirmation or toast |
| Status badge | `bg-sage-100 text-sage-700` |

### Rules:
1. **Skeletons match content shape** — Card skeleton looks like a card
2. **Errors always below the field**, not above or inline
3. **Success is brief** — 3s toast, don't linger
4. **Empty states always have an action**

---

## 9. Page Layout Hierarchy

Every page follows this structure:

```
┌──────────────────────────────────────────────────────┐
│  Breadcrumbs (text-sm, text-gray-500)        ← opt  │
│                                                      │
│  Page Title (text-2xl+, font-bold)                   │
│  Subtitle (text-base, text-gray-600)         ← opt  │
│                                    [ Actions ]       │
│                                                      │
│  ─ ─ ─ ─ ─ ─ ─ mb-6 to mb-8 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │
│                                                      │
│  Main Content                                        │
│  (Cards / Lists / Forms / Tables)                    │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Rules:
1. **Title: top-left** — Never centered (except landing pages)
2. **Actions: top-right** — `flex justify-between items-center`
3. **Header–content gap: `mb-6`–`mb-8`**
4. **Sidebar: always left** — Dashboard pages only
5. **Max width: `max-w-7xl`**

### Responsive Layout

| Screen | Behavior |
|---|---|
| Mobile (`< sm`) | Single column, full-width cards, collapsible sidebar |
| Tablet (`sm` to `lg`) | 2-column grids, sidebar overlay |
| Desktop (`lg+`) | Full layout with persistent sidebar, 3–4 column grids |

**Grid system for card grids:**
```
grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6
```

---

## 10. Visual Weight — 60-30-10

Every screen must feel balanced.

```
  60% ──────────────────────── Neutral (cream, white, gray text)
  30% ───────────── Forest (nav, buttons, links, borders)
  10% ──── Terracotta + Sage (CTAs, badges, status)
```

### Self-Check:
1. Mostly cream/white with forest accents? → ✅
2. Dominated by green? → ❌ Reduce forest
3. Terracotta on 3+ elements? → ❌ Diluted CTA
4. Looks generic? → ❌ Add forest accents
5. Recognizable as ByteForge in 2s? → ✅

---

## ByteForge DNA Checklist

Every component must pass:

| Check | Criterion |
|---|---|
| ☐ Shape | Rounded corners (`rounded-lg` or `rounded-xl`)? |
| ☐ Spacing | Generous padding (`p-5+` for containers)? |
| ☐ Typography | Plus Jakarta Sans, correct weight and size from the scale? |
| ☐ Color | Uses only palette colors (forest, sage, terracotta, cream, gray)? |
| ☐ Depth | Subtle shadow (`shadow-sm` max at rest)? |
| ☐ Motion | Only `transition-colors duration-200`? No animation? |
| ☐ Interaction | Visible hover + focus states? |
| ☐ Dark mode | `dark:` variant for every visual property? |
| ☐ Responsive | Works at `sm`, `md`, and `lg` breakpoints? |
| ☐ Weight | Follows 60-30-10 distribution? |
