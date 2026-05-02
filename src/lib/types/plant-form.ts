// ========================
// Plant Form Types
// ========================

export interface PlantVariantForm {
  id: string;
  sku: string;
  price: number | "";
  inventoryCount: number | "";
  trackInventory: boolean;
  lowStockThreshold: number | "";
  isBase: boolean;
  isActive: boolean;
  mediaIds: string[];
  mediaUrls: string[];
  growthStage: string;
  plantForm: string;
  variegation: string;
  leafDensity: string;
  stemCount: number | "";
  currentHeight: string;
  currentSpread: string;
  propagationType: string;
  containerType: string;
  containerSize: string;
  bundleType: string;
}

export interface CareGuideSection {
  lightInstructions: string;
  wateringInstructions: string;
  humidityInstructions: string;
  fertilizerSchedule: string;
  repottingFrequency: string;
  pruningNotes: string;
  commonProblems: string;
  seasonalCare: string;
}

export interface PlantTranslation {
  name: string;
  shortDescription: string;
  description: string;
}

export interface PlantDetailsTranslation {
  commonNames: string;
  origin: string;
  soilType: string;
  toxicityInfo: string;
}

export interface PlantFormState {
  thumbnail: { id: string | null; url: string | null };
  status: "DRAFT" | "ACTIVE" | "ARCHIVED";
  slug: string;
  translations: {
    en: PlantTranslation;
    bn: PlantTranslation;
  };
  plantDetails: {
    categoryId: string;
    tagIds: string[];
    scientificName: string;
    lightRequirement: string;
    wateringFrequency: string;
    humidityLevel: string;
    temperatureRange: string;
    careDifficulty: string;
    growthRate: string;
    matureHeight: string;
    matureSpread: string;
    translations: {
      en: PlantDetailsTranslation;
      bn: PlantDetailsTranslation;
    };
  };
  variants: PlantVariantForm[];
  careGuide: {
    en: CareGuideSection;
    bn: CareGuideSection;
  };
}

// ========================
// Factory
// ========================

let variantIdCounter = 0;

export function createEmptyVariant(): PlantVariantForm {
  return {
    id: `variant-${++variantIdCounter}`,
    sku: "",
    price: "",
    inventoryCount: "",
    trackInventory: true,
    lowStockThreshold: "",
    isBase: false,
    isActive: true,
    mediaIds: [],
    mediaUrls: [],
    growthStage: "juvenile",
    plantForm: "upright",
    variegation: "none",
    leafDensity: "moderate",
    stemCount: 1,
    currentHeight: "",
    currentSpread: "",
    propagationType: "cutting",
    containerType: "nursery_pot",
    containerSize: "",
    bundleType: "",
  };
}

const emptyCareGuideSection: CareGuideSection = {
  lightInstructions: "",
  wateringInstructions: "",
  humidityInstructions: "",
  fertilizerSchedule: "",
  repottingFrequency: "",
  pruningNotes: "",
  commonProblems: "",
  seasonalCare: "",
};

export function createEmptyForm(): PlantFormState {
  return {
    thumbnail: { id: null, url: null },
    status: "DRAFT",
    slug: "",
    translations: {
      en: { name: "", shortDescription: "", description: "" },
      bn: { name: "", shortDescription: "", description: "" },
    },
    plantDetails: {
      categoryId: "",
      tagIds: [],
      scientificName: "",
      lightRequirement: "",
      wateringFrequency: "",
      humidityLevel: "",
      temperatureRange: "",
      careDifficulty: "",
      growthRate: "",
      matureHeight: "",
      matureSpread: "",
      translations: {
        en: { commonNames: "", origin: "", soilType: "", toxicityInfo: "" },
        bn: { commonNames: "", origin: "", soilType: "", toxicityInfo: "" },
      },
    },
    variants: [createEmptyVariant()],
    careGuide: {
      en: { ...emptyCareGuideSection },
      bn: { ...emptyCareGuideSection },
    },
  };
}

// ========================
// Helpers
// ========================

function clean(value: string): string | undefined {
  return value.trim() || undefined;
}

function hasCareSection(section: CareGuideSection): boolean {
  return Boolean(
    section.lightInstructions ||
    section.wateringInstructions ||
    section.humidityInstructions ||
    section.fertilizerSchedule ||
    section.repottingFrequency ||
    section.pruningNotes ||
    section.commonProblems ||
    section.seasonalCare
  );
}

function variantHasAttributes(v: PlantVariantForm): boolean {
  return Boolean(
    v.growthStage || v.plantForm || v.variegation || v.leafDensity ||
    v.stemCount || v.currentHeight || v.currentSpread ||
    v.propagationType || v.containerType || v.containerSize || v.bundleType
  );
}

// ========================
// Transform: Form State → Backend DTO
// ========================

