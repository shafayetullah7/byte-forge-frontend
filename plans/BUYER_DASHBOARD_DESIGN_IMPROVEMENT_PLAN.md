# Dashboard Design Improvement Plan

## Objective
Improve the buyer dashboard ecosystem to align with the project's design system as defined in [`DESIGN_SYSTEM_ALIGNMENT.md`](plans/DESIGN_SYSTEM_ALIGNMENT.md). This includes:
- **Topbar** - Dashboard header navigation
- **Sidebar** - Dashboard navigation menu
- **Buyer Dashboard Page** - Main dashboard content
- **UserMenu** - Already completed ✓

## Design Coherence Principles

1. **Consistent Color Palette** - Use forest/cream/terracotta/sage tokens throughout
2. **Typography Tokens** - Use h5, h6, body-base, body-small utilities
3. **Component Patterns** - Use flat-card, flat-card-hover utilities
4. **Spacing Consistency** - Use standard spacing (gap-2, gap-3, px-3, py-2.5)
5. **Transition Standard** - Use transition-standard utility for all interactive elements

---

## Component Analysis & Improvements

### A. Topbar Component (`src/components/layout/dashboard/Topbar.tsx`)

#### Current Issues:
1. Uses `text-gray-500`, `text-gray-400`, `text-gray-700`, `text-gray-200` instead of design tokens
2. Uses `text-xs` instead of `body-small`
3. Search input uses `bg-cream-50` but could be more consistent
4. Button hover states use arbitrary colors

#### Proposed Changes:

**1. Header Container:**
```tsx
// Current
<header class="bg-white dark:bg-forest-800 border-b border-cream-200 dark:border-forest-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10 sticky top-0">

// Proposed (same, already aligned)
<header class="bg-white dark:bg-forest-800 border-b border-cream-200 dark:border-forest-700 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10 sticky top-0">
```

**2. Mobile Menu Button:**
```tsx
// Current
<button class="p-2 -ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 md:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500">

// Proposed
<button class="p-2 -ml-2 text-forest-700/70 dark:text-cream-100/70 hover:text-forest-600 dark:hover:text-cream-100 md:hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-500/30 transition-standard">
```

**3. Search Input:**
```tsx
// Current
<div class="relative max-w-md w-full hidden sm:block">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
    <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
  </div>
  <Input type="text" placeholder="Search..." class="pl-10 bg-cream-50 dark:bg-forest-700/50 focus:bg-white dark:focus:bg-forest-800" />
</div>

// Proposed
<div class="relative max-w-md w-full hidden sm:block">
  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
    <MagnifyingGlassIcon class="h-5 w-5 text-forest-600/70 dark:text-forest-400" />
  </div>
  <Input
    type="text"
    placeholder={t("common.search")}
    class="pl-10 bg-cream-50 dark:bg-forest-900/40 focus:bg-white dark:focus:bg-forest-800 border-cream-200 dark:border-forest-700 focus:border-forest-500"
  />
</div>
```

**4. Dashboard Toggle Buttons (Buyer/Seller):**
```tsx
// Current - Already using design tokens, just refine
<A
  href="/app"
  class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-standard"
  classList={{
    "bg-forest-100 border-forest-200 text-forest-800 dark:bg-forest-900/40 dark:border-forest-700 dark:text-cream-100": !isSeller(),
    "bg-forest-50 border-forest-100 text-forest-700 dark:text-cream-100/70 hover:border-forest-300 hover:bg-forest-100 dark:hover:border-forest-600 dark:hover:bg-forest-800": isSeller()
  }}
>
```

**5. Language Switcher:**
```tsx
// Current
<button class="flex items-center gap-1.5 p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-300 hover:bg-forest-50 dark:hover:bg-forest-900/30 transition-colors duration-200">

// Proposed (already aligned, just add transition-standard)
<button class="flex items-center gap-1.5 p-2.5 rounded-lg text-forest-700/70 dark:text-cream-100/70 hover:text-forest-600 dark:hover:text-cream-100 hover:bg-forest-50 dark:hover:bg-forest-900/30 transition-standard">
```

---

### B. Sidebar Component (`src/components/layout/dashboard/Sidebar.tsx`)

#### Current Issues:
1. Uses `text-gray-700`, `text-gray-300`, `text-gray-400`, `text-gray-500`
2. Uses `text-sm` instead of `body-small`
3. Uses `text-xs` instead of `body-small`

#### Proposed Changes:

**1. Sidebar Container:**
```tsx
// Current (already aligned)
<div class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-forest-800 border-r border-gray-200 dark:border-forest-700">

// Proposed (update border color)
<div class="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-forest-800 border-r border-cream-200 dark:border-forest-700">
```

**2. Logo Area:**
```tsx
// Current (already aligned)
<A href="/" class="text-xl font-bold text-forest-800 dark:text-sage-400 flex items-center gap-2">
```

**3. Navigation Links:**
```tsx
// Current
<A class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors mb-1">

// Proposed
<A class="group flex items-center px-3 py-2.5 body-small font-semibold rounded-lg transition-standard mb-1">
```

**4. Active State Styles:**
```tsx
// Current
const getActiveStyles = () => {
  if (props.config.brandColor === "terracotta") {
    return "bg-terracotta-50 dark:bg-terracotta-900/40 text-terracotta-700 dark:text-terracotta-300";
  }
  return "bg-forest-50 dark:bg-forest-900/40 text-forest-700 dark:text-sage-400";
};

// Proposed (already aligned, just ensure dark mode consistency)
const getActiveStyles = () => {
  if (props.config.brandColor === "terracotta") {
    return "bg-terracotta-100 dark:bg-terracotta-900/40 border-terracotta-200 dark:border-terracotta-700 text-terracotta-800 dark:text-terracotta-300";
  }
  return "bg-forest-100 dark:bg-forest-900/40 border-forest-200 dark:border-forest-700 text-forest-800 dark:text-sage-400";
};
```

