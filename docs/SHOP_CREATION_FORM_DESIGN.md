# Shop Creation Form - Design Paradigm

**Version:** 1.0  
**Last Updated:** April 14, 2026  
**Component:** `/routes/(protected)/app/seller/setup-shop/(setup-shop).tsx`

---

## 🎨 Design Philosophy

**Progressive Disclosure with Bilingual Equality**

The form follows a **minimalist, focused approach** where users:
1. See only what's necessary for the current step
2. Must provide content in both languages (Bengali + English) equally
3. Can complete setup quickly (2 steps) with optional branding

---

## 📐 Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  Page Header (Centered)                                      │
│  - Title: "Setup Your Shop"                                 │
│  - Subtitle: "Enter your shop information"                  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Progress Stepper (Horizontal)                               │
│  ○────────●────────○  (Step 1 of 2 active)                  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Form Card (White/Dark Card)                                 │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Section Headers (h5)                                  │  │
│  │  ───────────────────────────────────────────────────  │  │
│  │  Form Fields                                           │  │
│  │  - Labels (h6, bold)                                   │  │
│  │  - Inputs (Rounded, border)                            │  │
│  │  - Hints (Small, muted)                                │  │
│  │  - Errors (Red, small)                                 │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Navigation Buttons (Bottom, Border-top separator)           │
│  [← Previous]                    [Next →] / [Create Shop]   │
└─────────────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────────────┐
│  Footer Note (Tinted background)                             │
│  💡 Note: [Helpful message]                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📝 STEP 1: Basic Information

### Section 1: Shop Identity

| Element | Design Pattern | Specification |
|---------|---------------|---------------|
| **Section Title** | `h5` heading | `"seller.shop.shopIdentityTitle"` |
| **Section Description** | `body-small`, muted | `"seller.shop.shopIdentityDescription"` |

#### Field 1.1: Shop Slug (URL)

| Property | Value |
|----------|-------|
| **Component** | `Card` (tinted variant) |
| **Label** | `h6`, gray text + `(Optional)` suffix |
| **Input Type** | Text with prefixed domain |
| **Prefix** | `byteforge.com/shop/` (inline-flex, rounded-left) |
| **Input** | Rounded-right, focus ring (terracotta-500) |
| **Hint** | `body-small`, muted, with 💡 emoji |
| **Behavior** | Auto-generates from English shop name |

---

### Section 2: Customer-Facing Content

#### Design Pattern: Side-by-Side Language Columns

```
┌─────────────────────────┬─────────────────────────┐
│  🇬🇧 English Column      │  🇧🇩 Bengali Column      │
│  ─────────────────────  │  ─────────────────────  │
│  Shop Name*             │  Shop Name*             │
│  [Input field]          │  [Input field]          │
│  About*                 │  About*                 │
│  [Textarea 4 rows]      │  [Textarea 4 rows]      │
│  Business Hours         │  Business Hours         │
│  [Textarea 3 rows]      │  [Textarea 3 rows]      │
└─────────────────────────┴─────────────────────────┘
```

#### Column Container States

| State | Border Color | Background | Indicator |
|-------|-------------|------------|-----------|
| **Error** | `border-red-300` | None | Red error text |
| **Complete** | `border-forest-500` | `bg-forest-50` (dark: `forest-900/20`) | ✓ Checkmark icon |
| **Incomplete** | `border-cream-200` (dark: `forest-700`) | None | Empty circle |

#### Column Header

| Element | Style |
|---------|-------|
| Flag emoji | `text-2xl` |
| Language label | `h6` |
| Description | `body-small`, muted |
| Completion indicator | Checkmark SVG or circle (right-aligned) |

---

#### Field 2.1: Shop Name (Both Languages)

| Property | Value |
|----------|-------|
| **Label** | `h6`, bold + red asterisk `*` |
| **Input** | `input[type="text"]`, single line |
| **Placeholder** | `"seller.shop.namePlaceholder"` |
| **Validation** | Min 1 character (required) |
| **Error Display** | `body-small`, red-600, below input |
| **Bengali Specific** | `dir="auto"` for proper text direction |

#### Field 2.2: Description (Both Languages)

