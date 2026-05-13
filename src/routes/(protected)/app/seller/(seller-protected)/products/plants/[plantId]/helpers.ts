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

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getStatusVariant(status: ProductStatus): "forest" | "sage" | "cream" | "terracotta" | "default" {
  switch (status) {
    case PRODUCT_STATUS.ACTIVE: return "forest";
    case PRODUCT_STATUS.DRAFT: return "cream";
    case PRODUCT_STATUS.ARCHIVED: return "terracotta";
    default: return "default";
  }
}

export function getStatusLabel(status: ProductStatus): string {
  const labels: Record<ProductStatus, string> = {
    [PRODUCT_STATUS.ACTIVE]: "Active",
    [PRODUCT_STATUS.DRAFT]: "Draft",
    [PRODUCT_STATUS.ARCHIVED]: "Archived",
  };
  return labels[status];
}

export function getInventoryStatus(count: number): { label: string; variant: "forest" | "cream" | "terracotta" } {
  if (count === 0) return { label: "Out of Stock", variant: "terracotta" };
  if (count <= 5) return { label: "Low Stock", variant: "cream" };
  return { label: `${count} in stock`, variant: "forest" };
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

export function getLightLabel(value: LightRequirement): string {
  const labels: Record<LightRequirement, string> = {
    [LIGHT_REQUIREMENT.LOW]: "Low Light",
    [LIGHT_REQUIREMENT.MEDIUM]: "Medium Light",
    [LIGHT_REQUIREMENT.BRIGHT_INDIRECT]: "Bright Indirect",
    [LIGHT_REQUIREMENT.DIRECT]: "Direct Sunlight",
  };
  return labels[value];
}

export function getWateringLabel(value: WateringFrequency): string {
  const labels: Record<WateringFrequency, string> = {
    [WATERING_FREQUENCY.DAILY]: "Daily",
    [WATERING_FREQUENCY.WEEKLY]: "Weekly",
    [WATERING_FREQUENCY.BI_WEEKLY]: "Bi-weekly",
    [WATERING_FREQUENCY.MONTHLY]: "Monthly",
  };
  return labels[value];
}

export function getHumidityLabel(value: HumidityLevel): string {
  const labels: Record<HumidityLevel, string> = {
    [HUMIDITY_LEVEL.LOW]: "Low (30-40%)",
    [HUMIDITY_LEVEL.MEDIUM]: "Medium (40-60%)",
    [HUMIDITY_LEVEL.HIGH]: "High (60%+)",
  };
  return labels[value];
}

export function getDifficultyLabel(value: CareDifficulty): string {
  const labels: Record<CareDifficulty, string> = {
    [CARE_DIFFICULTY.BEGINNER]: "Beginner",
    [CARE_DIFFICULTY.INTERMEDIATE]: "Intermediate",
    [CARE_DIFFICULTY.EXPERT]: "Expert",
  };
  return labels[value];
}

export function getGrowthRateLabel(value: GrowthRate): string {
  const labels: Record<GrowthRate, string> = {
    [GROWTH_RATE.SLOW]: "Slow",
    [GROWTH_RATE.MODERATE]: "Moderate",
    [GROWTH_RATE.FAST]: "Fast",
  };
  return labels[value];
}

export function getGrowthStageLabel(value: GrowthStage): string {
  const labels: Record<GrowthStage, string> = {
    [GROWTH_STAGE.SEEDLING]: "Seedling",
    [GROWTH_STAGE.JUVENILE]: "Juvenile",
    [GROWTH_STAGE.MATURE]: "Mature",
    [GROWTH_STAGE.CUTTING]: "Cutting",
  };
  return labels[value];
}

export function getPlantFormLabel(value: PlantForm): string {
  const labels: Record<PlantForm, string> = {
    [PLANT_FORM.UPRIGHT]: "Upright",
    [PLANT_FORM.TRAILING]: "Trailing",
    [PLANT_FORM.BUSHY]: "Bushy",
    [PLANT_FORM.CLIMBING]: "Climbing",
    [PLANT_FORM.ROSETTE]: "Rosette",
  };
  return labels[value];
}

export function getVariegationLabel(value: Variegation): string {
  const labels: Record<Variegation, string> = {
    [VARIEGATION.NONE]: "None",
    [VARIEGATION.VARIEGATED]: "Variegated",
    [VARIEGATION.SEMI_VARIEGATED]: "Semi-Variegated",
    [VARIEGATION.ALBO]: "Albo (White)",
    [VARIEGATION.AUREO]: "Aureo (Yellow)",
  };
  return labels[value];
}

export function getLeafDensityLabel(value: LeafDensity): string {
  const labels: Record<LeafDensity, string> = {
    [LEAF_DENSITY.SPARSE]: "Sparse",
    [LEAF_DENSITY.MODERATE]: "Moderate",
    [LEAF_DENSITY.DENSE]: "Dense",
  };
  return labels[value];
}

export function getPropagationLabel(value: PropagationType): string {
  const labels: Record<PropagationType, string> = {
    [PROPAGATION_TYPE.CUTTING]: "Cutting",
    [PROPAGATION_TYPE.SEED]: "Seed",
    [PROPAGATION_TYPE.TISSUE_CULTURE]: "Tissue Culture",
    [PROPAGATION_TYPE.AIR_LAYER]: "Air Layer",
    [PROPAGATION_TYPE.DIVISION]: "Division",
  };
  return labels[value];
}

export function getContainerTypeLabel(value: ContainerType): string {
  const labels: Record<ContainerType, string> = {
    [CONTAINER_TYPE.NURSERY_POT]: "Nursery Pot",
    [CONTAINER_TYPE.DECORATIVE_POT]: "Decorative Pot",
    [CONTAINER_TYPE.HANGING_BASKET]: "Hanging Basket",
    [CONTAINER_TYPE.TERRARIUM]: "Terrarium",
    [CONTAINER_TYPE.GROW_BAG]: "Grow Bag",
  };
  return labels[value];
}
