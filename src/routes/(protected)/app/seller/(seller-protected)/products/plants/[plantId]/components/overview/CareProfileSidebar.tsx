import {
  SunIcon,
  DropletIcon,
  MoonIcon,
  ThermometerIcon,
  TrendingUpIcon,
  RulerIcon,
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
import {
  getDifficultyLabel,
  getGrowthRateLabel,
  getHumidityLabel,
  getLightLabel,
  getWateringLabel,
} from "../../utils";
import { DetailRow } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/DetailRow";
import { SectionCard } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/SectionCard";

export function CareProfileSidebar(props: {
  plantDetails: NonNullable<PlantDetail["plantDetails"]>;
}) {
  const { t } = useI18n();
  const pd = () => props.plantDetails;

  return (
    <SectionCard
      title={t("seller.products.plantOverview.careProfile")}
      icon={<SunIcon class="w-4 h-4 text-gray-400" />}
    >
      <DetailRow
        label={t("seller.products.plantOverview.light")}
        value={pd().lightRequirement ? getLightLabel(pd().lightRequirement as LightRequirement) : "—"}
        icon={() => <SunIcon class="w-4 h-4" />}
      />
      <DetailRow
        label={t("seller.products.plantOverview.watering")}
        value={pd().wateringFrequency ? getWateringLabel(pd().wateringFrequency as WateringFrequency) : "—"}
        icon={() => <DropletIcon class="w-4 h-4" />}
      />
      <DetailRow
        label={t("seller.products.plantOverview.humidity")}
        value={pd().humidityLevel ? getHumidityLabel(pd().humidityLevel as HumidityLevel) : "—"}
        icon={() => <MoonIcon class="w-4 h-4" />}
      />
      <DetailRow
        label={t("seller.products.plantOverview.temperature")}
        value={pd().temperatureRange ?? "—"}
        icon={() => <ThermometerIcon class="w-4 h-4" />}
      />
      <DetailRow
        label={t("seller.products.plantOverview.difficulty")}
        value={pd().careDifficulty ? getDifficultyLabel(pd().careDifficulty as CareDifficulty) : "—"}
        icon={() => <TrendingUpIcon class="w-4 h-4" />}
      />
      <DetailRow
        label={t("seller.products.plantOverview.growthRate")}
        value={pd().growthRate ? getGrowthRateLabel(pd().growthRate as GrowthRate) : "—"}
        icon={() => <TrendingUpIcon class="w-4 h-4" />}
      />
      <DetailRow
        label={t("seller.products.plantOverview.matureHeight")}
        value={pd().matureHeight ?? "—"}
        icon={() => <RulerIcon class="w-4 h-4" />}
      />
      <DetailRow
        label={t("seller.products.plantOverview.matureSpread")}
        value={pd().matureSpread ?? "—"}
        icon={() => <RulerIcon class="w-4 h-4" />}
      />
    </SectionCard>
  );
}
