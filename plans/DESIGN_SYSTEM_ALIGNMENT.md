# Design System Alignment - Shop Form UX Improvements

## Core Principle: Design Coherence

**Design coherence across the project is mandatory.** New components can be added, but they MUST follow the existing design system. Separate themes or ad-hoc styling will ruin the visual consistency and user experience.

---

## Project Design System Analysis

Based on review of existing components in `byte-forge-frontend/src/components/ui/`:

### Color Palette
| Token | Usage |
|-------|-------|
| `forest-*` | Primary brand color (greens) |
| `terracotta-*` | Secondary/accent color (orange-red) |
| `sage-*` | Accent color |
| `cream-*` | Neutral backgrounds and borders |
| `red-*` | Error states |

### Typography
- `h5` - Card titles
- `body-base` - Base body text
- `body-small` - Small helper text
- `h6` - Input labels

### Component Patterns

#### Input ([`Input.tsx`](src/components/ui/Input.tsx))
```tsx
- 2px border (cream-200 dark:border-forest-700)
- Rounded corners (rounded-lg)
- Focus ring: forest-500
- Error state: red-500 border
- Label: h6 typography, mb-2 spacing
- Error message: body-small, red-600, font-semibold
```

#### Button ([`Button.tsx`](src/components/ui/Button.tsx), [`button-styles.ts`](src/components/ui/button-styles.ts))
```tsx
Variants:
- primary: bg-forest-600 (green)
- secondary: bg-terracotta-500 (orange-red)
- accent: bg-sage-500
- outline: border-cream-200
- ghost: bg-transparent

Sizes: sm, md, lg
```

#### Card ([`Card.tsx`](src/components/ui/Card.tsx))
```tsx
- Variants: default, bordered, tinted
- Default: flat-card with hover
- Tinted: bg-forest-50 dark:bg-forest-900/50
- Title: h5 typography
- Description: body-small, forest-700/70
```

#### SegmentedControl ([`SegmentedControl.tsx`](src/components/ui/SegmentedControl.tsx))
```tsx
- Background: bg-cream-100 dark:bg-forest-900/40
- Border: border-cream-200 dark:border-forest-700
- Active: bg-white dark:bg-forest-600 with shadow
- Inactive: text-forest-700/60 dark:text-cream-100/60
- Padding: p-1 container, px-3 py-1.5 buttons
```

---

## Current Shop Form - Design System Compliance

### ✅ What's Aligned

1. **Button Usage**: Uses `Button` component with correct variants
   - Primary for "Next"
   - Ghost for "Previous"
   - Accent for "Create Shop"

2. **Input Fields**: Uses `ValidatedInput` (wrapper around `Input`)
   - Correct border colors
   - Proper error states
   - Label typography (h6)

3. **Card Structure**: Uses white/dark background with rounded-2xl and shadow-lg

4. **Color Scheme**: Uses terracotta-500 for progress bar (secondary brand color)

### ❌ What's NOT Aligned

1. **Language Selector Tabs**: Custom button styles, not using `SegmentedControl`
   - Current: Custom bg-gray-100 dark:bg-forest-700
   - Should use: `SegmentedControl` with cream-100 background

2. **Info Banner**: Not using `Card` component with proper variant
   - Current: Custom bg-blue-50 (not in design system)
   - Should use: `Card` with `tinted` variant or custom cream-based colors

3. **Step Progress**: Custom styling that doesn't match design tokens
   - Current: Hardcoded gray-200, terracotta-500
   - Should use: cream-* for inactive, terracotta-* for active

---

## Revised Alternative Designs (Design System Aligned)

### Alternative A: Side-by-Side (Using Design System)

```tsx
import { Input } from "~/components/ui/Input";
import { Card } from "~/components/ui/Card";

// Language pair field component
<div class="space-y-3">
    <label class="block h6 text-gray-700 dark:text-gray-300">
        Shop Name
    </label>
    
    {/* English */}
    <div>
        <label class="block body-small text-forest-700 dark:text-gray-400 mb-1.5">
            🇬 English
        </label>
        <Input
            value={translations.en.shopName}
            onInput={(e) => setTranslations("en", "shopName", e.currentTarget.value)}
            placeholder="Enter your shop name"
            error={errors().shopName}
        />
    </div>
    
    {/* Bengali */}
    <div>
        <label class="block body-small text-forest-700 dark:text-gray-400 mb-1.5">
            🇧🇩 বাংলা
        </label>
        <Input
            value={translations.bn.shopName}
            onInput={(e) => setTranslations("bn", "shopName", e.currentTarget.value)}
            placeholder="আপনার দোকানের নাম লিখুন"
            error={errors().shopNameBn}
        />
    </div>
</div>
```

