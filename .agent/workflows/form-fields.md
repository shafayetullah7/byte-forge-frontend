---
description: Form field visual tokens — labels, inputs, selects, and when to use the kit vs raw HTML
---

# Form field visual conventions

Use the kit and tokens in `src/components/ui/field-styles.ts`. Do not invent per-page input CSS.

See `docs/FORM_FIELD_UNIFORMITY_PLAN.md` for the rollout. Requirement markers (`*` / optional) stay in `FieldGroup` — see `.cursor/rules/55-field-requirements.mdc`.

## Prefer the kit

New labeled fields must use one of:

- `Input` / `Textarea`
- `Select` / `AdvancedSelect` / `CategoryTreeSelect` / `FilterSelect`
- `FieldGroup` wrapping a control that has no built-in label
- `ImageUpload` / `FileUpload` for files

Do **not** wrap `Input` in a second `<label>`.

## Raw HTML

Raw `<input>`, `<textarea>`, or `<select>` is allowed only when:

- It is a checkbox, radio, or file input, or
- A composite control (slug prefix, currency) that still uses `fieldControlClass()` / `fieldLabel`

Never use `h5` / `h6` on field labels. Those are page/section titles.

## Sizes

| Size | When |
|------|------|
| Default (`md`) | Page forms (setup, addresses, plant editor, shop edit) |
| `sm` | Toolbars, ship/inventory side panels, list filters |

`FilterSelect` defaults to `sm`. Everything else defaults to `md`. Pass `size="sm"` or `fieldControlClass({ size: "sm" })` when compact.

Dropdown triggers use `fieldControlClass({ open: isOpen() })` so the open border matches focus.

## Focus

Form controls use **forest** focus (`fieldControlIdle`). Terracotta is for primary/destructive **buttons**, not field rings.

## PR checklist

- [ ] No `h6` (or `h5`) on `<label>`
- [ ] Default vs `sm` is explicit
- [ ] Focus is forest, not terracotta, unless the element is a CTA
- [ ] New fields use kit components or `field-styles.ts` tokens
- [ ] `pnpm audit:form-fields` is clean
