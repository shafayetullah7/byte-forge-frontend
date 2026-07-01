import type { SellerCampaignTranslations } from "~/lib/api/types/seller/campaigns.types";
import type { SellerArticleTranslations } from "~/lib/api/types/seller/articles.types";

export type ValidationMessages = {
  enTitleRequired: string;
  bnTitleRequired: string;
  startDateRequired?: string;
  endDateRequired?: string;
  endAfterStart?: string;
  enExcerptRequired?: string;
  bnExcerptRequired?: string;
  enBodyRequired?: string;
  bnBodyRequired?: string;
};

export interface CampaignFormState {
  translations: SellerCampaignTranslations;
  startDate: string;
  endDate: string;
}

export interface ArticleFormState {
  translations: SellerArticleTranslations;
}

export function campaignLocaleComplete(
  locale: "en" | "bn",
  translations: SellerCampaignTranslations,
): boolean {
  return translations[locale].title.trim().length > 0;
}

export function articleLocaleComplete(
  locale: "en" | "bn",
  translations: SellerArticleTranslations,
  forSubmit: boolean,
): boolean {
  const t = translations[locale];
  if (!t.title.trim()) return false;
  if (!forSubmit) return true;
  return !!(t.excerpt?.trim() && t.body?.trim());
}

export function validateCampaignDraft(
  form: CampaignFormState,
  messages: ValidationMessages,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.translations.en.title.trim()) {
    errors["en.title"] = messages.enTitleRequired;
  }
  if (!form.startDate) errors.startDate = messages.startDateRequired ?? "Start date required";
  if (!form.endDate) errors.endDate = messages.endDateRequired ?? "End date required";
  if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
    errors.endDate = messages.endAfterStart ?? "End date must be after start date";
  }
  return errors;
}

export function validateCampaignSubmit(
  form: CampaignFormState,
  messages: ValidationMessages,
): Record<string, string> {
  const errors = validateCampaignDraft(form, messages);
  if (!form.translations.bn.title.trim()) {
    errors["bn.title"] = messages.bnTitleRequired;
  }
  return errors;
}

export function isCampaignSubmitReady(form: CampaignFormState): boolean {
  return (
    campaignLocaleComplete("en", form.translations) &&
    campaignLocaleComplete("bn", form.translations) &&
    !!form.startDate &&
    !!form.endDate &&
    new Date(form.endDate) > new Date(form.startDate)
  );
}

export function validateArticleDraft(
  form: ArticleFormState,
  messages: Pick<ValidationMessages, "enTitleRequired">,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!form.translations.en.title.trim()) {
    errors["en.title"] = messages.enTitleRequired;
  }
  return errors;
}

export function validateArticleSubmit(
  form: ArticleFormState,
  messages: ValidationMessages,
): Record<string, string> {
  const errors = validateArticleDraft(form, messages);
  const en = form.translations.en;
  const bn = form.translations.bn;
  if (!en.excerpt?.trim()) errors["en.excerpt"] = messages.enExcerptRequired ?? "Required";
  if (!en.body?.trim()) errors["en.body"] = messages.enBodyRequired ?? "Required";
  if (!bn.title.trim()) errors["bn.title"] = messages.bnTitleRequired;
  if (!bn.excerpt?.trim()) errors["bn.excerpt"] = messages.bnExcerptRequired ?? "Required";
  if (!bn.body?.trim()) errors["bn.body"] = messages.bnBodyRequired ?? "Required";
  return errors;
}

export function isArticleSubmitReady(form: ArticleFormState): boolean {
  return (
    articleLocaleComplete("en", form.translations, true) &&
    articleLocaleComplete("bn", form.translations, true)
  );
}

/** Mirrors backend assertEditableStatus — DRAFT and REJECTED only. */
export function isContentEditable(status: string): boolean {
  return status === "DRAFT" || status === "REJECTED";
}

export function isContentSubmittable(status: string): boolean {
  return isContentEditable(status);
}

export function isContentArchivable(status: string): boolean {
  return status !== "ARCHIVED";
}

export function isContentDeletable(status: string): boolean {
  return status !== "APPROVED";
}
