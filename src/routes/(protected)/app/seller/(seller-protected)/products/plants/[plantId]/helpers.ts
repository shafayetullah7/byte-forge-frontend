const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function getStatusVariant(status: string): "forest" | "sage" | "cream" | "terracotta" | "default" {
  switch (status) {
    case "ACTIVE": return "forest";
    case "DRAFT": return "cream";
    case "ARCHIVED": return "terracotta";
    default: return "default";
  }
}

export function getInventoryStatus(count: number): { label: string; variant: "forest" | "cream" | "terracotta" } {
  if (count === 0) return { label: "Out of Stock", variant: "terracotta" };
  if (count <= 5) return { label: "Low Stock", variant: "cream" };
  return { label: `${count} in stock`, variant: "forest" };
}

export function formatPrice(price: string | number | null | undefined): string {
  if (!price) return "—";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `৳${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

export function getLightLabel(value: string): string {
  const labels: Record<string, string> = {
    LOW: "Low Light",
    MEDIUM: "Medium Light",
    BRIGHT_INDIRECT: "Bright Indirect",
    DIRECT: "Direct Sunlight",
  };
  return labels[value] || value;
}

export function getWateringLabel(value: string): string {
  const labels: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    BI_WEEKLY: "Bi-weekly",
    MONTHLY: "Monthly",
  };
  return labels[value] || value;
}

export function getHumidityLabel(value: string): string {
  const labels: Record<string, string> = {
    LOW: "Low (30-40%)",
    MEDIUM: "Medium (40-60%)",
    HIGH: "High (60%+)",
  };
  return labels[value] || value;
}

export function getDifficultyLabel(value: string): string {
  const labels: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    EXPERT: "Expert",
  };
  return labels[value] || value;
}

export function getGrowthRateLabel(value: string): string {
  const labels: Record<string, string> = {
    SLOW: "Slow",
    MODERATE: "Moderate",
    FAST: "Fast",
  };
  return labels[value] || value;
}

export function getGrowthStageLabel(value: string): string {
  const labels: Record<string, string> = {
    SEEDLING: "Seedling",
    JUVENILE: "Juvenile",
    MATURE: "Mature",
    CUTTING: "Cutting",
  };
  return labels[value] || value;
}

export function getPlantFormLabel(value: string): string {
  const labels: Record<string, string> = {
    UPRIGHT: "Upright",
    TRAILING: "Trailing",
    BUSHY: "Bushy",
    CLIMBING: "Climbing",
    ROSETTE: "Rosette",
  };
  return labels[value] || value;
}

export function getVariegationLabel(value: string): string {
  const labels: Record<string, string> = {
    NONE: "None",
    VARIEGATED: "Variegated",
    SEMI_VARIEGATED: "Semi-Variegated",
    ALBO: "Albo (White)",
    AUREO: "Aureo (Yellow)",
  };
  return labels[value] || value;
}

export function getLeafDensityLabel(value: string): string {
  const labels: Record<string, string> = {
    SPARSE: "Sparse",
    MODERATE: "Moderate",
    DENSE: "Dense",
  };
  return labels[value] || value;
}

export function getPropagationLabel(value: string): string {
  const labels: Record<string, string> = {
    CUTTING: "Cutting",
    SEED: "Seed",
    TISSUE_CULTURE: "Tissue Culture",
    AIR_LAYER: "Air Layer",
    DIVISION: "Division",
  };
  return labels[value] || value;
}

export function getContainerTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    NURSERY_POT: "Nursery Pot",
    DECORATIVE_POT: "Decorative Pot",
    HANGING_BASKET: "Hanging Basket",
    TERRARIUM: "Terrarium",
    GROW_BAG: "Grow Bag",
  };
  return labels[value] || value;
}
