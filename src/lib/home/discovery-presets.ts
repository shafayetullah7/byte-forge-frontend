import type { PublicPlantFilter } from "~/lib/api/types/public/plants.types";

/** Shared cap for quick-discovery budget pill and home BudgetFinds row (P-034). */
export const HOME_BUDGET_MAX_PRICE_BDT = 500;

export type DiscoveryPreset = {
  id: string;
  labelKey: string;
  filter: Partial<PublicPlantFilter>;
};

/** Purpose-based home shortcuts → `/plants?…` (P-020). */
export const DISCOVERY_PRESETS: DiscoveryPreset[] = [
  {
    id: "easyCare",
    labelKey: "landing.quickDiscovery.presets.easyCare",
    filter: { careDifficulty: "BEGINNER" },
  },
  {
    id: "lowLight",
    labelKey: "landing.quickDiscovery.presets.lowLight",
    filter: { lightRequirement: "LOW" },
  },
  {
    id: "inStock",
    labelKey: "landing.quickDiscovery.presets.inStock",
    filter: { inStockOnly: true },
  },
  {
    id: "budget",
    labelKey: "landing.quickDiscovery.presets.budget",
    filter: { maxPrice: HOME_BUDGET_MAX_PRICE_BDT },
  },
];
