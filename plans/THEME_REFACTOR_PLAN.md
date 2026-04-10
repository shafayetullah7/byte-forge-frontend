# Semantic Design System Refactoring Plan

## Executive Summary

This plan outlines a comprehensive refactoring of the byte-forge-frontend theme implementation to establish a unified semantic design system. The goal is to eliminate hardcoded color values and replace them with semantic tokens that ensure visual consistency between light and dark modes.

---

## Current State Analysis

### Problem Statement

The current implementation mixes semantic design tokens with hardcoded Tailwind utility classes:

| Context | Light Mode | Dark Mode | Issue |
|---------|------------|-----------|-------|
| **Navbar Background** | `bg-white` | `dark:bg-forest-800` | Hardcoded light, semantic dark |
| **Card Background** | `bg-white` | `dark:bg-forest-800` | Inconsistent token usage |
| **Border Colors** | `border-gray-200` | `dark:border-forest-700` | Different color families |
| **Input Background** | `bg-white` | `dark:bg-forest-900/30` | Inconsistent token usage |

### Defined but Unused Tokens

**Location:** [`app.css`](../src/app.css:72-78)

```css
--color-surface-sunken: var(--color-cream-100);  /* Unused */
--color-surface-raised: #ffffff;                  /* Unused */
--color-border-flat: var(--color-cream-200);      /* Unused */
--color-border-focus: var(--color-forest-500);    /* Unused */
```

---

## Proposed Semantic Design System

### 1. Surface Tokens

| Token | Light Mode Value | Dark Mode Value | Usage |
|-------|------------------|-----------------|-------|
| `--surface-raised` | `#ffffff` | `var(--color-forest-800)` | Cards, navbars, modals |
| `--surface-sunken` | `var(--color-cream-100)` | `var(--color-forest-900)` | Sunken areas, wells |
| `--surface-overlay` | `rgba(255,255,255,0.95)` | `rgba(7,20,12,0.95)` | Dropdowns, popovers |

### 2. Border Tokens

| Token | Light Mode Value | Dark Mode Value | Usage |
|-------|------------------|-----------------|-------|
| `--border-subtle` | `var(--color-cream-200)` | `var(--color-forest-700)` | Card borders, dividers |
| `--border-default` | `var(--color-cream-300)` | `var(--color-forest-600)` | Input borders |
| `--border-focus` | `var(--color-forest-500)` | `var(--color-forest-400)` | Focus states |
| `--border-error` | `#dc2626` | `#f87171` | Error states |

### 3. Text Tokens

| Token | Light Mode Value | Dark Mode Value | Usage |
|-------|------------------|-----------------|-------|
| `--text-primary` | `var(--color-forest-900)` | `#ffffff` | Headings, primary text |
| `--text-secondary` | `var(--color-forest-700)` | `var(--color-cream-200)` | Body text |
| `--text-tertiary` | `var(--color-gray-500)` | `var(--color-gray-400)` | Muted text, placeholders |
| `--text-link` | `var(--color-forest-600)` | `var(--color-forest-400)` | Links |
| `--text-error` | `#dc2626` | `#f87171` | Error messages |

### 4. Background Utility Tokens

| Token | Light Mode Value | Dark Mode Value | Usage |
|-------|------------------|-----------------|-------|
| `--bg-primary` | `var(--color-cream-50)` | `var(--color-forest-950)` | Page background |
| `--bg-raised` | `#ffffff` | `var(--color-forest-800)` | Raised surfaces |
| `--bg-hover` | `var(--color-forest-50)` | `var(--color-forest-900/50)` | Hover states |

---

## Implementation Steps

### Phase 1: CSS Variable Definition (app.css)

**File:** `byte-forge-frontend/src/app.css`

**Step 1.1:** Add semantic CSS variables to `@theme` block

```css
@theme {
  /* ... existing color definitions ... */

  /* ========================================
   * Semantic Surface Tokens
   * ======================================== */
  --surface-raised: #ffffff;
  --surface-sunken: var(--color-cream-100);
  --surface-overlay: rgba(255, 255, 255, 0.95);
  
  /* ========================================
   * Semantic Border Tokens
   * ======================================== */
  --border-subtle: var(--color-cream-200);
  --border-default: var(--color-cream-300);
  --border-focus: var(--color-forest-500);
  --border-error: #dc2626;
  
  /* ========================================
   * Semantic Text Tokens
   * ======================================== */
  --text-primary: var(--color-forest-900);
  --text-secondary: var(--color-forest-700);
  --text-tertiary: var(--color-gray-500);
  --text-link: var(--color-forest-600);
  --text-error: #dc2626;
  
  /* ========================================
   * Semantic Background Tokens
   * ======================================== */
  --bg-primary: var(--color-cream-50);
  --bg-raised: #ffffff;
  --bg-hover: var(--color-forest-50);
}
```

