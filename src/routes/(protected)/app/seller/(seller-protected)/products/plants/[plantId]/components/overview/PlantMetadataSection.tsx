import { CalendarIcon, CheckBadgeIcon, ClockIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import type { PlantDetail } from "~/lib/api/types/seller.types";
import { formatDateTime } from "../../utils";
import { DetailRow } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/DetailRow";
import { SectionCard } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/SectionCard";

export function PlantMetadataSection(props: { plant: PlantDetail }) {
  const { t } = useI18n();

  return (
    <SectionCard
      title={t("seller.products.plantOverview.details")}
      icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
    >
      <DetailRow
        label={t("seller.products.plantOverview.created")}
        value={formatDateTime(props.plant.createdAt)}
        icon={() => <CalendarIcon class="w-4 h-4" />}
      />
      <DetailRow
        label={t("seller.products.plantOverview.lastUpdated")}
        value={formatDateTime(props.plant.updatedAt)}
        icon={() => <ClockIcon class="w-4 h-4" />}
      />
      <DetailRow
        label={t("seller.products.plantOverview.plantId")}
        value={props.plant.id}
        icon={() => <CheckBadgeIcon class="w-4 h-4" />}
      />
    </SectionCard>
  );
}
