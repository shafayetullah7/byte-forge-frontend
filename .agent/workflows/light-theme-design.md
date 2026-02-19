---
description: Rules for styling, choosing colors, and designing UI components for ByteForge's light theme
---

# ByteForge Light Theme Design Rules

> This document defines how to style UI components in light mode. For palette definitions and rationale, see `/color-palette-rules`.

---

## Surface Hierarchy

Light mode uses a **layered surface system** to create depth. Higher layers sit "on top" visually.

| Layer | Purpose | Background | Example |
|---|---|---|---|
| **Base** | Page background | `bg-cream-50` | Main body |
| **Surface** | Cards, panels, modals | `bg-white` | Card, dropdown, dialog |
| **Elevated** | Inputs, interactive areas | `bg-white` with border | Form inputs, search bars |
| **Recessed** | Sunken areas, code blocks | `bg-cream-100` or `bg-forest-50` | Code snippets, disabled areas |
| **Overlay** | Modals backdrop | `bg-black/40` | Modal dimming |

### Rules:
1. **Never use `bg-gray-50` or `bg-gray-100`** — Use `bg-cream-100` or `bg-forest-50` for warm recessed areas
2. **Cards should be `bg-white` on `bg-cream-50` base** — The slight contrast creates visual separation without heavy borders
3. **Avoid stacking more than 3 surface layers** — Base → Surface → Elevated is enough. More creates visual noise

---

## Text Color Hierarchy

Use a maximum of **4 text levels** to create clear visual hierarchy.

| Level | Purpose | Color | Example |
|---|---|---|---|
| **Primary** | Headlines, body text | `text-forest-800` | Page titles, paragraphs |
| **Secondary** | Supporting text, labels | `text-forest-700` or `text-gray-600` | Form labels, subtitles |
| **Tertiary** | Captions, hints, timestamps | `text-gray-500` | Helper text, "3 hours ago" |
| **Disabled** | Inactive/unavailable text | `text-gray-400` | Disabled button labels |
| **Brand** | Links, active nav items | `text-forest-600` | Navigation, clickable text |
| **CTA** | Action text | `text-terracotta-600` | "Buy Now", seller prompts |

### Rules:
1. **Default body text is `text-forest-800`** — Not `text-gray-800` or `text-black`. Forest-tinted text keeps the nursery warmth
2. **Links are always `text-forest-600 hover:text-forest-700`** — Consistent, recognizable
3. **Never use `text-black`** — Too harsh. `text-forest-800` or `text-forest-900` max
4. **Gray text is only for tertiary/disabled** — If something is important enough to read, it should be `forest-700` or darker

---

## Border System

| Purpose | Color | Example |
|---|---|---|
| **Default border** | `border-cream-200` | Card edges, section dividers |
| **Subtle border** | `border-cream-100` | Light separators, table rows |
| **Strong border** | `border-cream-300` | Prominent container outlines |
| **Interactive border** | `border-forest-300` | Focused inputs, selected cards |
| **Active/selected** | `border-forest-500` | Active tab, selected item |
| **CTA border** | `border-terracotta-300` | CTA-related highlights |

### Rules:
1. **Default borders use cream, not gray** — `border-cream-200` instead of `border-gray-200`
2. **Interactive focus states use forest** — `focus:border-forest-500 focus:ring-forest-200`
3. **Border radius: use `rounded-lg` or `rounded-xl`** — Soft, organic feel. Avoid sharp corners (`rounded-none`) and pill shapes (`rounded-full`) except for avatars and badges

---

## Button Styles

| Variant | Classes | Use For |
|---|---|---|
| **Primary** | `bg-forest-600 hover:bg-forest-700 text-white` | Main actions: Save, Submit, Confirm |
| **CTA** | `bg-terracotta-500 hover:bg-terracotta-600 text-white` | High-impact: Buy, Sign Up, Start |
| **Secondary** | `bg-forest-50 hover:bg-forest-100 text-forest-700` | Secondary actions: Cancel, Back |
| **Outline** | `border border-cream-300 text-forest-700 hover:bg-cream-50` | Tertiary: Filter, Sort |
| **Ghost** | `text-forest-600 hover:bg-forest-50` | Minimal: Close, Edit inline |
| **Danger** | `bg-red-600 hover:bg-red-700 text-white` | Destructive: Delete, Remove |

### Rules:
1. **Only ONE primary/CTA button per section** — Multiple primary buttons confuse the user
2. **CTA (terracotta) buttons are rare** — Use only for the single most important action on the page
3. **Never use `bg-gray-*` for buttons** — Use `bg-forest-*` or `bg-cream-*` for brand warmth
4. **All buttons: `rounded-lg` and `transition-colors`** — Consistent shape and smooth interaction

---

## Card Design

```
┌─────────────────────────────────┐  ← bg-white, border border-cream-200, rounded-xl
│  ┌──────┐                       │
│  │ Icon │  Title (forest-800)   │  ← font-semibold
│  └──────┘  Subtitle (gray-600) │  ← text-sm
│                                 │
│  Body content...                │  ← text-forest-700
│                                 │
│  [Primary Btn] [Secondary Btn]  │
└─────────────────────────────────┘
```