**Step 1.2:** Add dark mode overrides

```css
.dark {
  --surface-raised: var(--color-forest-800);
  --surface-sunken: var(--color-forest-900);
  --surface-overlay: rgba(7, 20, 12, 0.95);
  
  --border-subtle: var(--color-forest-700);
  --border-default: var(--color-forest-600);
  --border-focus: var(--color-forest-400);
  --border-error: #f87171;
  
  --text-primary: #ffffff;
  --text-secondary: var(--color-cream-200);
  --text-tertiary: var(--color-gray-400);
  --text-link: var(--color-forest-400);
  --text-error: #f87171;
  
  --bg-primary: var(--color-forest-950);
  --bg-raised: var(--color-forest-800);
  --bg-hover: var(--color-forest-900/50);
}
```

**Step 1.3:** Create Tailwind utility classes

```css
/* Surface Utilities */
@utility bg-surface-raised {
  background-color: var(--surface-raised);
}

@utility bg-surface-sunken {
  background-color: var(--surface-sunken);
}

@utility bg-surface-overlay {
  background-color: var(--surface-overlay);
}

/* Border Utilities */
@utility border-subtle {
  border-color: var(--border-subtle);
}

@utility border-default {
  border-color: var(--border-default);
}

@utility border-focus {
  border-color: var(--border-focus);
}

@utility border-error {
  border-color: var(--border-error);
}

/* Text Utilities */
@utility text-primary {
  color: var(--text-primary);
}

@utility text-secondary {
  color: var(--text-secondary);
}

@utility text-tertiary {
  color: var(--text-tertiary);
}

@utility text-link {
  color: var(--text-link);
}

@utility text-error {
  color: var(--text-error);
}

/* Background Utilities */
@utility bg-page {
  background-color: var(--bg-primary);
}

@utility bg-hover {
  background-color: var(--bg-hover);
}
```

---

### Phase 2: Core UI Component Refactoring

#### 2.1 Input Component

**File:** `byte-forge-frontend/src/components/ui/Input.tsx`

**Current (Line 13):**
```tsx
const baseStyles = "w-full px-4 py-2.5 rounded-lg border-2 ... bg-white dark:bg-forest-900/30";
```

**Refactored:**
```tsx
const baseStyles = "w-full px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed body-base bg-surface-raised dark:bg-surface-raised border-default focus:border-focus";
```

**Current (Line 18):**
```tsx
const stateStyles = local.error
  ? "border-red-500 active:border-red-600"
  : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600 focus:border-forest-500 dark:focus:border-forest-400";
```

**Refactored:**
```tsx
const stateStyles = local.error
  ? "border-error active:border-error"
  : "border-subtle hover:border-default focus:border-focus";
```

**Current (Line 31):**
```tsx
<p class="mt-1 body-small text-red-600 dark:text-red-400 font-semibold">{local.error}</p>
```

**Refactored:**
```tsx
<p class="mt-1 body-small text-error font-semibold">{local.error}</p>
```

---

#### 2.2 Button Component

**File:** `byte-forge-frontend/src/components/ui/button-styles.ts`

**Current (Line 12):**
```tsx
primary: "bg-forest-600 hover:bg-forest-700 text-white border-2 border-transparent ...",
```

**Refactored:** (No change needed - uses color tokens correctly)

**Current (Line 18):**
```tsx
outline: "bg-transparent border-2 border-cream-200 text-forest-700 ...",
```

**Refactored:**
```tsx
outline: "bg-transparent border-2 border-subtle text-primary hover:border-default hover:bg-hover ...",
```

---

#### 2.3 Toast Component

**File:** `byte-forge-frontend/src/components/ui/Toast.tsx`

**Current (Lines 46-51):**
```tsx
"bg-white border-forest-200 text-forest-800 dark:bg-forest-900 dark:border-forest-700 dark:text-forest-100": toast.type === "success",
"bg-white border-red-200 text-red-800 dark:bg-red-950 dark:border-red-900 dark:text-red-100": toast.type === "error",
"bg-white border-cream-300 text-cream-800 dark:bg-cream-900 dark:border-cream-700 dark:text-cream-100": toast.type === "info",
```

**Refactored:**
```tsx
"bg-surface-raised border-subtle text-primary": toast.type === "success",
"bg-surface-raised border-error text-error": toast.type === "error",
"bg-surface-raised border-subtle text-primary": toast.type === "info",
```

---

### Phase 3: Layout Component Refactoring

#### 3.1 Navbar Component

**File:** `byte-forge-frontend/src/components/layout/Navbar.tsx`

