# Phased plan: form field visual uniformity

**Status:** Complete (Phases 0–6)  
**Scope:** `byte-forge-frontend-2` labels, inputs, textareas, selects, and related field chrome  
**Goal:** One optical scale so labels are not headings, controls are not mixed heights/borders, and compact UIs are an explicit size — not ad-hoc CSS.

Do **not** redesign the product. Align everything to the existing kit in `src/components/ui/Input.tsx` (and siblings).

---

## Target scale (lock this first)

**Default** — page forms (setup shop, addresses, plant editor, shop edit):

| Token | Value | Why |
|-------|--------|-----|
| Label | `text-sm font-medium text-gray-700 dark:text-gray-300` (14px) | Same size as control text; not `h6` |
| Label → control | `mb-1.5` (6px) | Bound without crowding |
| Control | `px-4 py-2.5 text-sm rounded-lg border-2` (~44px) | Comfortable, not huge |
| Border idle | `border-cream-200 dark:border-forest-700` | Match `Input` |
| Focus | forest (`border-forest-500` + `focus-ring-flat`) | Terracotta stays on primary buttons |
| Error / hint | `text-xs` + `mt-1` | One step below the field |
| Field → field | `space-y-4` or `space-y-5` | Page rhythm |
| Required | red `*` | Already used |
| Optional | `(optional)` in `text-gray-400 font-normal` | Match `FieldGroup` |

**Compact (`sm`)** — toolbars, ship panel, inventory filters:

| Token | Value |
|-------|--------|
| Label | `text-xs font-medium` or `sr-only` on toolbar selects |
| Control | `px-3 py-2 text-sm rounded-lg border-2` (~36–38px) |

**Never:** `h5` / `h6` on field labels. Those utilities are page/section titles (18px+).

---

## Current gaps (why we need phases)

1. Setup shop uses `h6` labels + `px-3 py-2` / `border` / terracotta focus.
2. Kit vs raw: `Input` is `border-2 px-4 py-2.5`; many raw `<input>`s are `border px-3 py-2`.
3. Label gap is `mb-1` / `mb-1.5` / `mb-2` / `space-y-2` / none.
4. `Select` / `AdvancedSelect` / `CategoryTreeSelect` / `FileUpload` almost match the kit but differ (label gap, `body-base` vs `text-sm`, forest vs gray label color).
5. Compact UIs (ship order, stock timeline) invent `text-xs` + `py-2` instead of a named size.
6. Duplicate wrappers (`InlineFieldset` ≈ `FieldGroup`; extra `<label>` around `Input`).

---

## Phase 0 — Tokens + convention

**Status:** Done

**Purpose:** One source of truth so later PRs do not re-debate classes.  
**Risk:** None (no visual change until components import the tokens).  
**Est. files:** 2–3

### Deliverables

1. Add [`src/components/ui/field-styles.ts`](../src/components/ui/field-styles.ts) with shared class strings, e.g.:
   - `fieldLabel` / `fieldLabelSm`
   - `fieldControl` / `fieldControlSm`
   - `fieldControlError`
   - `fieldError` / `fieldHint`
   - `fieldOptionalMark` / `fieldRequiredMark`
2. Short section in [`.agent/workflows/`](../.agent/workflows/) or this doc: “New fields must use `Input` / `Select` / `Textarea` / `FieldGroup` / `AdvancedSelect`. Raw `<input>` only with `fieldControl` tokens.”
3. PR checklist:
   - [ ] No `h6` on labels
   - [ ] Default vs `sm` is explicit
   - [ ] Focus is forest, not terracotta, unless it is a CTA

### Exit criteria

`Input` can be switched to import tokens without a visual change (classes equivalent to today’s kit).

---

## Phase 1 — Align the shared kit (no page migrations yet)

**Status:** Done

**Purpose:** All primitives share height, type size, border, focus, label gap.  
**Risk:** Low (small visual diffs on any screen using these components).  
**Est. files:** ~8

