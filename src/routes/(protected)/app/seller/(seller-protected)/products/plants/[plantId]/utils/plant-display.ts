import {
  PRODUCT_STATUS,
  LIGHT_REQUIREMENT,
  WATERING_FREQUENCY,
  HUMIDITY_LEVEL,
  CARE_DIFFICULTY,
  GROWTH_RATE,
  GROWTH_STAGE,
  PLANT_FORM,
  VARIEGATION,
  LEAF_DENSITY,
  PROPAGATION_TYPE,
  CONTAINER_TYPE,
  type ProductStatus,
  type LightRequirement,
  type WateringFrequency,
  type HumidityLevel,
  type CareDifficulty,
  type GrowthRate,
  type GrowthStage,
  type PlantForm,
  type Variegation,
  type LeafDensity,
  type PropagationType,
  type ContainerType,
} from "~/lib/api/types/seller.types";
import type { Translator } from "~/i18n";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const STATUS_KEYS: Record<ProductStatus, string> = {
  [PRODUCT_STATUS.ACTIVE]: "seller.products.statusLabels.active",
  [PRODUCT_STATUS.DRAFT]: "seller.products.statusLabels.draft",
  [PRODUCT_STATUS.ARCHIVED]: "seller.products.statusLabels.archived",
};

const LIGHT_KEYS: Record<LightRequirement, string> = {
  [LIGHT_REQUIREMENT.LOW]: "seller.products.newPlant.lightLow",
  [LIGHT_REQUIREMENT.MEDIUM]: "seller.products.newPlant.lightMedium",
  [LIGHT_REQUIREMENT.BRIGHT_INDIRECT]: "seller.products.newPlant.lightBrightIndirect",
  [LIGHT_REQUIREMENT.DIRECT]: "seller.products.newPlant.lightDirect",
};

const WATERING_KEYS: Record<WateringFrequency, string> = {
  [WATERING_FREQUENCY.DAILY]: "seller.products.newPlant.wateringDaily",
  [WATERING_FREQUENCY.WEEKLY]: "seller.products.newPlant.wateringWeekly",
  [WATERING_FREQUENCY.BI_WEEKLY]: "seller.products.newPlant.wateringBiWeekly",
  [WATERING_FREQUENCY.MONTHLY]: "seller.products.newPlant.wateringMonthly",
};

const HUMIDITY_KEYS: Record<HumidityLevel, string> = {
  [HUMIDITY_LEVEL.LOW]: "seller.products.newPlant.humidityLow",
  [HUMIDITY_LEVEL.MEDIUM]: "seller.products.newPlant.humidityMedium",
  [HUMIDITY_LEVEL.HIGH]: "seller.products.newPlant.humidityHigh",
};

const DIFFICULTY_KEYS: Record<CareDifficulty, string> = {
  [CARE_DIFFICULTY.BEGINNER]: "seller.products.newPlant.careBeginner",
  [CARE_DIFFICULTY.INTERMEDIATE]: "seller.products.newPlant.careIntermediate",
  [CARE_DIFFICULTY.EXPERT]: "seller.products.newPlant.careExpert",
};

const GROWTH_RATE_KEYS: Record<GrowthRate, string> = {
  [GROWTH_RATE.SLOW]: "seller.products.newPlant.growthSlow",
  [GROWTH_RATE.MODERATE]: "seller.products.newPlant.growthModerate",
  [GROWTH_RATE.FAST]: "seller.products.newPlant.growthFast",
};

const GROWTH_STAGE_KEYS: Record<GrowthStage, string> = {
  [GROWTH_STAGE.SEEDLING]: "seller.products.newPlant.stageSeedling",
  [GROWTH_STAGE.JUVENILE]: "seller.products.newPlant.stageJuvenile",
  [GROWTH_STAGE.MATURE]: "seller.products.newPlant.stageMature",
  [GROWTH_STAGE.CUTTING]: "seller.products.newPlant.stageCutting",
};

const PLANT_FORM_KEYS: Record<PlantForm, string> = {
  [PLANT_FORM.UPRIGHT]: "seller.products.newPlant.formUpright",
  [PLANT_FORM.TRAILING]: "seller.products.newPlant.formTrailing",
  [PLANT_FORM.BUSHY]: "seller.products.newPlant.formBushy",
  [PLANT_FORM.CLIMBING]: "seller.products.newPlant.formClimbing",
  [PLANT_FORM.ROSETTE]: "seller.products.newPlant.formRosette",
};