| Property | Value |
|----------|-------|
| **Label** | `h6`, bold + red asterisk `*` |
| **Input** | `textarea`, 4 rows, `resize-none` |
| **Placeholder** | `"seller.shop.aboutPlaceholder"` |
| **Validation** | Min 10 characters (required) |
| **Error Display** | `body-small`, red-600, below textarea |
| **Bengali Specific** | `dir="auto"` for proper text direction |

#### Field 2.3: Business Hours (Both Languages)

| Property | Value |
|----------|-------|
| **Label** | `h6`, bold + `(Optional)` gray suffix |
| **Input** | `textarea`, 3 rows, `resize-none` |
| **Placeholder** | `"seller.shop.brandStoryPlaceholder"` |
| **Validation** | None (optional) |
| **Bengali Specific** | `dir="auto"` for proper text direction |

---

#### Warning Card (Below Language Columns)

| Property | Value |
|----------|-------|
| **Component** | `Card` (tinted variant) |
| **Icon** | Warning triangle (amber-600) |
| **Title** | `h6`, amber-800 (dark: amber-300) |
| **Description** | `body-small`, amber-700 (dark: amber-400) |
| **Content** | "Both languages required" message |

---

### Section 3: Address

| Element | Design Pattern | Specification |
|---------|---------------|---------------|
| **Section Title** | `h5` heading | `"seller.shop.addressSectionTitle"` |
| **Section Description** | `body-small`, muted | `"seller.shop.addressSectionDescription"` |

#### Field 3.1: Shop Address

| Property | Value |
|----------|-------|
| **Component** | `ValidatedInput` (custom component) |
| **Label** | `h6`, bold + red asterisk |
| **Input Type** | Text |
| **Validation** | Min 5 chars, Max 500 chars, Required |
| **Error Display** | Passed as `error` prop |
| **Hint** | Passed as `hint` prop |

---

## 📝 STEP 2: Branding (Optional)

### Header Section

| Element | Style |
|---------|-------|
| **Title** | `h1`, centered |
| **Subtitle** | `body-base`, muted, centered |

---

### Field 2.1: Logo Upload

| Property | Value |
|----------|-------|
| **Component** | `ImageUpload` |
| **Label** | `"seller.shop.logoLabel"` |
| **Description** | "JPEG, PNG, WEBP, or GIF (max 3MB) - Optional" |
| **Max Size** | 3MB |
| **Preview** | Shows uploaded image |
| **States** | Uploading, Deleting, Preview |

### Field 2.2: Banner Upload

| Property | Value |
|----------|-------|
| **Component** | `ImageUpload` |
| **Label** | `"seller.shop.bannerLabel"` |
| **Description** | "JPEG, PNG, WEBP, or GIF (max 3MB) - Optional" |
| **Max Size** | 3MB |
| **Preview** | Shows uploaded image |
| **States** | Uploading, Deleting, Preview |

---

### Info Card (Bottom of Step 2)

| Property | Value |
|----------|-------|
| **Component** | `Card` (tinted variant) |
| **Content** | "💡 You can add branding later. Click 'Create Shop' to finish setup now." |
| **Style** | `body-small`, muted |

---

## 🎛️ Navigation Buttons

### Container
- `flex justify-between`
- Top border separator (`border-t`, cream/forest)
- Padding top: `pt-6`

### Previous Button

| Property | Value |
|----------|-------|
| **Type** | `Button` (outline variant) |
| **Label** | `"seller.shop.previousButton"` |
| **Disabled** | When `currentStep() === 1` or `submission.pending` |
| **Visibility** | `invisible` class on step 1 |

### Next/Create Button

| Property | Value |
|----------|-------|
| **Type** | `Button` (accent variant) |
| **Conditional Render** | If `currentStep < STEPS.length`: "Next" button |
| **Final Step** | `Button[type="submit"]`: "Create Shop" |
| **Loading State** | Shows "Creating..." when `submission.pending` |
| **Disabled** | When `submission.pending` |

---

## 🎨 Design Tokens

### Colors

| Token | Usage |
|-------|-------|
| `terracotta-500` | Primary accent (progress, focus rings) |
| `forest-500` | Success state, completion |
| `red-500/600` | Errors, required indicators |
| `amber-600/700/800` | Warnings, info cards |
| `cream-200` | Borders, inactive states |
| `forest-700/800` | Dark mode backgrounds |

### Typography

| Token | Usage |
|-------|-------|
| `h1` | Step titles (Step 2 header) |
| `h5` | Section headers |
| `h6` | Field labels |
| `body-base` | Descriptions |
| `body-small` | Hints, errors, helper text |

