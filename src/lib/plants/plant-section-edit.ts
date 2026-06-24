import type { PlantFormState, PlantVariantForm } from "~/lib/types/plant-form";
import { toUpdatePlantDto } from "~/lib/types/plant-form";

export type PlantSectionId =
  | "identity"
  | "categoryTags"
  | "classification"
  | "careProfile"
  | "careGuide"
  | `variant:${string}`;

export type FormErrors = Record<string, string>;

export function isVariantSectionId(id: PlantSectionId): id is `variant:${string}` {
  return id.startsWith("variant:");
}

export function variantIdFromSection(id: `variant:${string}`): string {
  return id.slice("variant:".length);
}

export function validateSection(
  sectionId: PlantSectionId,
  form: PlantFormState,
  t: (key: string) => string,
): FormErrors {
  const errors: FormErrors = {};

  if (sectionId === "identity") {
    if (!form.thumbnail.id) {
      errors.thumbnail = t("seller.products.newPlant.thumbnailRequired");
    }
    if (!form.translations.en.name.trim()) {
      errors["en.name"] = t("seller.products.newPlant.nameRequired");
    } else if (form.translations.en.name.length < 3) {
      errors["en.name"] = t("seller.products.newPlant.nameTooShort");
    } else if (form.translations.en.name.length > 255) {
      errors["en.name"] = t("seller.products.newPlant.nameTooLong");
    }
    if (form.translations.en.shortDescription.length > 500) {
      errors["en.shortDescription"] = t("seller.products.newPlant.shortDescriptionTooLong");
    }
    if (form.translations.bn.name.trim()) {
      if (form.translations.bn.name.length < 3) errors["bn.name"] = t("seller.products.newPlant.nameTooShort");
      else if (form.translations.bn.name.length > 255) errors["bn.name"] = t("seller.products.newPlant.nameTooLong");
    }
    if (form.translations.bn.shortDescription.length > 500) {
      errors["bn.shortDescription"] = t("seller.products.newPlant.shortDescriptionTooLong");
    }
    const slug = form.slug.trim();
    if (slug) {
      if (slug.length < 3) errors.slug = t("seller.products.newPlant.slugTooShort");
      else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) errors.slug = t("seller.products.newPlant.slugInvalid");
    }
  }

  if (sectionId === "categoryTags") {
    if (!form.plantDetails.categoryId.trim()) {
      errors.categoryId = t("seller.products.newPlant.categoryRequired");
    }
  }

  if (sectionId === "careProfile") {
    if (!form.plantDetails.lightRequirement) errors.lightRequirement = t("seller.products.newPlant.lightRequired");
    if (!form.plantDetails.wateringFrequency) errors.wateringFrequency = t("seller.products.newPlant.wateringRequired");
    if (!form.plantDetails.humidityLevel) errors.humidityLevel = t("seller.products.newPlant.humidityRequired");
    if (!form.plantDetails.careDifficulty) errors.careDifficulty = t("seller.products.newPlant.careDifficultyRequired");
  }

  if (isVariantSectionId(sectionId)) {
    const variantId = variantIdFromSection(sectionId);
    const index = form.variants.findIndex((v) => v.id === variantId);
    if (index < 0) {
      errors.variants = t("seller.products.newPlant.atLeastOneVariant");
      return errors;
    }
    const v = form.variants[index];
    if (v.price === "" || v.price <= 0) {
      errors[`variants.${index}.price`] = t("seller.products.newPlant.priceRequired");
    }
    let baseCount = 0;
    form.variants.forEach((variant) => {
      if (variant.isBase) baseCount++;
    });
    if (baseCount !== 1) errors.baseVariant = t("seller.products.newPlant.exactlyOneBase");
  }

  return errors;
}

export function sectionTouchesVariants(sectionId: PlantSectionId): boolean {
  return isVariantSectionId(sectionId);
}

export function buildUpdateDto(form: PlantFormState): Record<string, unknown> {
  return toUpdatePlantDto(form);
}

export function cloneForm(form: PlantFormState): PlantFormState {
  return JSON.parse(JSON.stringify(form)) as PlantFormState;
}

export function updateVariantInForm(
  form: PlantFormState,
  variantId: string,
  updater: (v: PlantVariantForm) => PlantVariantForm,
): PlantFormState {
  return {
    ...form,
    variants: form.variants.map((v) => (v.id === variantId ? updater(v) : v)),
  };
}

export function applySectionToForm(
  form: PlantFormState,
  sectionId: PlantSectionId,
  draft: Partial<PlantFormState>,
): PlantFormState {
  const merged = cloneForm(form);
  if (sectionId === "identity") {
    if (draft.thumbnail) merged.thumbnail = draft.thumbnail;
    if (draft.status) merged.status = draft.status;
    if (draft.slug !== undefined) merged.slug = draft.slug;
    if (draft.translations) merged.translations = { ...merged.translations, ...draft.translations };
    if (draft.plantDetails?.scientificName !== undefined) {
      merged.plantDetails.scientificName = draft.plantDetails.scientificName;
    }
  }
  if (sectionId === "categoryTags" && draft.plantDetails) {
    if (draft.plantDetails.categoryId !== undefined) merged.plantDetails.categoryId = draft.plantDetails.categoryId;
    if (draft.plantDetails.tagIds) merged.plantDetails.tagIds = draft.plantDetails.tagIds;
  }
  if (sectionId === "classification" && draft.plantDetails?.translations) {
    merged.plantDetails.translations = {
      en: { ...merged.plantDetails.translations.en, ...draft.plantDetails.translations.en },
      bn: { ...merged.plantDetails.translations.bn, ...draft.plantDetails.translations.bn },
    };
  }
  if (sectionId === "careProfile" && draft.plantDetails) {
    Object.assign(merged.plantDetails, draft.plantDetails);
  }
  if (sectionId === "careGuide" && draft.careGuide) {
    merged.careGuide = draft.careGuide;
  }
  if (isVariantSectionId(sectionId) && draft.variants) {
    const variantId = variantIdFromSection(sectionId);
    const draftVariant = draft.variants.find((v) => v.id === variantId);
    if (draftVariant) {
      merged.variants = merged.variants.map((v) => (v.id === variantId ? draftVariant : v));
    }
  }
  return merged;
}