const VARIEGATION_KEYS: Record<Variegation, string> = {
  [VARIEGATION.NONE]: "seller.products.newPlant.varNone",
  [VARIEGATION.VARIEGATED]: "seller.products.newPlant.varVariegated",
  [VARIEGATION.SEMI_VARIEGATED]: "seller.products.newPlant.varSemiVariegated",
  [VARIEGATION.ALBO]: "seller.products.newPlant.varAlbo",
  [VARIEGATION.AUREO]: "seller.products.newPlant.varAureo",
};

const LEAF_DENSITY_KEYS: Record<LeafDensity, string> = {
  [LEAF_DENSITY.SPARSE]: "seller.products.newPlant.densitySparse",
  [LEAF_DENSITY.MODERATE]: "seller.products.newPlant.densityModerate",
  [LEAF_DENSITY.DENSE]: "seller.products.newPlant.densityDense",
};

const PROPAGATION_KEYS: Record<PropagationType, string> = {
  [PROPAGATION_TYPE.CUTTING]: "seller.products.newPlant.propCutting",
  [PROPAGATION_TYPE.SEED]: "seller.products.newPlant.propSeed",
  [PROPAGATION_TYPE.TISSUE_CULTURE]: "seller.products.newPlant.propTissueCulture",
  [PROPAGATION_TYPE.AIR_LAYER]: "seller.products.newPlant.propAirLayer",
  [PROPAGATION_TYPE.DIVISION]: "seller.products.newPlant.propDivision",
};

const CONTAINER_TYPE_KEYS: Record<ContainerType, string> = {
  [CONTAINER_TYPE.NURSERY_POT]: "seller.products.newPlant.contNurseryPot",
  [CONTAINER_TYPE.DECORATIVE_POT]: "seller.products.newPlant.contDecorativePot",
  [CONTAINER_TYPE.HANGING_BASKET]: "seller.products.newPlant.contHangingBasket",
  [CONTAINER_TYPE.TERRARIUM]: "seller.products.newPlant.contTerrarium",
  [CONTAINER_TYPE.GROW_BAG]: "seller.products.newPlant.contGrowBag",
};

function enumLabel<T extends string>(
  value: T,
  keys: Record<T, string>,
  fallbacks: Record<T, string>,
  t?: Translator,
): string {
  if (t) return t(keys[value]);
  return fallbacks[value];
}

export function getStatusVariant(status: ProductStatus): "forest" | "sage" | "cream" | "terracotta" | "default" {
  switch (status) {
    case PRODUCT_STATUS.ACTIVE: return "forest";
    case PRODUCT_STATUS.DRAFT: return "cream";
    case PRODUCT_STATUS.ARCHIVED: return "terracotta";
    default: return "default";
  }
}

export function getStatusLabel(status: ProductStatus, t?: Translator): string {
  return enumLabel(status, STATUS_KEYS, {
    [PRODUCT_STATUS.ACTIVE]: "Active",
    [PRODUCT_STATUS.DRAFT]: "Draft",
    [PRODUCT_STATUS.ARCHIVED]: "Archived",
  }, t);
}

export function getInventoryStatus(count: number, t?: Translator): { label: string; variant: "forest" | "cream" | "terracotta" } {
  if (count === 0) return { label: t ? t("seller.products.inventory.outOfStock") : "Out of Stock", variant: "terracotta" };
  if (count <= 5) return { label: t ? t("seller.products.inventory.left", count) : "Low Stock", variant: "cream" };
  return { label: t ? t("seller.products.inventory.inStock", count) : `${count} in stock`, variant: "forest" };
}

