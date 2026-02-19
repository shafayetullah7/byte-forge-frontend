---
description: Rules for styling, choosing colors, and designing UI components for ByteForge's dark theme
---

# ByteForge Dark Theme Design Rules

> This document defines how to style UI components in dark mode using Tailwind's `dark:` variant. For palette definitions, see `/color-palette-rules`. For light theme, see `/light-theme-design`.

---

## Core Principle: "Evening Garden"

Dark mode is NOT "invert all the colors." It's a **mood shift** — from a sun-drenched greenhouse (light) to an evening garden under moonlight (dark). The forest palette replaces cream as the dominant surface color, and lighter shades of your brand colors provide contrast.

---

## Surface Hierarchy

Dark surfaces use the **forest palette**, creating a branded dark mode instead of a generic gray one.

| Layer | Purpose | Dark Class | Light Equivalent |
|---|---|---|---|
| **Base** | Page background | `dark:bg-forest-900` | `bg-cream-50` |
| **Surface** | Cards, panels | `dark:bg-forest-800` | `bg-white` |
| **Elevated** | Popovers, menus | `dark:bg-forest-700` | `bg-white` + shadow |
| **Recessed** | Inset areas, code blocks | `dark:bg-forest-900/60` | `bg-cream-100` |
| **Overlay** | Modal backdrop | `dark:bg-black/60` | `bg-black/40` |

### Rules:
1. **Surfaces go darker as they go deeper** — Page (`900`) → Card (`800`) → Popover (`700`). This is the opposite of light mode
2. **Never use `dark:bg-gray-*` for surfaces** — Always use `dark:bg-forest-*` for branded dark mode
3. **Use opacity variants for subtle depth** — `dark:bg-forest-900/60` creates a softer recessed area than a solid shade
4. **Cards should be `dark:bg-forest-800`** — One step above the base, creating visible separation

---

## Text Color Hierarchy

| Level | Purpose | Dark Class | Light Equivalent |
|---|---|---|---|
| **Primary** | Headlines, body | `dark:text-cream-50` or `dark:text-gray-100` | `text-forest-800` |
| **Secondary** | Labels, subtitles | `dark:text-gray-300` | `text-forest-700` |
| **Tertiary** | Captions, hints | `dark:text-gray-400` | `text-gray-500` |
| **Disabled** | Inactive text | `dark:text-gray-500` | `text-gray-400` |
| **Brand** | Links, active nav | `dark:text-forest-300` | `text-forest-600` |
| **CTA** | Action text | `dark:text-terracotta-400` | `text-terracotta-600` |

### Rules:
1. **Primary text: `dark:text-cream-50` or `dark:text-gray-100`** — Off-white is easier on the eyes than pure white
2. **Never use `dark:text-white`** for body text — Too harsh. Reserve pure white for headings or emphasis
3. **Brand links use `dark:text-forest-300`** — Same palette, lighter shade. NOT sage
4. **CTA text uses `dark:text-terracotta-400`** — Lighter terracotta for dark background readability

---

## Border System

| Purpose | Dark Class | Light Equivalent |
|---|---|---|
| **Default border** | `dark:border-forest-700` | `border-cream-200` |
| **Subtle border** | `dark:border-forest-800` | `border-cream-100` |
| **Strong border** | `dark:border-forest-600` | `border-cream-300` |
| **Interactive/focus** | `dark:border-forest-400` | `border-forest-500` |
| **Divider** | `dark:border-forest-700/50` | `border-cream-200` |

### Rules:
1. **All dark borders use `forest-*`** — Never mix `dark:border-gray-*` and `dark:border-forest-*`. Pick forest and stick with it
2. **Borders are subtler in dark mode** — They separate content without being prominent. Use `forest-700` (close to surface `forest-800`), not `forest-500`
3. **Focus borders lighten** — `dark:focus:border-forest-400` to stand out on dark surfaces

---

## Button Styles

| Variant | Dark Classes | Light Equivalent |
|---|---|---|
| **Primary** | `dark:bg-forest-500 dark:hover:bg-forest-400 dark:text-white` | `bg-forest-600` |
| **CTA** | `dark:bg-terracotta-500 dark:hover:bg-terracotta-400 dark:text-white` | `bg-terracotta-500` |
| **Secondary** | `dark:bg-forest-700 dark:hover:bg-forest-600 dark:text-gray-200` | `bg-forest-50` |
| **Outline** | `dark:border-forest-600 dark:text-gray-300 dark:hover:bg-forest-700` | `border-cream-300` |
| **Ghost** | `dark:text-forest-300 dark:hover:bg-forest-700` | `text-forest-600` |
| **Danger** | `dark:bg-red-700 dark:hover:bg-red-600 dark:text-white` | `bg-red-600` |

### Rules:
1. **Primary buttons shift one shade lighter** — `forest-600` → `dark:forest-500`. Dark backgrounds need brighter buttons
2. **Hover states go lighter, not darker** — `dark:hover:bg-forest-400`. In dark mode, hover = brighten
3. **Outline buttons use `dark:border-forest-600`** — Visible but not glaring

---

## Card Design

```
┌─────────────────────────────────┐  ← dark:bg-forest-800, dark:border-forest-700, rounded-xl
│  ┌──────┐                       │
│  │ Icon │  Title (cream-50)     │  ← font-semibold
│  └──────┘  Subtitle (gray-400) │  ← text-sm
│                                 │
│  Body content... (gray-300)     │
│                                 │
│  [Primary Btn] [Secondary Btn]  │
└─────────────────────────────────┘
```

