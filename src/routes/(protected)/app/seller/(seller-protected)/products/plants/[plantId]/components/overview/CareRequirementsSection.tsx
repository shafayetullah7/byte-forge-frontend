import { Show } from "solid-js";
import {
  SunIcon,
  DropletIcon,
  CloudIcon,
  ThermometerIcon,
  SparklesIcon,
  SproutIcon,
} from "~/components/icons";
import { useI18n } from "~/i18n";
import type {
  CareDifficulty,
  GrowthRate,
  HumidityLevel,
  LightRequirement,
  PlantDetail,
  WateringFrequency,
} from "~/lib/api/types/seller.types";
import type { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import type { CareInstructionKey } from "../care-instruction-config";
import type { CareInstructionContent } from "../../hooks/usePlantOverviewData";
import {
  getDifficultyColor,
  getDifficultyLabel,
  getGrowthRateLabel,
  getHumidityColor,
  getHumidityLabel,
  getLightColor,
  getLightLabel,
  getWateringColor,
  getWateringLabel,
} from "../../utils";
import { CareCard } from "../CareCard";
import { PlantEditableSection } from "../PlantEditableSection";

type SectionEdit = ReturnType<typeof usePlantSectionEdit>;

function careInstructionSnippet(
  careEn: CareInstructionContent | null | undefined,
  careBn: CareInstructionContent | null | undefined,
  field: CareInstructionKey,
  locale: "en" | "bn",
): string {
  const primary = locale === "bn" ? careBn?.[field] : careEn?.[field];
  const fallback = locale === "bn" ? careEn?.[field] : careBn?.[field];
  return (primary || fallback || "").trim();
}

export function CareRequirementsSection(props: {
  plant: PlantDetail;
  sectionEdit: SectionEdit;
  plantDetails: NonNullable<PlantDetail["plantDetails"]>;
  careEn: () => CareInstructionContent | null;
  careBn: () => CareInstructionContent | null;
}) {
  const { t, locale } = useI18n();
  const pd = () => props.plantDetails;
  const loc = () => locale() as "en" | "bn";

  return (
    <PlantEditableSection
      sectionId="careProfile"
      title={t("seller.products.plantOverview.careRequirements")}
      icon={<CloudIcon class="w-4 h-4 text-gray-400" />}
      plantId={props.plant.id}
      sectionEdit={props.sectionEdit}
      view={
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Show when={pd().lightRequirement}>
            {(light) => (
              <CareCard
                icon={<SunIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />}
                titleEn={t("seller.products.plantOverview.light")}
                titleBn={t("seller.products.plantOverview.lightBn")}
                badge={{
                  text: getLightLabel(light() as LightRequirement, t),
                  ...getLightColor(light() as LightRequirement),
                }}
                description={careInstructionSnippet(
                  props.careEn(),
                  props.careBn(),
                  "lightInstructions",
                  loc(),
                )}
              />
            )}
          </Show>
          <Show when={pd().wateringFrequency}>
            {(watering) => (
              <CareCard
                icon={<DropletIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />}
                titleEn={t("seller.products.plantOverview.watering")}
                titleBn={t("seller.products.plantOverview.wateringBn")}
                badge={{
                  text: getWateringLabel(watering() as WateringFrequency, t),
                  ...getWateringColor(watering() as WateringFrequency),
                }}
                description={careInstructionSnippet(
                  props.careEn(),
                  props.careBn(),
                  "wateringInstructions",
                  loc(),
                )}
              />
            )}
          </Show>
          <Show when={pd().humidityLevel}>
            {(humidity) => (
              <CareCard
                icon={<CloudIcon class="w-5 h-5 text-sky-600 dark:text-sky-400" />}
                titleEn={t("seller.products.plantOverview.humidity")}
                titleBn={t("seller.products.plantOverview.humidityBn")}
                badge={{
                  text: getHumidityLabel(humidity() as HumidityLevel, t),
                  ...getHumidityColor(humidity() as HumidityLevel),
                }}
                description={careInstructionSnippet(
                  props.careEn(),
                  props.careBn(),
                  "humidityInstructions",
                  loc(),
                )}
              />
            )}
          </Show>
          <Show when={pd().temperatureRange}>
            {(temp) => (
              <CareCard
                icon={<ThermometerIcon class="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                titleEn={t("seller.products.plantOverview.temperature")}
                titleBn={t("seller.products.plantOverview.temperatureBn")}
                badge={{
                  text: temp(),
                  bg: "bg-amber-100 dark:bg-amber-900/40",
                  textColor: "text-amber-800 dark:text-amber-300",
                }}
              />
            )}
          </Show>
          <Show when={pd().careDifficulty}>
            {(difficulty) => (
              <CareCard
                icon={<SparklesIcon class="w-5 h-5 text-cream-600 dark:text-cream-400" />}
                titleEn={t("seller.products.plantOverview.careDifficulty")}
                titleBn={t("seller.products.plantOverview.careDifficultyBn")}
                badge={{
                  text: getDifficultyLabel(difficulty() as CareDifficulty, t),
                  ...getDifficultyColor(difficulty() as CareDifficulty),
                }}
              />
            )}
          </Show>
          <Show when={pd().growthRate}>
            {(growth) => (
              <CareCard
                icon={<SproutIcon class="w-5 h-5 text-sage-600 dark:text-sage-400" />}
                titleEn={t("seller.products.plantOverview.growthRate")}
                titleBn={t("seller.products.plantOverview.growthRateBn")}
                badge={{
                  text: getGrowthRateLabel(growth() as GrowthRate, t),
                  bg: "bg-sage-100 dark:bg-sage-900/40",
                  textColor: "text-sage-700 dark:text-sage-300",
                }}
              />
            )}
          </Show>
        </div>
      }
    />
  );
}
