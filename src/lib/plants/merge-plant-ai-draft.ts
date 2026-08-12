import type { PlantAiDraftRequest, PlantAiDraftResponse, PlantAiDraftDefaultVariant } from "~/lib/api/types/plant-ai.types";
import type {
  CareGuideSection,
  PlantFormState,
  PlantVariantForm,
} from "~/lib/types/plant-form";
import { slugify } from "~/lib/utils/slugify";

function text(value: string | undefined): string {
  return value ?? "";
}

function careSectionFromDraft(
  section: PlantAiDraftResponse["careGuide"]["en"],
): CareGuideSection {
  return {
    lightInstructions: text(section.lightInstructions),
    wateringInstructions: text(section.wateringInstructions),
    humidityInstructions: text(section.humidityInstructions),
    fertilizerSchedule: text(section.fertilizerSchedule),
    repottingFrequency: text(section.repottingFrequency),
    pruningNotes: text(section.pruningNotes),
    commonProblems: text(section.commonProblems),
    seasonalCare: text(section.seasonalCare),
  };
}

function mergeDefaultVariantIntoForm(
  baseVariant: PlantVariantForm,
  draft?: PlantAiDraftDefaultVariant,
): PlantVariantForm {
  if (!draft) return baseVariant;

  return {
    ...baseVariant,
    growthStage: draft.growthStage,
    plantForm: draft.plantForm,
    propagationType: draft.propagationType ?? baseVariant.propagationType,
    containerType: draft.containerType ?? baseVariant.containerType,
    translations: {
      en: { title: draft.translations.en.title },
      bn: { title: draft.translations.bn.title },
    },
  };
}

/**
 * Merge a validated AI draft into wizard form state.
 * Preserves thumbnail, status, and all variant commerce fields (price, stock, SKU, media).
 */
export function mergePlantAiDraftIntoForm(
  base: PlantFormState,
  draft: PlantAiDraftResponse,
): PlantFormState {
  const slug =
    base.slug.trim() || slugify(draft.translations.en.name);

  const variants =
    base.variants.length > 0
      ? [
          mergeDefaultVariantIntoForm(base.variants[0], draft.defaultVariant),
          ...base.variants.slice(1),
        ]
      : base.variants;

  return {
    ...base,
    slug,
    translations: {
      en: {
        name: draft.translations.en.name,
        shortDescription: text(draft.translations.en.shortDescription),
        description: text(draft.translations.en.description),
      },
      bn: {
        name: draft.translations.bn.name,
        shortDescription: text(draft.translations.bn.shortDescription),
        description: text(draft.translations.bn.description),
      },
    },
    plantDetails: {
      categoryId: draft.plantDetails.categoryId,
      tagIds: [...draft.plantDetails.tagIds],
      scientificName: text(draft.plantDetails.scientificName),
      lightRequirement: draft.plantDetails.lightRequirement,
      wateringFrequency: draft.plantDetails.wateringFrequency,
      humidityLevel: draft.plantDetails.humidityLevel,
      temperatureRange: text(draft.plantDetails.temperatureRange),
      careDifficulty: draft.plantDetails.careDifficulty,
      growthRate: text(draft.plantDetails.growthRate),
      matureHeight: text(draft.plantDetails.matureHeight),
      matureSpread: text(draft.plantDetails.matureSpread),
      translations: {
        en: {
          commonNames: text(draft.plantDetails.translations.en.commonNames),
          origin: text(draft.plantDetails.translations.en.origin),
          soilType: text(draft.plantDetails.translations.en.soilType),
          toxicityInfo: text(draft.plantDetails.translations.en.toxicityInfo),
        },
        bn: {
          commonNames: text(draft.plantDetails.translations.bn.commonNames),
          origin: text(draft.plantDetails.translations.bn.origin),
          soilType: text(draft.plantDetails.translations.bn.soilType),
          toxicityInfo: text(draft.plantDetails.translations.bn.toxicityInfo),
        },
      },
    },
    careGuide: {
      en: careSectionFromDraft(draft.careGuide.en),
      bn: careSectionFromDraft(draft.careGuide.bn),
    },
    thumbnail: base.thumbnail,
    status: base.status,
    variants,
  };
}

/** Build API request from current wizard fields (Phase 5 CTA). */
export function toPlantAiDraftRequest(
  form: PlantFormState,
  options?: { localeHint?: "en" | "bn" },
): PlantAiDraftRequest {
  const request: PlantAiDraftRequest = {};

  const plantName =
    form.translations.en.name.trim() || form.translations.bn.name.trim();
  const scientificName = form.plantDetails.scientificName.trim();

  if (plantName) request.plantName = plantName;
  if (scientificName) request.scientificName = scientificName;
  if (form.thumbnail.id) request.thumbnailMediaId = form.thumbnail.id;
  if (options?.localeHint) request.localeHint = options.localeHint;

  return request;
}

export function hasPlantAiDraftSignals(request: PlantAiDraftRequest): boolean {
  return Boolean(
    request.plantName?.trim() ||
      request.scientificName?.trim() ||
      request.thumbnailMediaId,
  );
}

export function isPhotoOnlyPlantAiRequest(
  request: PlantAiDraftRequest,
): boolean {
  return Boolean(
    request.thumbnailMediaId &&
      !request.plantName?.trim() &&
      !request.scientificName?.trim(),
  );
}
