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
  translations: {
    en: { title: string };
    bn: { title: string };
  };
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
    isBase: true,
    isActive: true,
    mediaIds: [],
    mediaUrls: [],
    growthStage: "JUVENILE",
    plantForm: "UPRIGHT",
    variegation: "NONE",
    leafDensity: "MODERATE",
    stemCount: 1,
    currentHeight: "",
    currentSpread: "",
    propagationType: "CUTTING",
    containerType: "NURSERY_POT",
    containerSize: "",
    bundleType: "",
    translations: {
      en: { title: "" },
      bn: { title: "" },
    },
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
        growthStage: v.growthStage || "JUVENILE",
        plantForm: v.plantForm || "UPRIGHT",
        variegation: v.variegation || "NONE",
        leafDensity: v.leafDensity || "MODERATE",
        stemCount: typeof v.stemCount === "number" ? v.stemCount : 1,
        currentHeight: clean(v.currentHeight),
        currentSpread: clean(v.currentSpread),
        propagationType: v.propagationType || "CUTTING",
        containerType: v.containerType || "NURSERY_POT",
        containerSize: clean(v.containerSize),
        bundleType: clean(v.bundleType),
      };
    }

    if (v.mediaIds.length > 0) {
      variant.mediaIds = v.mediaIds;
    }

    if (v.translations.en.title.trim() || v.translations.bn.title.trim()) {
      variant.translations = {
        en: { title: v.translations.en.title.trim() },
        bn: { title: v.translations.bn.title.trim() },
      };
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
      growthRate: pd.growthRate || undefined,
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

const SERVER_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isServerUuid(id: string): boolean {
  return SERVER_UUID_REGEX.test(id);
}

export function toUpdatePlantDto(form: PlantFormState): Record<string, unknown> {
  const dto = toCreatePlantDto(form);
  const variants = form.variants.map((formVariant, index) => {
    const variant = { ...(dto.variants as Record<string, unknown>[])[index] };
    delete variant.inventoryCount;
    delete variant.trackInventory;
    delete variant.lowStockThreshold;
    if (isServerUuid(formVariant.id)) {
      variant.id = formVariant.id;
    }
    return variant;
  });

  return {
    ...dto,
    variants,
  };
}

function findLocaleTranslation<T extends { locale: string }>(
  items: T[] | undefined,
  locale: string,
): T | undefined {
  return items?.find((item) => item.locale === locale);
}

export function fromPlantDetailToForm(plant: import("~/lib/api/types/seller.types").PlantDetail): PlantFormState {
  const enTranslation = findLocaleTranslation(plant.translations, "en");
  const bnTranslation = findLocaleTranslation(plant.translations, "bn");
  const details = plant.plantDetails;
  const detailsEn = findLocaleTranslation(details?.translations, "en");
  const detailsBn = findLocaleTranslation(details?.translations, "bn");
  const careBn = findLocaleTranslation(plant.careInstructions?.translations, "bn");

  const emptySection = (): CareGuideSection => ({ ...emptyCareGuideSection });

  return {
    thumbnail: plant.thumbnail
      ? { id: plant.thumbnail.id, url: plant.thumbnail.url }
      : { id: null, url: null },
    status: plant.status,
    slug: plant.slug,
    translations: {
      en: {
        name: enTranslation?.name ?? "",
        shortDescription: enTranslation?.shortDescription ?? "",
        description: enTranslation?.description ?? "",
      },
      bn: {
        name: bnTranslation?.name ?? "",
        shortDescription: bnTranslation?.shortDescription ?? "",
        description: bnTranslation?.description ?? "",
      },
    },
    plantDetails: {
      categoryId: details?.categoryId ?? "",
      tagIds: details?.tags?.map((tag) => tag.id) ?? [],
      scientificName: details?.scientificName ?? "",
      lightRequirement: details?.lightRequirement ?? "",
      wateringFrequency: details?.wateringFrequency ?? "",
      humidityLevel: details?.humidityLevel ?? "",
      temperatureRange: details?.temperatureRange ?? "",
      careDifficulty: details?.careDifficulty ?? "",
      growthRate: details?.growthRate ?? "",
      matureHeight: details?.matureHeight ?? "",
      matureSpread: details?.matureSpread ?? "",
      translations: {
        en: {
          commonNames: detailsEn?.commonNames ?? details?.commonNames ?? "",
          origin: detailsEn?.origin ?? details?.origin ?? "",
          soilType: detailsEn?.soilType ?? details?.soilType ?? "",
          toxicityInfo: detailsEn?.toxicityInfo ?? details?.toxicityInfo ?? "",
        },
        bn: {
          commonNames: detailsBn?.commonNames ?? "",
          origin: detailsBn?.origin ?? "",
          soilType: detailsBn?.soilType ?? "",
          toxicityInfo: detailsBn?.toxicityInfo ?? "",
        },
      },
    },
    variants: plant.variants.map((variant) => {
      const enTitle = findLocaleTranslation(variant.translations, "en")?.title ?? "";
      const bnTitle = findLocaleTranslation(variant.translations, "bn")?.title ?? "";
      const attrs = variant.plantAttributes;

      return {
        id: variant.id,
        sku: variant.sku ?? "",
        price: parseFloat(variant.price) || "",
        inventoryCount: variant.inventoryCount,
        trackInventory: variant.trackInventory,
        lowStockThreshold: variant.lowStockThreshold,
        isBase: variant.isBase,
        isActive: variant.isActive,
        mediaIds: variant.media.map((media) => media.mediaId),
        mediaUrls: variant.media.map((media) => media.url),
        growthStage: attrs?.growthStage ?? "JUVENILE",
        plantForm: attrs?.plantForm ?? "UPRIGHT",
        variegation: attrs?.variegation ?? "NONE",
        leafDensity: attrs?.leafDensity ?? "MODERATE",
        stemCount: attrs?.stemCount ?? 1,
        currentHeight: attrs?.currentHeight ?? "",
        currentSpread: attrs?.currentSpread ?? "",
        propagationType: attrs?.propagationType ?? "CUTTING",
        containerType: attrs?.containerType ?? "NURSERY_POT",
        containerSize: attrs?.containerSize ?? "",
        bundleType: attrs?.bundleType ?? "",
        translations: {
          en: { title: enTitle },
          bn: { title: bnTitle },
        },
      };
    }),
    careGuide: {
      en: {
        lightInstructions: plant.careInstructions?.lightInstructions ?? "",
        wateringInstructions: plant.careInstructions?.wateringInstructions ?? "",
        humidityInstructions: plant.careInstructions?.humidityInstructions ?? "",
        fertilizerSchedule: plant.careInstructions?.fertilizerSchedule ?? "",
        repottingFrequency: plant.careInstructions?.repottingFrequency ?? "",
        pruningNotes: plant.careInstructions?.pruningNotes ?? "",
        commonProblems: plant.careInstructions?.commonProblems ?? "",
        seasonalCare: plant.careInstructions?.seasonalCare ?? "",
      },
      bn: {
        lightInstructions: careBn?.lightInstructions ?? "",
        wateringInstructions: careBn?.wateringInstructions ?? "",
        humidityInstructions: careBn?.humidityInstructions ?? "",
        fertilizerSchedule: careBn?.fertilizerSchedule ?? "",
        repottingFrequency: careBn?.repottingFrequency ?? "",
        pruningNotes: careBn?.pruningNotes ?? "",
        commonProblems: careBn?.commonProblems ?? "",
        seasonalCare: careBn?.seasonalCare ?? "",
      },
    },
  };
}