**Current (Line 43):**
```tsx
<nav class="w-full bg-white dark:bg-forest-800 border-b border-cream-200 dark:border-forest-700 ...">
```

**Refactored:**
```tsx
<nav class="w-full bg-surface-raised border-b border-subtle transition-colors duration-200">
```

---

#### 3.2 Topbar Component

**File:** `byte-forge-frontend/src/components/layout/dashboard/Topbar.tsx`

**Current (Line 30):**
```tsx
<header class="bg-white dark:bg-forest-800 border-b border-gray-200 dark:border-forest-700 h-16 flex ...">
```

**Refactored:**
```tsx
<header class="bg-surface-raised border-b border-subtle h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-sm z-10 sticky top-0">
```

**Current (Line 48):**
```tsx
class="pl-10 bg-gray-50 dark:bg-forest-700 focus:bg-white dark:focus:bg-forest-800"
```

**Refactored:**
```tsx
class="pl-10 bg-surface-sunken focus:bg-surface-raised"
```

---

#### 3.3 Sidebar Component

**File:** `byte-forge-frontend/src/components/layout/dashboard/Sidebar.tsx`

**Current (Line 77):**
```tsx
class={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-forest-800 border-r border-gray-200 dark:border-forest-700 ...`}
```

**Refactored:**
```tsx
class={`fixed inset-y-0 left-0 z-50 w-64 bg-surface-raised border-r border-subtle ...`}
```

---

#### 3.4 UserMenu Component

**File:** `byte-forge-frontend/src/components/layout/UserMenu.tsx`

**Current (Line 79):**
```tsx
<div class="absolute right-0 mt-2 w-64 bg-white dark:bg-forest-800 rounded-xl shadow-xl border border-cream-200 dark:border-forest-700 ...">
```

**Refactored:**
```tsx
<div class="absolute right-0 mt-2 w-64 bg-surface-overlay rounded-xl shadow-xl border border-subtle ...">
```

---

#### 3.5 MobileMenu Component

**File:** `byte-forge-frontend/src/components/layout/MobileMenu.tsx`

**Current (Line 46):**
```tsx
<div class="absolute right-4 top-16 w-64 bg-white/95 dark:bg-forest-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-cream-200 dark:border-forest-700/50 ...">
```

**Refactored:**
```tsx
<div class="absolute right-4 top-16 w-64 bg-surface-overlay/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-subtle/50 ...">
```

---

### Phase 4: Authentication Flow Refactoring

#### 4.1 Auth Layout

**File:** `byte-forge-frontend/src/routes/(auth).tsx`

**Current (Line 112):**
```tsx
<div class="bg-white dark:bg-forest-900 rounded-xl shadow-sm border border-cream-100 dark:border-forest-800 p-8 ...">
```

**Refactored:**
```tsx
<div class="bg-surface-raised rounded-xl shadow-sm border border-subtle p-8 transition-colors">
```

---

#### 4.2 Login Page

**File:** `byte-forge-frontend/src/routes/(auth)/(access)/login/(login).tsx`

No changes needed - uses Input component which will be refactored.

**Add ThemeToggle to all auth pages:**

All auth pages should include the ThemeToggle and LanguageSwitcher at the top for consistency.

---

#### 4.3 Register Page

**File:** `byte-forge-frontend/src/routes/(auth)/(access)/register/(register).tsx`

**Current (Line 143):**
```tsx
<div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 ...">
```

**Refactored:** (Keep as-is - error state specific styling is appropriate)

**Action:** Add ThemeToggle component (currently missing)

---

#### 4.4 Forgot Password Page

**File:** `byte-forge-frontend/src/routes/(auth)/forgot-password/(forgot-password).tsx`

**Current (Line 96):**
```tsx
<div class="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
```

**Refactored:** (Keep as-is - error state specific styling)

**Action:** Add ThemeToggle component (currently missing)

---

### Phase 5: Dashboard Page Refactoring

#### 5.1 Buyer Dashboard

**File:** `byte-forge-frontend/src/routes/(protected)/app/(buyer)/index.tsx`

**Current (Line 11):**
```tsx
<div class="min-h-screen bg-cream-50 dark:bg-forest-900">
```

**Refactored:**
```tsx
<div class="min-h-screen bg-page">
```

**Current (Lines 28, 49, 70, 97, 118, 139, 160, 198, 224, 250):**
```tsx
<div class="bg-white dark:bg-forest-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 ...">
```

**Refactored:**
```tsx
<div class="bg-surface-raised rounded-xl shadow-lg p-6 border border-subtle hover:shadow-xl transition-shadow">
```

---

#### 5.2 Seller Dashboard

**File:** `byte-forge-frontend/src/routes/(protected)/app/seller/(seller-protected)/index.tsx`

**Current (Lines 9, 13, 17):**
```tsx
<div class="bg-white dark:bg-forest-800 p-6 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
```

**Refactored:**
```tsx
<div class="bg-surface-raised p-6 rounded-xl border border-subtle shadow-sm">
```

---

### Phase 6: Accessibility Verification

#### 6.1 Contrast Ratio Testing

After refactoring, verify all text/background combinations meet WCAG 2.1 AA standards:

| Element | Foreground | Background | Required Ratio | Target |
|---------|------------|------------|----------------|--------|
| Body Text | `--text-primary` | `--bg-primary` | 4.5:1 | 12:1+ |
| Muted Text | `--text-tertiary` | `--bg-primary` | 4.5:1 | 5:1+ |
| Button Text | `#ffffff` | `--color-forest-600` | 4.5:1 | 5.9:1 |
| Link Text | `--text-link` | `--bg-primary` | 4.5:1 | 6:1+ |
| Error Text | `--text-error` | `--bg-primary` | 4.5:1 | 5.8:1 |

