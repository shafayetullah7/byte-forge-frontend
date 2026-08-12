/**
 * Plant AI draft API types (matches backend plant-ai-draft.schema.ts)
 */

export interface PlantAiDraftLocaleBlock {
  name: string;
  shortDescription?: string;
  description?: string;
}

export interface PlantAiDraftDetailsLocale {
  commonNames?: string;
  origin?: string;
  soilType?: string;
  toxicityInfo?: string;
}

export interface PlantAiDraftCareGuideLocale {
  lightInstructions?: string;
  wateringInstructions?: string;
  humidityInstructions?: string;
  fertilizerSchedule?: string;
  repottingFrequency?: string;
  pruningNotes?: string;
  commonProblems?: string;
  seasonalCare?: string;
}

export interface PlantAiDraftPlantDetails {
  scientificName?: string;
  categoryId: string;
  tagIds: string[];
  lightRequirement: string;
  wateringFrequency: string;
  humidityLevel: string;
  careDifficulty: string;
  growthRate?: string;
  temperatureRange?: string;
  matureHeight?: string;
  matureSpread?: string;
  translations: {
    en: PlantAiDraftDetailsLocale;
    bn: PlantAiDraftDetailsLocale;
  };
}

export interface PlantAiDraftDefaultVariant {
  growthStage: string;
  plantForm: string;
  propagationType?: string;
  containerType?: string;
  translations: {
    en: { title: string };
    bn: { title: string };
  };
}

export interface PlantAiDraftResponse {
  translations: {
    en: PlantAiDraftLocaleBlock;
    bn: PlantAiDraftLocaleBlock;
  };
  plantDetails: PlantAiDraftPlantDetails;
  careGuide: {
    en: PlantAiDraftCareGuideLocale;
    bn: PlantAiDraftCareGuideLocale;
  };
  defaultVariant?: PlantAiDraftDefaultVariant;
}

export interface PlantAiDraftRequest {
  plantName?: string;
  scientificName?: string;
  thumbnailMediaId?: string;
  localeHint?: "en" | "bn";
}

export interface PlantAiDraftStatus {
  enabled: boolean;
}