| Component | Change |
|-----------|--------|
| [`Input.tsx`](../src/components/ui/Input.tsx) | Import tokens (baseline) |
| [`Textarea.tsx`](../src/components/ui/Textarea.tsx) | Same |
| [`Select.tsx`](../src/components/ui/Select.tsx) | Label `mb-1.5` (drop `space-y-2` mismatch); same control tokens |
| [`AdvancedSelect.tsx`](../src/components/ui/AdvancedSelect.tsx) | `text-sm` not `body-base`; drop hardcoded `h-[46px]` if padding already matches |
| [`CategoryTreeSelect.tsx`](../src/components/ui/CategoryTreeSelect.tsx) | Same label + trigger as `Select` |
| [`FilterSelect.tsx`](../src/components/ui/FilterSelect.tsx) | `border-2` + default or `sm` (filters → `sm`) |
| [`FieldGroup.tsx`](../src/components/ui/FieldGroup.tsx) | Label tokens |
| [`FileUpload.tsx`](../src/components/ui/FileUpload.tsx) | Label = kit gray + `mb-1.5` |
| [`TagMultiSelect.tsx`](../src/components/ui/TagMultiSelect.tsx) | Trigger matches `fieldControl` |

Add optional `size?: "md" | "sm"` on `Input`, `Select`, `FilterSelect`, `AdvancedSelect` (default `"md"`).

### Testing

- Plant wizard identity + category/select
- Address create/edit
- Article/campaign editors
- Dark mode focus rings

### Exit criteria

Two kit controls side by side (text input + select) share height and label style.

---

## Phase 2 — Setup shop (highest visual impact)

**Status:** Done

**Purpose:** The form users hit with no shop; currently the worst ratio.  
**Risk:** Low.  
**Est. files:** 1

[`setup-shop/(setup-shop).tsx`](../src/routes/(protected)/app/seller/setup-shop/(setup-shop).tsx):

- Replace raw `<input>` / `<textarea>` + `h6` labels with `Input`, `Textarea`, `FieldGroup` (`requirement="optional"` where needed).
- Keep bilingual two-column layout.
- Slug row: `FieldGroup` + prefixed input using `fieldControl` on the editable segment.
- `ImageUpload` inherits Phase 1 label tokens.

Do not change copy or validation — visual only.

### Testing

- Fresh seller setup: labels 14px, fields scrollable, EN/BN columns aligned
- Optional fields show `(optional)`, required show `*`
- Error states still red + message under field

### Exit criteria

Setup shop looks like address form / plant identity, not like a heading-on-tiny-input page.

---

## Phase 3 — Seller / buyer product forms already using the kit

**Status:** Done

**Purpose:** Remove duplicate wrappers and leftover raw fields next to `Input`.  
**Risk:** Low.  
**Est. files:** ~8–12

| Area | Change |
|------|--------|
| [`IdentityFields.tsx`](../src/routes/(protected)/app/seller/(seller-protected)/products/plants/components/sections/IdentityFields.tsx) | Delete `InlineFieldset`; use `FieldGroup` |
| Plant section fields (care, classification, variants) | Confirm `Input`/`Select`/`Textarea`; slug prefix uses tokens |
| [`AddressEditModal.tsx`](../src/components/seller/AddressEditModal.tsx) | Do not wrap `Input` in a second `<label>` |
| Shop info / branding / storefront editors | Same |
| [`my-shop/edit.tsx`](../src/routes/(protected)/app/seller/(seller-protected)/my-shop/edit.tsx) | Label gap `mb-1.5` |
| Articles / campaigns `[id]` | Already `Input`; verify after Phase 1 |

### Exit criteria

No duplicate labels; plant + shop edit forms share the default scale.

---

## Phase 4 — Compact surfaces (named `sm`)

**Status:** Done

**Purpose:** Dense UIs stay dense, but use tokens.  
**Risk:** Low–medium (layout in sidebars).  
**Est. files:** ~6

| Area | Change |
|------|--------|
| [`ShipOrderForm.tsx`](../src/routes/(protected)/app/seller/(seller-protected)/orders/components/ShipOrderForm.tsx) | `Input size="sm"` / `Textarea size="sm"` |
| Seller order accept/reject / cancel panels | Same |
| Buyer order cancel textarea | Same |
| [`StockMovementsTimeline.tsx`](../src/routes/(protected)/app/seller/(seller-protected)/products/[productId]/inventory/components/StockMovementsTimeline.tsx) | `sm` |
| [`CurrencyInput.tsx`](../src/routes/(protected)/app/seller/(seller-protected)/shipping-rates/components/CurrencyInput.tsx) | `md`/`sm` already — align classes to tokens; forest focus |

