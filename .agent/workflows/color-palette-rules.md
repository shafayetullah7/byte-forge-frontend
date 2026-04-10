---
description: ByteForge color palette philosophy, selection rationale, role assignments, and usage rules for light and dark mode
---

# ByteForge Color Palette Design Rules

## Theme Identity: "Open Field Nursery & Garden"

ByteForge serves nursery owners and plant buyers in Bangladesh. The design is inspired by the **familiar, grounded reality of local nurseries** — open fields, rows of clay pots (mati), and the vibrant, organic growth of sub-tropical plants.

- **Light mode** → High-noon garden: Clear, bright, and organic with earthy accents.
- **Dark mode** → Moonlit nursery: Deep shadows, soft silhouettes, and sturdy foliage.

Every color choice must reinforce this local identity. If a color or effect (like glassmorphism) feels "digital-first" rather than "material-first," it doesn't belong.

---

## The Four Palettes and Their Roles

### 🌲 Forest Green — Primary Brand

| Property | Value |
|---|---|
| **Real-world source** | Deep forest canopy, mature plant foliage |
| **Emotion** | Trust, stability, growth, nature |
| **Role** | Brand identity — logo, navbar, primary buttons, links, active states |
| **Distribution** | ~30% of the UI |

**Rules:**
1. Forest is the **only** color used for primary buttons and brand elements
2. Forest must remain the brand color in **both** light and dark mode — never swap it for sage or any other color
3. In dark mode, use **lighter** forest shades (300–400) for text/accents on dark backgrounds
4. In light mode, use **darker** forest shades (600–700) for text/accents on light backgrounds

---

### 🏺 Terracotta — Secondary Brand (The Mati)

| Property | Value |
|---|---|
| **Real-world source** | Clay pots, terracotta planters, warm earth |
| **Emotion** | Warmth, energy, artisanal, grounded |
| **Role** | Secondary actions, active highlights, sidebar icons, prominent badges |
| **Distribution** | ~20% of the UI |

**Rules:**
1. Terracotta is the **default secondary color** for buttons and interactive highlights.
2. Use Terracotta to provide warmth and contrast against Forest Green.
3. In dark mode, use `terracotta-400` for borders and text highlights on deep forest surfaces.
4. Terracotta represents the "Material" in our material-first aesthetic.

---

### 🌿 Sage Green — Status & Verification

| Property | Value |
|---|---|
| **Real-world source** | Fresh leaves, healthy growth, clear sky |
| **Emotion** | Calm, success, safety, verified |
| **Role** | Purely functional states — success messages, verified badges, active "online" status |
| **Distribution** | ~5% of the UI (utility-specific) |

**Rules:**
1. Sage is **strictly functional**. It communicates "Success" or "Correct."
2. Do NOT use Sage for brand accents or general UI navigation.
3. Sage should always feel supportive, never dominant.

---

### 🥛 Cream — Warmth & Background

| Property | Value |
|---|---|
| **Real-world source** | Natural paper, canvas bags, sand, sunlit surfaces |
| **Emotion** | Warmth, comfort, organic, handcrafted |
| **Role** | Backgrounds, card surfaces, subtle borders — replaces cold white/gray |
| **Distribution** | ~55% of the UI (the dominant neutral) |

**Rules:**
1. **Light mode backgrounds should use cream, not pure white** — `cream-50` for page backgrounds, `white` or `cream-50` for cards
2. Cream replaces Tailwind's `gray-*` for warm neutrals. Use `cream-200` for borders instead of `gray-200` in light mode
3. In dark mode, cream is NOT used for surfaces — forest dark shades take over. Cream is only for text accents or subtle highlights in dark mode
4. The cream palette encodes the "warmth" of the nursery aesthetic. Removing it makes the app feel generic

---

## Light ↔ Dark Class Mapping

Quick lookup for converting any light-mode class to its dark equivalent. For full component rules, see `/dark-theme-design`.

| Light | Dark |
|---|---|
| `bg-cream-50` | `dark:bg-forest-900` |
| `bg-white` | `dark:bg-forest-800` |
| `bg-cream-100` | `dark:bg-forest-900/60` |
| `bg-forest-50` | `dark:bg-forest-700` |
| `text-forest-800` | `dark:text-cream-50` |
| `text-forest-700` | `dark:text-gray-300` |
| `text-gray-600` | `dark:text-gray-400` |
| `text-gray-500` | `dark:text-gray-500` |
| `text-forest-600` | `dark:text-forest-300` |
| `text-terracotta-600` | `dark:text-terracotta-400` |
| `border-cream-200` | `dark:border-forest-700` |
| `border-cream-300` | `dark:border-forest-600` |
| `border-forest-500` | `dark:border-forest-400` |
| `bg-forest-600` (btn) | `dark:bg-forest-500` |
| `bg-terracotta-500` (btn) | `dark:bg-terracotta-500` (same) |
| `shadow-sm` | `dark:shadow-none` |
| `shadow-md` | `dark:shadow-md dark:shadow-black/30` |
| `hover:bg-forest-50` | `dark:hover:bg-forest-700` |
| `hover:bg-forest-100` | `dark:hover:bg-forest-600` |

---

## Palette Construction Rules

When generating or fixing palette shades (50–900), follow these rules:

1. **Even lightness steps** — Each shade should drop ~8–10 points in perceived lightness. No sudden jumps.
2. **500 is the "anchor"** — This is the most recognizable shade. It should be the color that comes to mind when someone says "forest green" or "terracotta."
3. **50–100 are tints** — Very light, used for backgrounds and subtle fills. Should feel like "a whisper" of the color.
4. **200–300 are light accents** — Used for borders, badges, hover states on light backgrounds.
5. **400 is the transition** — Where light meets dark. Should work as text on white AND as text on dark with opacity.
6. **600–700 are deep accents** — Primary button colors, strong borders, bold text on light backgrounds.
7. **800–900 are darks** — Used as dark mode surfaces or very dark text. Should still be visibly "green" or "terracotta," not just black.

---

## Forbidden Patterns

1. **❌ Swapping brand color in dark mode** — `forest-600 dark:sage-500` is forbidden. Use `forest-600 dark:forest-400` instead.
2. **❌ Using `gray-*` for borders when dark surfaces use `forest-*`** — Pick one neutral system per mode.
3. **❌ Pure `white` backgrounds in light mode** — Use `cream-50` for warmth. Reserve `white` only for card surfaces or inputs.
4. **❌ Using Terracotta for destructive actions** — Use red for danger.
5. **❌ Diluting Terracotta too much** — While secondary, keeps its warmth; don't use it for inert layout borders.
5. **❌ Defining colors outside @theme** — All palette colors belong in Tailwind's @theme.
6. **❌ Ad-hoc hex colors in components** — Every color used must trace back to a named palette token.
7. **❌ Digital-first effects** — Avoid backdrop-blur, glassmorphism, or high transparency. Use solid material colors for legibility.

---

## When to Revisit This Document

Return to this document when:
- Adding a new color palette (e.g., `danger`, `info`)
- The UI "feels off" after a design change — check if a forbidden pattern was introduced
- Dark mode looks inconsistent — verify the mapping table above
- A new developer joins and needs to understand why specific colors were chosen
- Considering a rebrand — the "Modern Nursery" identity anchors all color decisions