**5. Inactive Link Colors:**
```tsx
// Current
text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-forest-700

// Proposed
text-forest-700/80 dark:text-cream-100/80 hover:bg-forest-50 dark:hover:bg-forest-900/30 hover:text-forest-800 dark:hover:text-cream-100
```

**6. Icon Colors:**
```tsx
// Current
text-gray-400 group-hover:text-gray-500

// Proposed
text-forest-600/60 dark:text-forest-400/60 group-hover:text-forest-600 dark:group-hover:text-forest-400
```

---

### C. Buyer Dashboard Page (`src/routes/(protected)/app/(buyer)/index.tsx`)

#### Current Issues:
1. Uses arbitrary colors (blue, red, yellow, green, purple)
2. Uses raw typography classes instead of tokens
3. Doesn't use `flat-card` utility

#### Proposed Changes:

See detailed proposals in the original plan above. Key changes:
- Replace all `bg-{color}-100` with design token colors (forest, terracotta, sage)
- Replace `text-sm`, `text-lg`, etc. with `body-small`, `body-base`
- Replace manual card styling with `flat-card flat-card-hover`
- Use `h5`, `h6` for titles

---

## Color Mapping Reference

### Stats Cards
| Stat | Icon Background | Icon Color | Old → New |
|------|----------------|------------|-----------|
| Orders | `bg-forest-100 dark:bg-forest-900/40` | `text-forest-600 dark:text-forest-400` | blue → forest |
| Favorites | `bg-terracotta-100 dark:bg-terracotta-900/40` | `text-terracotta-600 dark:text-terracotta-400` | red → terracotta |
| Reviews | `bg-sage-100 dark:bg-sage-900/40` | `text-sage-600 dark:text-sage-400` | yellow → sage |

### Quick Actions
| Action | Icon Background | Icon Color | Old → New |
|--------|----------------|------------|-----------|
| Browse Shops | `bg-forest-100 dark:bg-forest-900/40` | `text-forest-600 dark:text-forest-400` | forest (keep) |
| Browse Plants | `bg-sage-100 dark:bg-sage-900/40` | `text-sage-600 dark:text-sage-400` | green → sage |
| View Orders | `bg-forest-100 dark:bg-forest-900/40` | `text-forest-600 dark:text-forest-400` | blue → forest |
| View Profile | `bg-terracotta-100 dark:bg-terracotta-900/40` | `text-terracotta-600 dark:text-terracotta-400` | purple → terracotta |

### Order Status Badges
| Status | Background | Text | Old → New |
|--------|-----------|------|-----------|
| Shipped | `bg-forest-100 dark:bg-forest-900/40` | `text-forest-800 dark:text-forest-300` | blue → forest |
| Delivered | `bg-sage-100 dark:bg-sage-900/40` | `text-sage-800 dark:text-sage-300` | green → sage |
| Pending | `bg-terracotta-100 dark:bg-terracotta-900/40` | `text-terracotta-800 dark:text-terracotta-300` | yellow → terracotta |

---

## Implementation Checklist

### Topbar
- [ ] Update mobile menu button colors
- [ ] Update search input icon color
- [ ] Update dashboard toggle button dark mode variants
- [ ] Update language switcher colors
- [ ] Ensure all transitions use `transition-standard`

### Sidebar
- [ ] Update border color to use `border-cream-200`
- [ ] Update navigation link typography to `body-small`
- [ ] Update active state styles with border accent
- [ ] Update inactive link colors
- [ ] Update icon colors

### Buyer Dashboard
- [ ] Replace all arbitrary colors with design tokens
- [ ] Update typography to use `h5`, `h6`, `body-base`, `body-small`
- [ ] Replace manual card styling with `flat-card` and `flat-card-hover`
- [ ] Update status badges to use forest/terracotta/sage palette
- [ ] Improve responsive spacing with `md:` and `lg:` prefixes
- [ ] Add arrow icons to "View All" and "View Details" links
- [ ] Ensure dark mode uses corresponding dark variants

---

## Expected Outcomes

1. **Visual Consistency** - All dashboard components will share the same design language
2. **Better Dark Mode** - All colors will have proper dark mode variants
3. **Improved Accessibility** - Design system colors have tested contrast ratios
4. **Easier Maintenance** - Using design tokens means changes propagate automatically
5. **Professional Appearance** - Cohesive color palette and typography across all components

---

## Files to Modify

1. [`byte-forge-frontend/src/components/layout/dashboard/Topbar.tsx`](byte-forge-frontend/src/components/layout/dashboard/Topbar.tsx:1)
2. [`byte-forge-frontend/src/components/layout/dashboard/Sidebar.tsx`](byte-forge-frontend/src/components/layout/dashboard/Sidebar.tsx:1)
3. [`byte-forge-frontend/src/routes/(protected)/app/(buyer)/index.tsx`](byte-forge-frontend/src/routes/(protected)/app/(buyer)/index.tsx:1)

## Dependencies

- [`src/app.css`](src/app.css:1) - Design tokens and utilities
- [`DESIGN_SYSTEM_ALIGNMENT.md`](plans/DESIGN_SYSTEM_ALIGNMENT.md) - Design system documentation