### Exit criteria

No `text-xs` labels on full-page forms; compact panels all use `size="sm"`.

---

## Phase 5 — Filters, pickers, leftover raw inputs

**Status:** Done

**Purpose:** Sweep remaining one-off fields.  
**Risk:** Low.  
**Est. files:** ~8

| Area | Change |
|------|--------|
| Plant public [`filter-section.tsx`](../src/routes/(app)/plants/filter-section.tsx) | Price inputs = `fieldControl` or `Input size="sm"` |
| Seller products / plants filter bars | `FilterSelect size="sm"` |
| [`CampaignProductPicker.tsx`](../src/components/seller/forms/CampaignProductPicker.tsx) | Search = kit control |
| Checkout notes (`PaymentStepContent`) | `Textarea` |
| [`CategorySearchSelect.tsx`](../src/components/seller/CategorySearchSelect.tsx) | Match `CategoryTreeSelect` |
| Newsletter / hero search | Out of scope unless they look like form fields |

### Exit criteria

`rg "<input"` in `src/routes` and `src/components` is either kit, `fieldControl`, or an intentional exception (file input, checkbox, radio, visually hidden).

---

## Phase 6 — Validation pass

**Status:** Done

**Purpose:** Prevent regression.  
**Risk:** None.

Static audit: `pnpm audit:form-fields` (no `h6` labels; no terracotta focus on text/select controls). Live click-through of the matrices below is still on the implementer.

`/components` shows default vs `sm` side by side.

### Manual matrix (default forms)

| Page | Labels 14px not h6 | Control height match | Forest focus | Scroll / layout |
|------|--------------------|----------------------|--------------|-----------------|
| Setup shop | ☐ | ☐ | ☐ | ☐ |
| Addresses new/edit | ☐ | ☐ | ☐ | — |
| Plant wizard / identity | ☐ | ☐ | ☐ | — |
| Shop edit / address modal | ☐ | ☐ | ☐ | — |
| Article / campaign editor | ☐ | ☐ | ☐ | — |

### Compact matrix

| Surface | `sm` height | Still readable |
|---------|-------------|----------------|
| Ship order | ☐ | ☐ |
| Inventory filters | ☐ | ☐ |
| List filter bars | ☐ | ☐ |

### Optional follow-up

- ESLint rule for `h6` on `<label>` (script covers this in CI-ready form)
- Broader sweep of shop catalog / cart qty (intentional exceptions today)

---

## PR order

| PR | Phase | Est. files | Risk |
|----|-------|------------|------|
| PR 1 | Phase 0–1 | ~10 | Low |
| PR 2 | Phase 2 | 1 | Low (high UX) |
| PR 3 | Phase 3 | 8–12 | Low |
| PR 4 | Phase 4 | ~6 | Low–medium |
| PR 5 | Phase 5 | ~8 | Low |

Each PR is shippable. Prefer **0+1 together**, then **2** immediately so setup shop matches the kit.

---

## Out of scope

- New visual language (colors, rounded-xl vs lg, terracotta as brand focus)
- Auth/login forms in other packages (`aponika-auth`, `byte-forge-admin`)
- Checkbox / radio / toggle redesign (separate pass)
- Copy or validation rule changes

---

## Success metrics

- Setup shop labels are 14px medium, not 18px `h6`
- Default text input and select are the same height
- One focus color (forest) on form controls
- Compact UIs use `size="sm"`, not one-off `text-xs` + `py-2`
- No second `<label>` wrapping `Input`

---

## Related

- [`src/components/ui/Input.tsx`](../src/components/ui/Input.tsx) — visual baseline
- [`src/components/ui/FieldGroup.tsx`](../src/components/ui/FieldGroup.tsx) — label + required/optional
- [`src/app.css`](../src/app.css) — `h6` / `body-small` (do not use `h6` for labels)
