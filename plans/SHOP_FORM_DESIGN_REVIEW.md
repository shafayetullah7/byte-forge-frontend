# Shop Creation Form - Design Paradigm Review

## Executive Summary

This review analyzes the shop creation form (`setup-shop.tsx`) against the project's design system as defined in [`DESIGN_SYSTEM_ALIGNMENT.md`](./DESIGN_SYSTEM_ALIGNMENT.md) and related design plans.

---

## Current State Analysis

### ✅ What's Aligned

1. **Component Usage**
   - Uses `Card` component with `tinted` variant for slug section
   - Uses `SegmentedControl` for language selection (in some versions)
   - Uses `ValidatedInput` wrapper pattern
   - Uses `Button` component with correct variants

2. **Color Palette**
   - Uses `terracotta-500` for progress bar (secondary brand color)
   - Uses `forest-*` and `cream-*` tokens in various places
   - Dark mode variants implemented

3. **Multi-language Support**
   - Side-by-side column layout for translations
   - Completion indicators per language

---

## ❌ What's NOT Aligned

### 1. Typography Tokens (HIGH PRIORITY)

**Current:**
```tsx
// Line 360
<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-3">

// Line 381
<h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">

// Line 87
<p class={`text-sm font-medium ${...}`}>
```

**Should Use:**
```tsx
<h1 class="h1 mb-3">  {/* Uses design token */}
<h3 class="h5 mb-1">  {/* Uses h5 token */}
<p class="body-small font-medium">  {/* Uses body-small */}
```

**Impact:** Inconsistent typography across the app, harder to maintain.

---

### 2. Arbitrary Color Usage (HIGH PRIORITY)

**Current:**
```tsx
// Line 59
<div class="... h-1 bg-cream-200 dark:bg-forest-700">

// Line 61
<div class="h-full bg-terracotta-500 ...">

// Line 71-75
class={`... ${props.currentStep > step.id
    ? "bg-terracotta-500 text-white"
    : props.currentStep === step.id
        ? "bg-terracotta-500 text-white ring-4 ring-terracotta-200 dark:ring-terracotta-800"
        : "bg-cream-200 dark:bg-forest-700 text-forest-700/60 dark:text-cream-100/60"
    }`}

// Line 87-89
class={`text-sm font-medium ${props.currentStep >= step.id
    ? "text-gray-900 dark:text-white"
    : "text-forest-700/60 dark:text-cream-100/60"
    }`}
```

**Should Use:**
```tsx
// Progress bar track
bg-cream-200 dark:bg-forest-700  ✓ (already correct)

// Progress bar fill
bg-terracotta-500  ✓ (already correct)

// Step circles - completed
bg-terracotta-500 text-white  ✓ (already correct)

// Step circles - active
bg-terracotta-500 text-white ring-4 ring-terracotta-200 dark:ring-terracotta-800  ✓ (already correct)

// Step circles - inactive
bg-cream-200 dark:bg-forest-700 text-forest-700/60 dark:text-cream-100/60  ✓ (already correct)

// Step labels - active
text-forest-800 dark:text-cream-50  ← Should use design tokens

// Step labels - inactive
text-forest-700/60 dark:text-cream-100/60  ✓ (already correct)
```

**Note:** Most colors are already aligned, but some text colors need updating.

---

### 3. Info Banner - Not Using Card Component (MEDIUM PRIORITY)

**Current:**
The form doesn't have an info banner explaining the multi-language requirement. Per [`SHOP_FORM_UX_IMPROVEMENT_PLAN.md`](./SHOP_FORM_UX_IMPROVEMENT_PLAN.md:46-83), it should use:

```tsx
<Card variant="tinted" class="mb-6">
    <div class="flex gap-3">
        <svg class="w-5 h-5 text-forest-600 dark:text-forest-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
            <p class="h6 text-forest-700 dark:text-gray-300 mb-1">
                {t("seller.shop.multiLanguageTitle")}
            </p>
            <p class="body-small text-forest-700/70 dark:text-gray-400">
                {t("seller.shop.multiLanguageDescription")}
            </p>
        </div>
    </div>
</Card>
```

**Current Issue:** No info banner exists, users don't understand WHY they need to fill out multiple languages.

---

### 4. Language Selector - Not Using Design System Pattern (MEDIUM PRIORITY)

**Current:**
Uses custom styled divs for language columns.

**Should Use (per [`DESIGN_SYSTEM_ALIGNMENT.md:238-304`](./DESIGN_SYSTEM_ALIGNMENT.md:238)):**
```tsx
<Card variant="tinted" class="mb-6">
    <div class="flex items-center justify-between mb-3">
        <h6 class="text-forest-700 dark:text-gray-300">
            {t("seller.shop.selectLanguage")}
        </h6>
        <span class="body-small text-forest-700/70 dark:text-gray-400 font-semibold">
            {completedCount()}/2 Required
        </span>
    </div>
    <div class="grid grid-cols-2 gap-3">
        {/* Language cards with completion status */}
    </div>
</Card>
```

