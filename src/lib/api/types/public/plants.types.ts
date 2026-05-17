/**
 * Public Plants API Types
 * Matches backend PublicPlantListItem and PublicPlantDetail response types
 */

/**
 * Care difficulty constants (matches backend CareDifficultyEnum)
 */
export const PUBLIC_CARE_DIFFICULTY = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  EXPERT: "EXPERT",
} as const;

export type PublicCareDifficulty =
  (typeof PUBLIC_CARE_DIFFICULTY)[keyof typeof PUBLIC_CARE_DIFFICULTY];

/**
 * Light requirement constants (matches backend LightRequirementEnum)
 */
export const PUBLIC_LIGHT_REQUIREMENT = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  BRIGHT_INDIRECT: "BRIGHT_INDIRECT",
  DIRECT: "DIRECT",
} as const;

export type PublicLightRequirement =
  (typeof PUBLIC_LIGHT_REQUIREMENT)[keyof typeof PUBLIC_LIGHT_REQUIREMENT];

/**
 * Watering frequency constants (matches backend WateringFrequencyEnum)
 */
export const PUBLIC_WATERING_FREQUENCY = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  BI_WEEKLY: "BI_WEEKLY",
  MONTHLY: "MONTHLY",
} as const;

export type PublicWateringFrequency =
  (typeof PUBLIC_WATERING_FREQUENCY)[keyof typeof PUBLIC_WATERING_FREQUENCY];

/**
 * Humidity level constants (matches backend HumidityLevelEnum)
 */
export const PUBLIC_HUMIDITY_LEVEL = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type PublicHumidityLevel =
  (typeof PUBLIC_HUMIDITY_LEVEL)[keyof typeof PUBLIC_HUMIDITY_LEVEL];

/**
 * Growth rate constants (matches backend GrowthRateEnum)
 */
export const PUBLIC_GROWTH_RATE = {
  SLOW: "SLOW",
  MODERATE: "MODERATE",
  FAST: "FAST",
} as const;

export type PublicGrowthRate =
  (typeof PUBLIC_GROWTH_RATE)[keyof typeof PUBLIC_GROWTH_RATE];

/**
 * Shop info embedded in plant list/detail responses
 */
export interface PublicPlantShop {
  id: string;
  slug: string;
  name: string;
  logo: { id: string; url: string } | null;
}

/**
 * Shop info embedded in plant detail response (extended)
 */
export interface PublicPlantShopDetail extends PublicPlantShop {
  isVerified: boolean;
  primaryColor: string | null;
  secondaryColor: string | null;
}

/**
 * Category info embedded in plant responses
 */
export interface PublicPlantCategory {
  id: string;
  slug: string;
  name: string | null;
}

/**
 * Tag info embedded in plant responses
 */
export interface PublicPlantTag {
  id: string;
  slug: string;
  name: string | null;
}

/**
 * Thumbnail media reference
 */
export interface PublicPlantThumbnail {
  id: string;
  url: string;
}

/**
 * Media item for plant images
 */
export interface PublicPlantMedia {
  id: string;
  url: string;
  type: string;
  displayOrder: number;
}

/**
 * Plant variant attributes (plant-specific)
 */
export interface PublicPlantVariantAttributes {
  growthStage: string;
  plantForm: string;
  variegation: string;
  leafDensity: string;
  stemCount: number;
  currentHeight: string | null;
  currentSpread: string | null;
  propagationType: string;
  containerType: string;
  containerSize: string | null;
  bundleType: string | null;
}

/**
 * Plant variant in detail response
 */
export interface PublicPlantVariant {
  id: string;
  sku: string | null;
  price: string;
  inventoryCount: number;
  inStock: boolean;
  title: string | null;
  isBase: boolean;
  isActive: boolean;
  plantAttributes: PublicPlantVariantAttributes | null;
  media: PublicPlantMedia[];
}

/**
 * Care instructions in detail response
 */
export interface PublicPlantCareInstructions {
  lightInstructions: string | null;
  wateringInstructions: string | null;
  humidityInstructions: string | null;
  fertilizerSchedule: string | null;
  repottingFrequency: string | null;
  pruningNotes: string | null;
  commonProblems: string | null;
  seasonalCare: string | null;
}

/**
 * SEO metadata in detail response
 */
export interface PublicPlantSeo {
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeywords: string | null;
}

/**
 * Plant list item (matches backend PublicPlantListItem)
 * Used in paginated list endpoint
 */
export interface PublicPlantListItem {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  scientificName: string | null;
  commonNames: string | null;
  price: string | null;
  inventoryCount: number;
  inStock: boolean;
  thumbnail: PublicPlantThumbnail | null;
  category: PublicPlantCategory | null;
  tags: PublicPlantTag[];
  careDifficulty: string | null;
  lightRequirement: string | null;
  wateringFrequency: string | null;
  humidityLevel: string | null;
  growthRate: string | null;
  shop: PublicPlantShop | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Plant detail (matches backend PublicPlantDetail)
 * Used in single plant by slug endpoint
 */
export interface PublicPlantDetail {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  shortDescription: string | null;
  scientificName: string | null;
  commonNames: string | null;
  price: string | null;
  inventoryCount: number;
  inStock: boolean;
  variants: PublicPlantVariant[];
  thumbnail: PublicPlantThumbnail | null;
  media: PublicPlantMedia[];
  category: PublicPlantCategory | null;
  tags: PublicPlantTag[];
  careDifficulty: string | null;
  lightRequirement: string | null;
  wateringFrequency: string | null;
  humidityLevel: string | null;
  temperatureRange: string | null;
  soilType: string | null;
  growthRate: string | null;
  matureHeight: string | null;
  matureSpread: string | null;
  origin: string | null;
  toxicityInfo: string | null;
  careInstructions: PublicPlantCareInstructions | null;
  shop: PublicPlantShopDetail | null;
  seo: PublicPlantSeo | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Filter options for public plants list (matches backend ListPlantsQueryDto)
 */
export interface PublicPlantFilter {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  tagIds?: string[];
  careDifficulty?: PublicCareDifficulty;
  lightRequirement?: PublicLightRequirement;
  wateringFrequency?: PublicWateringFrequency;
  humidityLevel?: PublicHumidityLevel;
  growthRate?: PublicGrowthRate;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  sortBy?: "name" | "price" | "difficulty" | "inventory" | "createdAt";
  sortOrder?: "asc" | "desc";
}

/**
 * Paginated response for public plants list
 */
export interface PublicPlantListResponse {
  data: PublicPlantListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}
