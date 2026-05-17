export function formatPrice(price: string | number | null | undefined): string {
  if (!price) return "\u2014";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `\u09f3${num.toLocaleString("en-BD")}`;
}

export function getInventoryLabel(count: number, t: (key: string, params?: Record<string, any>) => string): string {
  if (count === 0) return t("public.plants.inventory.outOfStock");
  if (count <= 5) return t("public.plants.inventory.onlyLeft", { count });
  if (count <= 20) return t("public.plants.inventory.inStock", { count });
  return t("public.plants.inventory.inStockShort");
}

export function getDifficultyLabel(difficulty: string | null, t: (key: string) => string): string {
  if (!difficulty) return "";
  switch (difficulty) {
    case "BEGINNER": return t("public.plants.difficulty.easy");
    case "INTERMEDIATE": return t("public.plants.difficulty.medium");
    case "EXPERT": return t("public.plants.difficulty.advanced");
    default: return "";
  }
}

export function getDifficultyColor(difficulty: string | null): string {
  if (!difficulty) return "";
  switch (difficulty) {
    case "BEGINNER": return "bg-forest-500/90 text-white";
    case "INTERMEDIATE": return "bg-sage-500/90 text-white";
    case "EXPERT": return "bg-terracotta-500/90 text-white";
    default: return "";
  }
}

export function lightLabel(light: string | null, t: (key: string) => string): string {
  if (!light) return "";
  switch (light) {
    case "LOW": return t("public.plants.lightLabels.low");
    case "MEDIUM": return t("public.plants.lightLabels.medium");
    case "BRIGHT_INDIRECT": return t("public.plants.lightLabels.bright");
    case "DIRECT": return t("public.plants.lightLabels.direct");
    default: return light;
  }
}

export function wateringLabel(freq: string | null, t: (key: string) => string): string {
  if (!freq) return "";
  switch (freq) {
    case "DAILY": return t("public.plants.wateringLabels.daily");
    case "WEEKLY": return t("public.plants.wateringLabels.weekly");
    case "BI_WEEKLY": return t("public.plants.wateringLabels.biWeekly");
    case "MONTHLY": return t("public.plants.wateringLabels.monthly");
    default: return freq;
  }
}

export function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("...");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("...");
  pages.push(total);
  return pages;
}

export const CARE_OPTIONS = [
  { value: "BEGINNER", labelKey: "public.plants.careOptions.beginner" },
  { value: "INTERMEDIATE", labelKey: "public.plants.careOptions.intermediate" },
  { value: "EXPERT", labelKey: "public.plants.careOptions.expert" },
];

export const LIGHT_OPTIONS = [
  { value: "LOW", labelKey: "public.plants.lightOptions.low" },
  { value: "MEDIUM", labelKey: "public.plants.lightOptions.medium" },
  { value: "BRIGHT_INDIRECT", labelKey: "public.plants.lightOptions.brightIndirect" },
  { value: "DIRECT", labelKey: "public.plants.lightOptions.direct" },
];

export const WATERING_OPTIONS = [
  { value: "DAILY", labelKey: "public.plants.wateringOptions.daily" },
  { value: "WEEKLY", labelKey: "public.plants.wateringOptions.weekly" },
  { value: "BI_WEEKLY", labelKey: "public.plants.wateringOptions.biWeekly" },
  { value: "MONTHLY", labelKey: "public.plants.wateringOptions.monthly" },
];

export const HUMIDITY_OPTIONS = [
  { value: "LOW", labelKey: "public.plants.humidityOptions.low" },
  { value: "MEDIUM", labelKey: "public.plants.humidityOptions.medium" },
  { value: "HIGH", labelKey: "public.plants.humidityOptions.high" },
];

export const GROWTH_OPTIONS = [
  { value: "SLOW", labelKey: "public.plants.growthOptions.slow" },
  { value: "MODERATE", labelKey: "public.plants.growthOptions.moderate" },
  { value: "FAST", labelKey: "public.plants.growthOptions.fast" },
];

export const SORT_OPTIONS = [
  { value: "name", labelKey: "public.plants.sortOptions.name" },
  { value: "price", labelKey: "public.plants.sortOptions.price" },
  { value: "inventory", labelKey: "public.plants.sortOptions.inventory" },
  { value: "difficulty", labelKey: "public.plants.sortOptions.difficulty" },
  { value: "createdAt", labelKey: "public.plants.sortOptions.newest" },
];