### Rules:
1. **Card background: `bg-white`** on `bg-cream-50` page background
2. **Card border: `border border-cream-200`** — Soft, warm edge
3. **Card shadow: `shadow-sm`** — Subtle elevation. Use `shadow-md` only for hovered/elevated states
4. **Card padding: `p-6`** — Generous breathing room
5. **Hover state: `hover:shadow-md hover:border-cream-300`** — Slight lift effect
6. **Selected/active card: `border-forest-500 shadow-md`** — Clear selection indicator

---

## Input & Form Design

| Element | Light Theme Classes |
|---|---|
| **Input field** | `bg-white border border-cream-300 rounded-lg text-forest-800 placeholder-gray-400` |
| **Focused input** | `focus:border-forest-500 focus:ring-2 focus:ring-forest-200` |
| **Error input** | `border-red-400 focus:border-red-500 focus:ring-red-200` |
| **Label** | `text-forest-700 text-sm font-medium` |
| **Helper text** | `text-gray-500 text-xs` |
| **Error text** | `text-red-600 text-xs` |
| **Select/dropdown** | Same as input + `bg-white` |

### Rules:
1. **Input backgrounds are always `bg-white`** — Clean, readable
2. **Focus rings use forest** — NOT default blue. `focus:ring-forest-200`
3. **Labels above inputs, not floating** — Clearer, more accessible
4. **Error messages below the input, not inline** — Easier to scan

---

## Navigation

| Element | Classes |
|---|---|
| **Navbar bg** | `bg-white border-b border-cream-200` |
| **Nav link (default)** | `text-forest-700 hover:text-forest-600` |
| **Nav link (active)** | `text-forest-600 font-semibold` |
| **Logo text** | `text-forest-800 font-bold` |
| **Sidebar bg** | `bg-white border-r border-cream-200` |
| **Sidebar item (hover)** | `hover:bg-forest-50` |
| **Sidebar item (active)** | `bg-forest-50 text-forest-700 border-l-2 border-forest-500` |

---

## Badges & Status

| Type | Classes |
|---|---|
| **Forest badge** | `bg-forest-100 text-forest-700` |
| **Sage badge** | `bg-sage-100 text-sage-700` |
| **Terracotta badge** | `bg-terracotta-100 text-terracotta-700` |
| **Cream badge** | `bg-cream-200 text-cream-700` |
| **Success** | `bg-sage-100 text-sage-700 border border-sage-200` |
| **Warning** | `bg-terracotta-100 text-terracotta-700 border border-terracotta-200` |
| **Error** | `bg-red-100 text-red-700 border border-red-200` |
| **Info** | `bg-forest-100 text-forest-700 border border-forest-200` |

---

## Spacing & Layout Rhythm

| Use | Spacing |
|---|---|
| **Between page sections** | `space-y-8` or `gap-8` |
| **Between cards in a grid** | `gap-6` |
| **Between form fields** | `space-y-4` or `gap-4` |
| **Between text blocks** | `space-y-2` |
| **Padding inside cards** | `p-6` |
| **Padding inside page container** | `px-4 sm:px-6 lg:px-8` |
| **Max page width** | `max-w-7xl mx-auto` |

---

## Shadow System

| Level | Class | Use For |
|---|---|---|
| **None** | — | Flat elements on same surface |
| **Subtle** | `shadow-sm` | Cards, dropdowns at rest |
| **Medium** | `shadow-md` | Hovered cards, popovers |
| **Strong** | `shadow-lg` | Modals, floating panels |
| **Extra** | `shadow-xl` | Toasts, notifications |

### Rules:
1. **Shadows are warm, not blue** — If shadows look cold/gray, add `shadow-cream-200/50` or similar
2. **Only increase shadow on interaction** — `shadow-sm` at rest, `shadow-md` on hover
3. **Never combine heavy shadow with heavy border** — Pick one. Shadow OR border, not both at full strength

---

## Color Selection Cheat Sheet

When choosing a color for a new element, follow this decision tree:

```
What is the element?
│
├─ Background/Surface?
│  └─ Page → cream-50
│  └─ Card/Panel → white
│  └─ Recessed/Inset → cream-100 or forest-50
│
├─ Text?
│  └─ Primary content → forest-800
│  └─ Secondary/label → forest-700 or gray-600
│  └─ Hint/caption → gray-500
│  └─ Brand/link → forest-600
│  └─ CTA → terracotta-600
│
├─ Border?
│  └─ Default → cream-200
│  └─ Focus/Active → forest-500
│  └─ Error → red-400
│
├─ Button?
│  └─ Main action → forest-600
│  └─ TOP action → terracotta-500
│  └─ Secondary → forest-50 + forest-700 text
│  └─ Dangerous → red-600
│
├─ Badge/Status?
│  └─ Positive → sage-100 + sage-700
│  └─ Warning → terracotta-100 + terracotta-700
│  └─ Neutral → cream-200 + cream-700
│  └─ Error → red-100 + red-700
│
└─ Icon?
   └─ Default → gray-500
   └─ Brand → forest-600
   └─ Interactive → forest-500 hover:forest-600
   └─ CTA → terracotta-500
```