---

### 5. Input Fields - Inconsistent Styling (MEDIUM PRIORITY)

**Current:**
```tsx
// Line 471-474
<input
    class={`w-full px-3 py-2 rounded-lg border ... ${errors().shopName
        ? "border-red-500 dark:border-red-400"
        : "border-gray-300 dark:border-forest-600"
        }`}
/>
```

**Should Use (per [`Input.tsx`](src/components/ui/Input.tsx)):**
```tsx
<Input
    value={translations.en.shopName}
    onInput={(e) => setTranslations("en", "shopName", e.currentTarget.value)}
    placeholder={t("seller.shop.namePlaceholder")}
    error={errors().shopName}
    label={t("seller.shop.nameLabel")}
    required
/>
```

**Impact:** Duplicated styling logic, inconsistent error states.

---

### 6. Section Headers - Not Using Typography Tokens (LOW PRIORITY)

**Current:**
```tsx
// Line 381-386
<div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {t("seller.shop.shopIdentityTitle")}
    </h3>
    <p class="text-sm text-gray-600 dark:text-gray-400">
        {t("seller.shop.shopIdentityDescription")}
    </p>
</div>
```

**Should Use:**
```tsx
<div>
    <h3 class="h5 mb-1">
        {t("seller.shop.shopIdentityTitle")}
    </h3>
    <p class="body-small text-forest-700/70 dark:text-gray-400">
        {t("seller.shop.shopIdentityDescription")}
    </p>
</div>
```

---

### 7. Progress Bar Text - Raw Translation Keys (BUG)

**Current (Line 91-94):**
```tsx
<p class={`text-sm font-medium ${...}`}>
    {props.t(step.title)}  {/* Shows "seller.shop.steps.basicInfo" */}
</p>
```

**Issue:** The `t()` function is being called but the translation keys in `STEPS` array are not being resolved.

**Fix:** Ensure `STEPS` array uses actual translation keys and `t()` is called correctly.

---

## Recommendations

### Priority 1: Critical Fixes

1. **Add Info Banner** - Explain multi-language requirement using `Card variant="tinted"`
2. **Fix Typography** - Replace `text-*` classes with `h1`, `h5`, `h6`, `body-base`, `body-small`
3. **Fix Progress Bar** - Ensure translation keys are resolved

### Priority 2: Component Alignment

4. **Use Input Component** - Replace raw `<input>` with `Input` component
5. **Improve Language Selector** - Use `Card variant="tinted"` with better completion indicators

### Priority 3: Polish

6. **Standardize Colors** - Ensure all text colors use forest/cream tokens
7. **Add Field-Level Hints** - Character counts, validation feedback

---

## Design System Compliance Checklist

| Element | Current Status | Required Action |
|---------|---------------|-----------------|
| Typography | ❌ Uses `text-*` | Use `h1`, `h5`, `h6`, `body-*` |
| Colors | ⚠️ Mostly aligned | Fix text colors |
| Cards | ⚠️ Partial | Use `flat-card` consistently |
| Inputs | ❌ Raw HTML | Use `Input` component |
| Info Banner | ❌ Missing | Add with `Card variant="tinted"` |
| Language Selector | ⚠️ Custom | Use design system pattern |
| Progress Bar | ❌ Raw keys | Fix translation |
| Buttons | ✅ Aligned | No action needed |

---

## Files to Modify

1. [`byte-forge-frontend/src/routes/(protected)/app/seller/setup-shop/(setup-shop).tsx`](src/routes/(protected)/app/seller/setup-shop/(setup-shop).tsx)
2. [`byte-forge-frontend/src/i18n/en.ts`](src/i18n/en.ts) - Add missing translation keys
3. [`byte-forge-frontend/src/i18n/bn.ts`](src/i18n/bn.ts) - Add missing translation keys

---

## Reference Documents

- [`DESIGN_SYSTEM_ALIGNMENT.md`](./DESIGN_SYSTEM_ALIGNMENT.md) - Core design system
- [`SHOP_FORM_UX_IMPROVEMENT_PLAN.md`](./SHOP_FORM_UX_IMPROVEMENT_PLAN.md) - UX improvements
- [`SHOP_FORM_REDESIGNED_UX.md`](./SHOP_FORM_REDESIGNED_UX.md) - Redesigned layout
- [`BUYER_DASHBOARD_DESIGN_IMPROVEMENT_PLAN.md`](./BUYER_DASHBOARD_DESIGN_IMPROVEMENT_PLAN.md) - Recent dashboard improvements
