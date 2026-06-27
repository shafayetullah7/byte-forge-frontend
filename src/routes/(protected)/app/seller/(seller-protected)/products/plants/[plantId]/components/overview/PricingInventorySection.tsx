import { A } from "@solidjs/router";
import { DollarSignIcon } from "~/components/icons";
import Badge from "~/components/ui/Badge";
import { useI18n } from "~/i18n";
import type { PlantDetail } from "~/lib/api/types/seller.types";
import { SectionCard } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/SectionCard";

export function PricingInventorySection(props: {
  plant: PlantDetail;
  priceRange: string;
  totalStock: number;
  inventoryLabel: string;
  inventoryVariant: "forest" | "cream" | "terracotta";
}) {
  const { t } = useI18n();

  return (
    <SectionCard
      title={t("seller.products.plantOverview.pricingInventory")}
      icon={<DollarSignIcon class="w-4 h-4 text-gray-400" />}
    >
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.priceRange")}</p>
          <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">{props.priceRange}</p>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.totalInventory")}</p>
          <div class="flex items-center gap-2 mt-1">
            <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">{props.totalStock}</p>
            <Badge variant={props.inventoryVariant} class="text-xs">
              {props.inventoryLabel}
            </Badge>
          </div>
        </div>
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{t("seller.products.plantOverview.variants")}</p>
          <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
            {props.plant.variants?.length ?? 0}
          </p>
        </div>
      </div>
      <A
        href={`/app/seller/products/plants/${props.plant.id}/inventory`}
        class="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-forest-600 dark:text-forest-400 hover:underline"
      >
        {t("seller.products.plantOverview.manageInventory")}
      </A>
    </SectionCard>
  );
}