**Design System Compliance:**
- ✅ Uses `Input` component
- ✅ Uses `body-small` typography for sublabels
- ✅ Uses forest-* color tokens
- ✅ Consistent spacing (mb-1.5, space-y-3)

---

### Alternative B: Primary + Optional Translation (Using Design System)

```tsx
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";

// Primary field
<Input
    label="Shop Name *"
    value={translations.primary.shopName}
    placeholder="Enter your shop name"
    required
/>

{/* Optional Translation - Expandable */}
<Card variant="tinted" class="mt-4">
    <button
        type="button"
        onClick={() => setShowBengali(!showBengali())}
        class="flex items-center justify-between w-full body-small font-semibold text-forest-700 dark:text-gray-300"
    >
        <span>+ Add Bengali Translation (Optional)</span>
        <ChevronDownIcon class={`w-4 h-4 transition-transform ${showBengali() ? 'rotate-180' : ''}`} />
    </button>
    
    <Show when={showBengali()}>
        <div class="mt-4">
            <Input
                label="দোকানের নাম (বাংলা)"
                value={translations.bn.shopName}
                placeholder="আপনার দোকানের নাম লিখুন"
            />
        </div>
    </Show>
</Card>
```

**Design System Compliance:**
- ✅ Uses `Card` with `tinted` variant
- ✅ Uses `body-small` typography
- ✅ Uses forest-* color tokens
- ✅ Uses `Input` component
- ✅ Consistent with expandable patterns

---

### Alternative C: SegmentedControl for Language Selection

```tsx
import SegmentedControl from "~/components/ui/SegmentedControl";
import { GlobeAltIcon } from "~/components/icons";

// Replace custom tabs with SegmentedControl
<SegmentedControl<Locale>
    options={[
        { value: "en", label: "English", icon: GlobeAltIcon },
        { value: "bn", label: "বাংলা", icon: GlobeAltIcon }
    ]}
    value={editingLocale()}
    onChange={setEditingLocale}
    size="md"
    fullWidth={false}
    class="mb-6"
/>

{/* Show completion status below */}
<div class="flex items-center justify-between mt-2 body-small text-forest-700/70 dark:text-gray-400">
    <span>Language Progress</span>
    <span class="font-semibold">
        {completedCount()}/2 Complete
    </span>
</div>
```

**Design System Compliance:**
- ✅ Uses existing `SegmentedControl` component
- ✅ Uses `body-small` typography
- ✅ Uses forest-* color tokens
- ✅ Consistent with navbar language switcher pattern

---

### Alternative D: Improved Tabs (Design System Aligned)

```tsx
import { Card } from "~/components/ui/Card";

{/* Language Selector */}
<Card variant="tinted" class="mb-6">
    <div class="flex items-center justify-between mb-3">
        <h6 class="text-forest-700 dark:text-gray-300">
            Select Language to Edit
        </h6>
        <span class="body-small text-forest-700/70 dark:text-gray-400 font-semibold">
            {completedCount()}/2 Required
        </span>
    </div>
    
    <div class="grid grid-cols-2 gap-3">
        <For each={AVAILABLE_LOCALES}>
            {(loc) => {
                const isComplete = isLocaleComplete(loc);
                const isActive = editingLocale() === loc;
                
                return (
                    <button
                        type="button"
                        onClick={() => setEditingLocale(loc)}
                        class={`
                            relative p-4 rounded-lg border-2 transition-all text-left
                            ${isActive 
                                ? "border-forest-500 bg-white dark:bg-forest-800 shadow-sm" 
                                : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600"
                            }
                        `}
                    >
                        <div class="flex items-center justify-between">
                            <div>
                                <p class="h6 text-gray-900 dark:text-white">
                                    {loc === "en" ? "English" : "বাংলা"}
                                </p>
                                <p class="body-small text-forest-700/70 dark:text-gray-400 mt-1">
                                    {isComplete 
                                        ? "✓ Complete" 
                                        : "Needs completion"
                                    }
                                </p>
                            </div>
                            <Show when={isComplete}>
                                <svg class="w-6 h-6 text-forest-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </Show>
                        </div>
                        {isActive && (
                            <div class="absolute top-0 right-0 -mt-1 -mr-1">
                                <span class="flex h-3 w-3">
                                    <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
                                    <span class="relative inline-flex rounded-full h-3 w-3 bg-terracotta-500"></span>
                                </span>
                            </div>
                        )}
                    </button>
                );
            }}
        </For>
    </div>
</Card>
```