export function toCreatePlantDto(form: PlantFormState): Record<string, unknown> {
  const translations: Array<Record<string, unknown>> = [
    {
      locale: "en",
      name: form.translations.en.name,
      ...(form.translations.en.shortDescription && { shortDescription: form.translations.en.shortDescription }),
      ...(form.translations.en.description && { description: form.translations.en.description }),
    },
  ];

  if (form.translations.bn.name.trim()) {
    translations.push({
      locale: "bn",
      name: form.translations.bn.name,
      ...(form.translations.bn.shortDescription && { shortDescription: form.translations.bn.shortDescription }),
      ...(form.translations.bn.description && { description: form.translations.bn.description }),
    });
  }

  const variants = form.variants.map((v) => {
    const variant: Record<string, unknown> = {
      sku: clean(v.sku),
      price: typeof v.price === "number" ? v.price : 0,
      inventoryCount: typeof v.inventoryCount === "number" ? v.inventoryCount : 0,
      trackInventory: v.trackInventory,
      lowStockThreshold: typeof v.lowStockThreshold === "number" ? v.lowStockThreshold : 5,
      isBase: v.isBase,
      isActive: v.isActive,
    };

    if (variantHasAttributes(v)) {
      variant.plantAttributes = {
        growthStage: v.growthStage || "juvenile",
        plantForm: v.plantForm || "upright",
        variegation: v.variegation || "none",
        leafDensity: v.leafDensity || "moderate",
        stemCount: typeof v.stemCount === "number" ? v.stemCount : 1,
        currentHeight: clean(v.currentHeight),
        currentSpread: clean(v.currentSpread),
        propagationType: v.propagationType || "cutting",
        containerType: v.containerType || "nursery_pot",
        containerSize: clean(v.containerSize),
        bundleType: clean(v.bundleType),
      };
    }

    if (v.mediaIds.length > 0) {
      variant.mediaIds = v.mediaIds;
    }

    return variant;
  });

  const careGuide: Record<string, unknown> | undefined = hasCareSection(form.careGuide.en) || hasCareSection(form.careGuide.bn)
    ? {
        ...(hasCareSection(form.careGuide.en)
          ? {
              en: {
                lightInstructions: clean(form.careGuide.en.lightInstructions),
                wateringInstructions: clean(form.careGuide.en.wateringInstructions),
                humidityInstructions: clean(form.careGuide.en.humidityInstructions),
                fertilizerSchedule: clean(form.careGuide.en.fertilizerSchedule),
                repottingFrequency: clean(form.careGuide.en.repottingFrequency),
                pruningNotes: clean(form.careGuide.en.pruningNotes),
                commonProblems: clean(form.careGuide.en.commonProblems),
                seasonalCare: clean(form.careGuide.en.seasonalCare),
              },
            }
          : {}),
        ...(hasCareSection(form.careGuide.bn)
          ? {
              bn: {
                lightInstructions: clean(form.careGuide.bn.lightInstructions),
                wateringInstructions: clean(form.careGuide.bn.wateringInstructions),
                humidityInstructions: clean(form.careGuide.bn.humidityInstructions),
                fertilizerSchedule: clean(form.careGuide.bn.fertilizerSchedule),
                repottingFrequency: clean(form.careGuide.bn.repottingFrequency),
                pruningNotes: clean(form.careGuide.bn.pruningNotes),
                commonProblems: clean(form.careGuide.bn.commonProblems),
                seasonalCare: clean(form.careGuide.bn.seasonalCare),
              },
            }
          : {}),
      }
    : undefined;

  const pd = form.plantDetails;

  return {
    ...(form.slug.trim() && { slug: form.slug.trim() }),
    thumbnailId: form.thumbnail.id,
    status: form.status,
    translations,
    plantDetails: {
      categoryId: pd.categoryId,
      ...(pd.tagIds.length > 0 && { tagIds: pd.tagIds }),
      scientificName: clean(pd.scientificName),
      lightRequirement: pd.lightRequirement,
      wateringFrequency: pd.wateringFrequency,
      humidityLevel: pd.humidityLevel,
      temperatureRange: clean(pd.temperatureRange),
      careDifficulty: pd.careDifficulty,
      growthRate: clean(pd.growthRate),
      matureHeight: clean(pd.matureHeight),
      matureSpread: clean(pd.matureSpread),
      translations: {
        en: {
          commonNames: clean(pd.translations.en.commonNames),
          origin: clean(pd.translations.en.origin),
          soilType: clean(pd.translations.en.soilType),
          toxicityInfo: clean(pd.translations.en.toxicityInfo),
        },
        bn: {
          commonNames: clean(pd.translations.bn.commonNames),
          origin: clean(pd.translations.bn.origin),
          soilType: clean(pd.translations.bn.soilType),
          toxicityInfo: clean(pd.translations.bn.toxicityInfo),
        },
      },
    },
    variants,
    ...(careGuide && { careGuide }),
  };
}
