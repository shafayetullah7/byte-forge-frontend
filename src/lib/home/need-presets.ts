import type { PublicPlantFilter } from "~/lib/api/types/public/plants.types";
import { HOME_BUDGET_MAX_PRICE_BDT } from "~/lib/home/discovery-presets";

export type NeedPresetIconId =
  | "sparkles"
  | "leaf"
  | "sun"
  | "sprout"
  | "dollar";

export type ShopByNeedPreset = {
  id: string;
  labelKey: string;
  descriptionKey: string;
  icon: NeedPresetIconId;
  filter: Partial<PublicPlantFilter>;
};

/** Use-case cards on home → `/plants?…` (P-063). */
export const SHOP_BY_NEED_PRESETS: ShopByNeedPreset[] = [
  {
    id: "gifting",
    labelKey: "landing.shopByNeed.presets.gifting.title",
    descriptionKey: "landing.shopByNeed.presets.gifting.description",
    icon: "sparkles",
    filter: { careDifficulty: "BEGINNER", inStockOnly: true },
  },
  {
    id: "lowMaintenance",
    labelKey: "landing.shopByNeed.presets.lowMaintenance.title",
    descriptionKey: "landing.shopByNeed.presets.lowMaintenance.description",
    icon: "leaf",
    filter: { careDifficulty: "BEGINNER", lightRequirement: "LOW" },
  },
  {
    id: "brightLight",
    labelKey: "landing.shopByNeed.presets.brightLight.title",
    descriptionKey: "landing.shopByNeed.presets.brightLight.description",
    icon: "sun",
    filter: { lightRequirement: "DIRECT", inStockOnly: true },
  },
  {
    id: "indoorCorners",
    labelKey: "landing.shopByNeed.presets.indoorCorners.title",
    descriptionKey: "landing.shopByNeed.presets.indoorCorners.description",
    icon: "sprout",
    filter: { lightRequirement: "BRIGHT_INDIRECT", inStockOnly: true },
  },
  {
    id: "budgetStarter",
    labelKey: "landing.shopByNeed.presets.budgetStarter.title",
    descriptionKey: "landing.shopByNeed.presets.budgetStarter.description",
    icon: "dollar",
    filter: {
      maxPrice: HOME_BUDGET_MAX_PRICE_BDT,
      inStockOnly: true,
    },
  },
];
