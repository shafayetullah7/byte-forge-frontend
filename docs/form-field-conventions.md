# Form field conventions

Byte Forge uses a single pattern for optional vs mandatory fields across seller (and future admin) forms.

## Component

```tsx
import { FieldGroup } from "~/components/ui/FieldGroup";

<FieldGroup
  label={t("seller.campaigns.fields.title")}
  requirement="required"
  hint={t("seller.campaigns.fields.titleHint")}
  error={errors()["en.title"]}
>
  <Input ... />
</FieldGroup>
```

`FieldGroup` lives in `src/components/ui/FieldGroup.tsx` and is exported from `~/components/ui`.

## Requirement values

| Value | UI | Meaning |
|-------|-----|---------|
| `required` | `*` (red) | Must be filled to save the form (draft or final). |
| `optional` | `(Optional)` | May be left empty for all actions. |
| `requiredForReview` | `(Required for review)` | May save as draft empty; required before **Submit for review**. |

Omitting `requirement` defaults to `required`.

## Hints

Hints describe **purpose**, not obligation:

- Good: “Headline shown on campaign cards and the detail page.”
- Bad: “Optional longer pitch…” — use `requirement="optional"` on the label instead.

Validation errors use the `error` prop and replace the hint while visible.

## Draft + moderated content

Campaign and article editors have two actions:

1. **Save draft** — checks `required` fields only.
2. **Submit for review** — checks `required` and `requiredForReview`.

Footer text (`submitRequirements` i18n) summarizes submit rules once.

### Campaign fields

| Field | Requirement |
|-------|-------------|
| EN title | `required` |
| BN title | `requiredForReview` |
| Description (EN/BN) | `optional` |
| Type, start/end date | `required` |
| Discount, banner, products | `optional` |

### Article fields

| Field | Requirement |
|-------|-------------|
| EN title | `required` |
| BN title, excerpt, body | `requiredForReview` |
| Category, read time, cover | `optional` |

## Bilingual layouts

- Show EN and BN fields side-by-side (`lg:grid-cols-2`).
- Do not use EN/BN tabs for primary translated content.
- Reuse `BilingualLocaleColumn`, `BilingualSectionIntro`, and shop i18n keys for column headers.

## i18n keys

```ts
common.optional           // "Optional" / "ঐচ্ছিক"
common.requiredForReview // "Required for review" / "রিভিউর জন্য প্রয়োজন"
```

Add per-form `validation.*` messages for error text; keep hints free of requirement language.

## Migrating older forms

- Replace inline `*` or `(optional)` in label strings with `requirement`.
- Replace `InlineFieldset` / ad-hoc labels with `FieldGroup` when touching a form.
- Plant wizard and shop setup: align to this pattern when those files are next edited.
