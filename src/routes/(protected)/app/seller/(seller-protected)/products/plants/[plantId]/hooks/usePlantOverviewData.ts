import { createMemo, type Accessor } from "solid-js";
import type { PlantDetail } from "~/lib/api/types/seller.types";
import { useI18n } from "~/i18n";
import { getInventoryStatus, formatPrice } from "../utils";
import { translationFor } from "../utils/plant-translations";
import type { CareInstructionKey } from "../components/care-instruction-config";

export type CareInstructionContent = Record<CareInstructionKey, string | null>;

function careContent(
  ci: NonNullable<PlantDetail["careInstructions"]>,
  locale: string,
): CareInstructionContent {
  const tr = translationFor(ci.translations, locale);
  return {
    lightInstructions: tr?.lightInstructions ?? ci.lightInstructions,
    wateringInstructions: tr?.wateringInstructions ?? ci.wateringInstructions,
    humidityInstructions: tr?.humidityInstructions ?? ci.humidityInstructions,
    fertilizerSchedule: tr?.fertilizerSchedule ?? ci.fertilizerSchedule,
    repottingFrequency: tr?.repottingFrequency ?? ci.repottingFrequency,
    pruningNotes: tr?.pruningNotes ?? ci.pruningNotes,
    commonProblems: tr?.commonProblems ?? ci.commonProblems,
    seasonalCare: tr?.seasonalCare ?? ci.seasonalCare,
  };
}

export function usePlantOverviewData(plant: Accessor<PlantDetail | undefined>) {
  const { t, locale } = useI18n();

  const knownPlantTags = createMemo(() => {
    const p = plant();
    if (!p?.plantDetails?.tags?.length) return [];
    const loc = locale();
    return p.plantDetails.tags.map((tag) => ({
      id: tag.id,
      name:
        translationFor(tag.translations, loc)?.name
        ?? translationFor(tag.translations, "en")?.name
        ?? tag.slug,
    }));
  });

  const enTranslation = createMemo(() => translationFor(plant()?.translations, "en"));
  const bnTranslation = createMemo(() => translationFor(plant()?.translations, "bn"));

  const plantDetailsEn = createMemo(() =>
    translationFor(plant()?.plantDetails?.translations, "en"),
  );
  const plantDetailsBn = createMemo(() =>
    translationFor(plant()?.plantDetails?.translations, "bn"),
  );

  const categoryEn = createMemo(() =>
    translationFor(plant()?.plantDetails?.category?.translations, "en")?.name ?? "—",
  );
  const categoryBn = createMemo(() =>
    translationFor(plant()?.plantDetails?.category?.translations, "bn")?.name ?? "—",
  );

  const totalStock = createMemo(() =>
    (plant()?.variants ?? []).reduce((sum, v) => sum + v.inventoryCount, 0),
  );

  const inventoryStatus = createMemo(() =>
    getInventoryStatus(totalStock(), t as (key: string, ...args: unknown[]) => string),
  );

  const priceRange = createMemo(() => {
    const variants = plant()?.variants ?? [];
    if (variants.length === 0) return "—";
    const prices = variants.map((v) => parseFloat(v.price));
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    return min === max ? formatPrice(min) : `${formatPrice(min)} - ${formatPrice(max)}`;
  });

  const careInstructions = createMemo(() => plant()?.careInstructions);

  const careEn = createMemo((): CareInstructionContent | null => {
    const ci = careInstructions();
    if (!ci) return null;
    return careContent(ci, "en");
  });

  const careBn = createMemo((): CareInstructionContent | null => {
    const ci = careInstructions();
    if (!ci) return null;
    return careContent(ci, "bn");
  });

  return {
    knownPlantTags,
    enTranslation,
    bnTranslation,
    plantDetailsEn,
    plantDetailsBn,
    categoryEn,
    categoryBn,
    totalStock,
    inventoryStatus,
    priceRange,
    careEn,
    careBn,
    scientificName: () => plant()?.plantDetails?.scientificName ?? "—",
    enName: () => enTranslation()?.name ?? "",
    bnDescription: () => bnTranslation()?.description ?? "",
    enShortDescription: () =>
      enTranslation()?.shortDescription ?? enTranslation()?.description ?? "",
  };
}