export function formatPrice(price: string | number | null | undefined): string {
  if (!price) return "\u2014";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `\u09f3${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const month = MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minStr = minutes.toString().padStart(2, "0");
  return `${month} ${day}, ${year}, ${hours}:${minStr} ${ampm}`;
}

export function getOrderStatusVariant(status: string): "forest" | "sage" | "cream" | "terracotta" | "default" {
  switch (status) {
    case "DELIVERED": return "forest";
    case "SHIPPED": return "sage";
    case "PROCESSING": return "cream";
    case "CANCELLED": return "terracotta";
    default: return "default";
  }
}

export function getLightLabel(value: LightRequirement, t?: Translator): string {
  return enumLabel(value, LIGHT_KEYS, {
    [LIGHT_REQUIREMENT.LOW]: "Low Light",
    [LIGHT_REQUIREMENT.MEDIUM]: "Medium Light",
    [LIGHT_REQUIREMENT.BRIGHT_INDIRECT]: "Bright Indirect",
    [LIGHT_REQUIREMENT.DIRECT]: "Direct Sunlight",
  }, t);
}

export function getLightColor(value: LightRequirement): { bg: string; textColor: string } {
  const colors: Record<LightRequirement, { bg: string; textColor: string }> = {
    [LIGHT_REQUIREMENT.LOW]: { bg: "bg-sage-100 dark:bg-sage-900/40", textColor: "text-sage-700 dark:text-sage-300" },
    [LIGHT_REQUIREMENT.MEDIUM]: { bg: "bg-cream-100 dark:bg-cream-900/40", textColor: "text-cream-700 dark:text-cream-300" },
    [LIGHT_REQUIREMENT.BRIGHT_INDIRECT]: { bg: "bg-forest-100 dark:bg-forest-900/40", textColor: "text-forest-700 dark:text-forest-300" },
    [LIGHT_REQUIREMENT.DIRECT]: { bg: "bg-terracotta-100 dark:bg-terracotta-900/40", textColor: "text-terracotta-700 dark:text-terracotta-300" },
  };
  return colors[value];
}

export function getWateringLabel(value: WateringFrequency, t?: Translator): string {
  return enumLabel(value, WATERING_KEYS, {
    [WATERING_FREQUENCY.DAILY]: "Daily",
    [WATERING_FREQUENCY.WEEKLY]: "Weekly",
    [WATERING_FREQUENCY.BI_WEEKLY]: "Bi-weekly",
    [WATERING_FREQUENCY.MONTHLY]: "Monthly",
  }, t);
}

export function getWateringColor(value: WateringFrequency): { bg: string; textColor: string } {
  const colors: Record<WateringFrequency, { bg: string; textColor: string }> = {
    [WATERING_FREQUENCY.DAILY]: { bg: "bg-blue-100 dark:bg-blue-900/40", textColor: "text-blue-700 dark:text-blue-300" },
    [WATERING_FREQUENCY.WEEKLY]: { bg: "bg-sky-100 dark:bg-sky-900/40", textColor: "text-sky-700 dark:text-sky-300" },
    [WATERING_FREQUENCY.BI_WEEKLY]: { bg: "bg-cream-100 dark:bg-cream-900/40", textColor: "text-cream-700 dark:text-cream-300" },
    [WATERING_FREQUENCY.MONTHLY]: { bg: "bg-sage-100 dark:bg-sage-900/40", textColor: "text-sage-700 dark:text-sage-300" },
  };
  return colors[value];
}

export function getHumidityLabel(value: HumidityLevel, t?: Translator): string {
  return enumLabel(value, HUMIDITY_KEYS, {
    [HUMIDITY_LEVEL.LOW]: "Low (30-40%)",
    [HUMIDITY_LEVEL.MEDIUM]: "Medium (40-60%)",
    [HUMIDITY_LEVEL.HIGH]: "High (60%+)",
  }, t);
}

export function getHumidityColor(value: HumidityLevel): { bg: string; textColor: string } {
  const colors: Record<HumidityLevel, { bg: string; textColor: string }> = {
    [HUMIDITY_LEVEL.LOW]: { bg: "bg-cream-100 dark:bg-cream-900/40", textColor: "text-cream-700 dark:text-cream-300" },
    [HUMIDITY_LEVEL.MEDIUM]: { bg: "bg-forest-100 dark:bg-forest-900/40", textColor: "text-forest-700 dark:text-forest-300" },
    [HUMIDITY_LEVEL.HIGH]: { bg: "bg-sky-100 dark:bg-sky-900/40", textColor: "text-sky-700 dark:text-sky-300" },
  };
  return colors[value];
}

export function getDifficultyLabel(value: CareDifficulty, t?: Translator): string {
  return enumLabel(value, DIFFICULTY_KEYS, {
    [CARE_DIFFICULTY.BEGINNER]: "Beginner",
    [CARE_DIFFICULTY.INTERMEDIATE]: "Intermediate",
    [CARE_DIFFICULTY.EXPERT]: "Expert",
  }, t);
}

export function getDifficultyColor(value: CareDifficulty): { bg: string; textColor: string } {
  const colors: Record<CareDifficulty, { bg: string; textColor: string }> = {
    [CARE_DIFFICULTY.BEGINNER]: { bg: "bg-forest-100 dark:bg-forest-900/40", textColor: "text-forest-700 dark:text-forest-300" },
    [CARE_DIFFICULTY.INTERMEDIATE]: { bg: "bg-cream-100 dark:bg-cream-900/40", textColor: "text-cream-700 dark:text-cream-300" },
    [CARE_DIFFICULTY.EXPERT]: { bg: "bg-terracotta-100 dark:bg-terracotta-900/40", textColor: "text-terracotta-700 dark:text-terracotta-300" },
  };
  return colors[value];
}

export function getGrowthRateLabel(value: GrowthRate, t?: Translator): string {
  return enumLabel(value, GROWTH_RATE_KEYS, {
    [GROWTH_RATE.SLOW]: "Slow",
    [GROWTH_RATE.MODERATE]: "Moderate",
    [GROWTH_RATE.FAST]: "Fast",
  }, t);
}

export function getGrowthStageLabel(value: GrowthStage, t?: Translator): string {
  return enumLabel(value, GROWTH_STAGE_KEYS, {
    [GROWTH_STAGE.SEEDLING]: "Seedling",
    [GROWTH_STAGE.JUVENILE]: "Juvenile",
    [GROWTH_STAGE.MATURE]: "Mature",
    [GROWTH_STAGE.CUTTING]: "Cutting",
  }, t);
}

export function getPlantFormLabel(value: PlantForm, t?: Translator): string {
  return enumLabel(value, PLANT_FORM_KEYS, {
    [PLANT_FORM.UPRIGHT]: "Upright",
    [PLANT_FORM.TRAILING]: "Trailing",
    [PLANT_FORM.BUSHY]: "Bushy",
    [PLANT_FORM.CLIMBING]: "Climbing",
    [PLANT_FORM.ROSETTE]: "Rosette",
  }, t);
}

export function getVariegationLabel(value: Variegation, t?: Translator): string {
  return enumLabel(value, VARIEGATION_KEYS, {
    [VARIEGATION.NONE]: "None",
    [VARIEGATION.VARIEGATED]: "Variegated",
    [VARIEGATION.SEMI_VARIEGATED]: "Semi-Variegated",
    [VARIEGATION.ALBO]: "Albo (White)",
    [VARIEGATION.AUREO]: "Aureo (Yellow)",
  }, t);
}

export function getLeafDensityLabel(value: LeafDensity, t?: Translator): string {
  return enumLabel(value, LEAF_DENSITY_KEYS, {
    [LEAF_DENSITY.SPARSE]: "Sparse",
    [LEAF_DENSITY.MODERATE]: "Moderate",
    [LEAF_DENSITY.DENSE]: "Dense",
  }, t);
}

export function getPropagationLabel(value: PropagationType, t?: Translator): string {
  return enumLabel(value, PROPAGATION_KEYS, {
    [PROPAGATION_TYPE.CUTTING]: "Cutting",
    [PROPAGATION_TYPE.SEED]: "Seed",
    [PROPAGATION_TYPE.TISSUE_CULTURE]: "Tissue Culture",
    [PROPAGATION_TYPE.AIR_LAYER]: "Air Layer",
    [PROPAGATION_TYPE.DIVISION]: "Division",
  }, t);
}

export function getContainerTypeLabel(value: ContainerType, t?: Translator): string {
  return enumLabel(value, CONTAINER_TYPE_KEYS, {
    [CONTAINER_TYPE.NURSERY_POT]: "Nursery Pot",
    [CONTAINER_TYPE.DECORATIVE_POT]: "Decorative Pot",
    [CONTAINER_TYPE.HANGING_BASKET]: "Hanging Basket",
    [CONTAINER_TYPE.TERRARIUM]: "Terrarium",
    [CONTAINER_TYPE.GROW_BAG]: "Grow Bag",
  }, t);
}