### Spacing

| Pattern | Value |
|---------|-------|
| Section gap | `space-y-8` |
| Field group gap | `space-y-4` |
| Form container | `space-y-6` |
| Card padding | `p-4`, `p-8` |

---

## ♿ Accessibility Features

| Feature | Implementation |
|---------|---------------|
| **Required Fields** | Red asterisk `*` on labels |
| **Error Messages** | `body-small`, red-600, below field |
| **Text Direction** | `dir="auto"` for Bengali fields |
| **Focus States** | `focus:ring-2 focus:ring-terracotta-500` |
| **Dark Mode** | All colors have `dark:` variants |
| **Loading States** | Disabled buttons with pending text |
| **Progress Indicator** | Visual stepper with checkmarks |

---

## 📊 Validation Rules

| Field | Required | Min Length | Max Length | Pattern |
|-------|----------|------------|------------|---------|
| Shop Name (EN) | ✅ Yes | 1 char | - | - |
| Shop Name (BN) | ✅ Yes | 1 char | - | - |
| Description (EN) | ✅ Yes | 10 chars | - | - |
| Description (BN) | ✅ Yes | 10 chars | - | - |
| Business Hours | ❌ Optional | - | - | - |
| Shop Slug | ❌ Optional | - | - | Lowercase alphanumeric + hyphens |
| Address | ✅ Yes | 5 chars | 500 chars | - |
| Logo | ❌ Optional | - | 3MB | Image files |
| Banner | ❌ Optional | - | 3MB | Image files |

---

## 🔄 User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SHOP CREATION FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STEP 1: Basic Information (Required)                       │
│  ├─ Shop Slug (Optional, auto-generated)                    │
│  ├─ Shop Name (EN + BN, Required)                           │
│  ├─ Description (EN + BN, Required, min 10 chars)           │
│  ├─ Business Hours (EN + BN, Optional)                      │
│  └─ Address (Required, min 5 chars)                         │
│                                                             │
│  ↓ [Next Button] - Validates all fields                     │
│                                                             │
│  STEP 2: Branding (Optional)                                │
│  ├─ Logo Upload (Optional)                                  │
│  ├─ Banner Upload (Optional)                                │
│  └─ [Create Shop Button] - Submits form                     │
│                                                             │
│  ↓ [Submission]                                              │
│                                                             │
│  SUCCESS: Redirect to /app/seller/my-shop                   │
│  ERROR: Show toaster notification                           │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🧩 Component Dependencies

| Component | Source | Usage |
|-----------|--------|-------|
| `Button` | `~/components/ui` | Navigation buttons |
| `ImageUpload` | `~/components/ui` | Logo/banner upload |
| `Card` | `~/components/ui` | Info cards, slug input |
| `ValidatedInput` | `~/components/seller` | Address field |
| `SegmentedControl` | `~/components/ui` | (Available for use) |
| `useImageUpload` | `~/lib/hooks` | Upload logic hook |
| `useI18n` | `~/i18n` | Translation functions |

---

## 📦 State Management

| State | Type | Purpose |
|-------|------|---------|
| `currentStep` | `createSignal(1)` | Active step (1 or 2) |
| `errors` | `createSignal<Record>` | Field validation errors |
| `docErrors` | `createSignal<Record>` | Document upload errors |
| `translations` | `createStore` | Bilingual form data |
| `businessInfo` | `createSignal` | Address data |
| `mediaIds` | `createSignal` | Uploaded media IDs |
| `shopSlug` | `createSignal` | URL slug |
| `isSlugManual` | `createSignal` | Slug auto/manual flag |
| `submission` | `useSubmission` | Form submission state |

---

## 🎯 Design Principles Summary

1. **Bilingual Equality**: Both English and Bengali fields are presented side-by-side with equal visual weight
2. **Progressive Disclosure**: Only show relevant fields for the current step
3. **Clear Validation**: Real-time feedback with visual indicators (colors, icons)
4. **Optional Flexibility**: Branding is optional to reduce friction
5. **Consistent Spacing**: Uniform gaps and padding throughout
6. **Dark Mode Ready**: All colors have dark mode variants
7. **Mobile Responsive**: Columns stack on small screens (`lg:grid-cols-2`)

---