**Design System Compliance:**
- ✅ Uses `Card` with `tinted` variant
- ✅ Uses `h6` and `body-small` typography
- ✅ Uses forest-*, cream-*, terracotta-* color tokens
- ✅ Consistent border and shadow patterns

---

## Info Banner Component (Design System Aligned)

```tsx
import { Card } from "~/components/ui/Card";

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

**Design System Compliance:**
- ✅ Uses `Card` with `tinted` variant (bg-forest-50 dark:bg-forest-900/50)
- ✅ Uses `h6` for title, `body-small` for description
- ✅ Uses forest-* color tokens (no blue-*)
- ✅ Consistent icon sizing and spacing

---

## Color Palette Correction

The original proposal used `bg-blue-50` for the info banner, which is NOT in the design system. Here's the corrected palette:

| Original | Corrected | Usage |
|----------|-----------|-------|
| `bg-blue-50` | `bg-forest-50` | Info banner background |
| `text-blue-800` | `text-forest-700` | Info banner text |
| `border-blue-200` | `border-cream-200` | Info banner border |
| `text-blue-600` | `text-forest-600` | Info banner icon |

---

## New Component Proposal: LanguagePairInput

If we need a reusable component for multi-language input fields, it should be created following the design system:

```tsx
// src/components/ui/LanguagePairInput.tsx
import { Input } from "~/components/ui/Input";
import { For, Show } from "solid-js";

export interface LanguagePairInputProps {
    label: string;
    valueEn: string;
    valueBn: string;
    onInputEn: (e: Event) => void;
    onInputBn: (e: Event) => void;
    placeholderEn?: string;
    placeholderBn?: string;
    error?: string;
    required?: boolean;
    type?: "text" | "textarea";
    rows?: number;
}

export function LanguagePairInput(props: LanguagePairInputProps) {
    return (
        <div class="space-y-3">
            <label class="block h6 text-gray-700 dark:text-gray-300">
                {props.label}
                <Show when={props.required}>
                    <span class="text-red-500 ml-1">*</span>
                </Show>
            </label>
            
            {/* English */}
            <div>
                <label class="block body-small text-forest-700/70 dark:text-gray-400 mb-1.5">
                    English
                </label>
                <Input
                    value={props.valueEn}
                    onInput={props.onInputEn}
                    placeholder={props.placeholderEn}
                    error={props.error}
                />
            </div>
            
            {/* Bengali */}
            <div>
                <label class="block body-small text-forest-700/70 dark:text-gray-400 mb-1.5">
                    বাংলা
                </label>
                <Input
                    value={props.valueBn}
                    onInput={props.onInputBn}
                    placeholder={props.placeholderBn}
                    error={props.error}
                />
            </div>
        </div>
    );
}
```

**Why this is acceptable:**
- ✅ Uses existing `Input` component internally
- ✅ Uses design system typography (`h6`, `body-small`)
- ✅ Uses design system colors (forest-*, gray-*)
- ✅ Consistent spacing patterns
- ✅ Extends the system, doesn't replace it

---

## Recommendation

**For best design system alignment, I recommend:**

1. **Use `SegmentedControl`** for the language selector (matches navbar pattern)
2. **Use `Card` with `tinted` variant** for info banners and grouped fields
3. **Use `Input` component** consistently for all text fields
4. **Use design tokens** (forest-*, cream-*, terracotta-*) instead of arbitrary colors
5. **Use typography tokens** (h6, body-small) instead of raw classes

This ensures:
- Visual consistency across the application
- Easier maintenance (changes to design tokens propagate everywhere)
- Better dark mode support (all tokens have dark variants)
- Accessibility compliance (tested color contrast ratios)

---

## Design Coherence Checklist

Before implementing any UI change, verify:

- [ ] Uses existing components (`Input`, `Button`, `Card`, `SegmentedControl`) OR new components follow existing patterns
- [ ] Uses design token colors (forest-*, cream-*, terracotta-*, sage-*)
- [ ] Uses design token typography (h5, h6, body-base, body-small)
- [ ] Matches spacing patterns (mb-1.5, mb-2, space-y-3, etc.)
- [ ] Dark mode uses corresponding dark variants
- [ ] No arbitrary colors (no `bg-blue-50`, `text-gray-600`, etc.)
- [ ] Border radius matches (rounded-lg, rounded-2xl)
- [ ] Shadow patterns match (shadow-sm, shadow-lg, etc.)