#### 6.2 Transition Testing

Verify smooth theme transitions:

1. **CSS Transition:** Ensure `transition: background-color 0.3s ease, color 0.3s ease` is applied to `body`
2. **Component Transitions:** Add `transition-colors duration-200` to all themed components
3. **ThemeToggle:** Verify no flash of unstyled content (FOUC) when toggling

---

## Migration Checklist

### Phase 1: CSS Foundation
- [ ] Add semantic CSS variables to `@theme` block
- [ ] Add dark mode overrides
- [ ] Create Tailwind utility classes
- [ ] Test basic color rendering in both modes

### Phase 2: Core UI Components
- [ ] Refactor `Input.tsx`
- [ ] Refactor `button-styles.ts`
- [ ] Refactor `Toast.tsx`
- [ ] Test component isolation

### Phase 3: Layout Components
- [ ] Refactor `Navbar.tsx`
- [ ] Refactor `Topbar.tsx`
- [ ] Refactor `Sidebar.tsx`
- [ ] Refactor `UserMenu.tsx`
- [ ] Refactor `MobileMenu.tsx`
- [ ] Test layout consistency

### Phase 4: Authentication Flow
- [ ] Refactor `(auth).tsx` layout
- [ ] Add ThemeToggle to all auth pages
- [ ] Test login, register, forgot-password flows

### Phase 5: Dashboard Pages
- [ ] Refactor buyer dashboard
- [ ] Refactor seller dashboard
- [ ] Refactor all card components
- [ ] Test navigation and interactions

### Phase 6: Accessibility & QA
- [ ] Run contrast ratio tests
- [ ] Test theme toggle transitions
- [ ] Cross-browser testing
- [ ] Mobile responsiveness check

---

## File Inventory

### Files to Modify

| File | Changes | Priority |
|------|---------|----------|
| `src/app.css` | Add semantic tokens and utilities | High |
| `src/components/ui/Input.tsx` | Replace hardcoded colors | High |
| `src/components/ui/button-styles.ts` | Update outline variant | Medium |
| `src/components/ui/Toast.tsx` | Replace hardcoded colors | High |
| `src/components/layout/Navbar.tsx` | Replace hardcoded colors | High |
| `src/components/layout/dashboard/Topbar.tsx` | Replace hardcoded colors | High |
| `src/components/layout/dashboard/Sidebar.tsx` | Replace hardcoded colors | High |
| `src/components/layout/UserMenu.tsx` | Replace hardcoded colors | Medium |
| `src/components/layout/MobileMenu.tsx` | Replace hardcoded colors | Medium |
| `src/routes/(auth).tsx` | Replace hardcoded colors | High |
| `src/routes/(auth)/(access)/register/(register).tsx` | Add ThemeToggle | High |
| `src/routes/(auth)/forgot-password/(forgot-password).tsx` | Add ThemeToggle | High |
| `src/routes/(protected)/app/(buyer)/index.tsx` | Replace hardcoded colors | Medium |
| `src/routes/(protected)/app/seller/(seller-protected)/index.tsx` | Replace hardcoded colors | Medium |

**Total Files:** 14

---

## Risk Mitigation

1. **Visual Regression:** Test each phase before proceeding to the next
2. **Backward Compatibility:** Keep old color tokens during transition
3. **Performance:** Monitor bundle size impact of new utilities
4. **Browser Support:** Verify CSS custom property support in target browsers

---

## Success Criteria

1. **Zero Hardcoded Colors:** No `bg-white`, `border-gray-200`, etc. in component code
2. **Consistent Dark Mode:** All surfaces use `--surface-raised` token
3. **Smooth Transitions:** No flickering when toggling themes
4. **Accessibility:** All text meets WCAG AA contrast requirements
5. **ThemeToggle Coverage:** All pages include theme toggle