### Rules:
1. **Card bg: `dark:bg-forest-800`** — One step lighter than base
2. **Card border: `dark:border-forest-700`** — Subtle separation
3. **Card shadow: `dark:shadow-none` or very subtle** — Shadows are less effective on dark backgrounds. Use borders for separation instead
4. **Hover: `dark:hover:border-forest-600`** — Brightening the border signals interactivity
5. **Selected: `dark:border-forest-400`** — Clear active indicator

---

## Input & Form Design

| Element | Dark Classes |
|---|---|
| **Input bg** | `dark:bg-forest-800` or `dark:bg-forest-700` |
| **Input border** | `dark:border-forest-600` |
| **Input text** | `dark:text-gray-100` |
| **Placeholder** | `dark:placeholder-gray-500` |
| **Focus** | `dark:focus:border-forest-400 dark:focus:ring-forest-700` |
| **Error** | `dark:border-red-500 dark:focus:ring-red-900` |
| **Label** | `dark:text-gray-300` |
| **Helper text** | `dark:text-gray-500` |

### Rules:
1. **Input bg should be distinguishable from card bg** — If card is `forest-800`, input is `forest-700` (one step lighter)
2. **Focus rings are darker in dark mode** — `dark:focus:ring-forest-700` (subtle glow) instead of a bright ring

---

## Navigation

| Element | Dark Classes |
|---|---|
| **Navbar bg** | `dark:bg-forest-900` (matches page) or `dark:bg-forest-800` (elevated) |
| **Navbar border** | `dark:border-forest-800` or `dark:border-forest-700` |
| **Nav link (default)** | `dark:text-gray-300 dark:hover:text-forest-300` |
| **Nav link (active)** | `dark:text-forest-300 dark:font-semibold` |
| **Logo text** | `dark:text-cream-100` |
| **Sidebar bg** | `dark:bg-forest-800` |
| **Sidebar item (hover)** | `dark:hover:bg-forest-700` |
| **Sidebar item (active)** | `dark:bg-forest-700 dark:text-forest-300` |

---

## Badges & Status

| Type | Dark Classes | Light Equivalent |
|---|---|---|
| **Forest** | `dark:bg-forest-700 dark:text-forest-200` | `bg-forest-100 text-forest-700` |
| **Sage** | `dark:bg-sage-800 dark:text-sage-300` | `bg-sage-100 text-sage-700` |
| **Terracotta** | `dark:bg-terracotta-800 dark:text-terracotta-300` | `bg-terracotta-100 text-terracotta-700` |
| **Cream** | `dark:bg-cream-800 dark:text-cream-200` | `bg-cream-200 text-cream-700` |
| **Success** | `dark:bg-sage-900/40 dark:text-sage-300 dark:border-sage-700` | `bg-sage-100 ...` |
| **Warning** | `dark:bg-terracotta-900/40 dark:text-terracotta-300 dark:border-terracotta-700` | `bg-terracotta-100 ...` |
| **Error** | `dark:bg-red-900/40 dark:text-red-300 dark:border-red-700` | `bg-red-100 ...` |

### Rules:
1. **Use transparent backgrounds for status badges** — `dark:bg-sage-900/40` instead of solid `dark:bg-sage-800`. This lets the card surface show through, making badges feel integrated
2. **Text is light (300 shade), bg is dark (900 + opacity)** — Inverted from light mode

---

## Shadow System

| Level | Dark Class | Light Equivalent |
|---|---|---|
| **None** | — | — |
| **Subtle** | `dark:shadow-none` + `dark:border-forest-700` | `shadow-sm` |
| **Medium** | `dark:shadow-md dark:shadow-black/30` | `shadow-md` |
| **Strong** | `dark:shadow-lg dark:shadow-black/40` | `shadow-lg` |

### Rules:
1. **Shadows are weaker in dark mode** — Dark backgrounds absorb shadows. Rely on borders for visual separation
2. **When shadows are needed, make them black-based** — `dark:shadow-black/30`, not colored shadows
3. **Prefer `dark:shadow-none` + borders** for cards — Cleaner aesthetic on dark surfaces

---

## Color Selection Cheat Sheet (Dark Mode)

```
What is the element?
│
├─ Background/Surface?
│  └─ Page → dark:bg-forest-900
│  └─ Card/Panel → dark:bg-forest-800
│  └─ Popup/Menu → dark:bg-forest-700
│  └─ Recessed → dark:bg-forest-900/60
│
├─ Text?
│  └─ Primary → dark:text-cream-50 or dark:text-gray-100
│  └─ Secondary → dark:text-gray-300
│  └─ Hint → dark:text-gray-400
│  └─ Brand/link → dark:text-forest-300
│  └─ CTA → dark:text-terracotta-400
│
├─ Border?
│  └─ Default → dark:border-forest-700
│  └─ Focus → dark:border-forest-400
│  └─ Error → dark:border-red-500
│
├─ Button?
│  └─ Primary → dark:bg-forest-500
│  └─ CTA → dark:bg-terracotta-500
│  └─ Secondary → dark:bg-forest-700
│  └─ Danger → dark:bg-red-700
│
├─ Badge?
│  └─ Positive → dark:bg-sage-900/40 + dark:text-sage-300
│  └─ Warning → dark:bg-terracotta-900/40 + dark:text-terracotta-300
│  └─ Error → dark:bg-red-900/40 + dark:text-red-300
│
└─ Icon?
   └─ Default → dark:text-gray-400
   └─ Brand → dark:text-forest-300
   └─ Interactive → dark:text-forest-400 dark:hover:text-forest-300
```


> **Quick mapping table:** See `/color-palette-rules` §Light ↔ Dark Mapping for the full class conversion reference.
