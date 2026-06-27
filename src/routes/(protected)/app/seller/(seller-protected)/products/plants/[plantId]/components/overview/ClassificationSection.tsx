import {
  ChatBubbleLeftRightIcon,
  GlobeAltIcon,
  BeakerIcon,
  ExclamationCircleIcon,
  SproutIcon,
} from "~/components/icons";
import { useI18n } from "~/i18n";
import type { PlantDetail } from "~/lib/api/types/seller.types";
import type { usePlantSectionEdit } from "~/lib/plants/usePlantSectionEdit";
import { DetailRow } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/DetailRow";
import { PlantEditableSection } from "../PlantEditableSection";

type SectionEdit = ReturnType<typeof usePlantSectionEdit>;

function fieldOrDash(value: string | null | undefined) {
  return value && value.length > 0 ? value : "—";
}

export function ClassificationSection(props: {
  plant: PlantDetail;
  sectionEdit: SectionEdit;
  plantDetailsEn: () => {
    commonNames?: string | null;
    origin?: string | null;
    soilType?: string | null;
    toxicityInfo?: string | null;
  } | undefined;
  plantDetailsBn: () => {
    commonNames?: string | null;
    origin?: string | null;
    soilType?: string | null;
    toxicityInfo?: string | null;
  } | undefined;
}) {
  const { t } = useI18n();
  const en = () => props.plantDetailsEn();
  const bn = () => props.plantDetailsBn();

  return (
    <PlantEditableSection
      sectionId="classification"
      title={t("seller.products.plantOverview.classificationDetails")}
      icon={<SproutIcon class="w-4 h-4 text-gray-400" />}
      plantId={props.plant.id}
      sectionEdit={props.sectionEdit}
      view={
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <DetailRow
              label={t("seller.products.plantOverview.commonNamesEn")}
              value={fieldOrDash(en()?.commonNames)}
              icon={() => <ChatBubbleLeftRightIcon class="w-4 h-4" />}
            />
            <DetailRow
              label={t("seller.products.plantOverview.commonNamesBn")}
              value={fieldOrDash(bn()?.commonNames)}
              icon={() => <ChatBubbleLeftRightIcon class="w-4 h-4" />}
            />
            <DetailRow
              label={t("seller.products.plantOverview.originEn")}
              value={fieldOrDash(en()?.origin)}
              icon={() => <GlobeAltIcon class="w-4 h-4" />}
            />
            <DetailRow
              label={t("seller.products.plantOverview.originBn")}
              value={fieldOrDash(bn()?.origin)}
              icon={() => <GlobeAltIcon class="w-4 h-4" />}
            />
          </div>
          <div>
            <DetailRow
              label={t("seller.products.plantOverview.soilTypeEn")}
              value={fieldOrDash(en()?.soilType)}
              icon={() => <BeakerIcon class="w-4 h-4" />}
            />
            <DetailRow
              label={t("seller.products.plantOverview.soilTypeBn")}
              value={fieldOrDash(bn()?.soilType)}
              icon={() => <BeakerIcon class="w-4 h-4" />}
            />
            <DetailRow
              label={t("seller.products.plantOverview.toxicityEn")}
              value={fieldOrDash(en()?.toxicityInfo)}
              icon={() => <ExclamationCircleIcon class="w-4 h-4" />}
            />
            <DetailRow
              label={t("seller.products.plantOverview.toxicityBn")}
              value={fieldOrDash(bn()?.toxicityInfo)}
              icon={() => <ExclamationCircleIcon class="w-4 h-4" />}
            />
          </div>
        </div>
      }
    />
  );
}
