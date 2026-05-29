/**
 * Shop Translation structure (matches backend LocalizedShopDetails.translations)
 */
export interface ShopTranslation {
  id: string;
  shopId: string;
  locale: string;
  name: string;
  description: string | null;
  businessHours: string | null;
}

/**
 * Media structure for logo/banner (matches backend LocalizedShopDetails.logo/banner)
 */
export interface MediaAttachment {
  id: string;
  url: string;
  mimeType: string;
  fileName: string;
  size: number;
}

/**
 * Shop Contact structure (matches backend ShopContactDetails)
 */
export interface ShopContact {
  businessEmail: string | null;
  phone: string | null;
  alternativePhone: string | null;
  whatsapp: string | null;
  telegram: string | null;
  facebook: string | null;
  instagram: string | null;
  x: string | null;
}

/**
 * Shop Address Translation structure (matches backend ShopAddressTranslation)
 */
export interface ShopAddressTranslation {
  locale: string;
  country: string;
  division: string;
  district: string;
  street: string;
}

/**
 * Shop Address structure (matches backend ShopAddressDetails)
 */
export interface ShopAddress {
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  googleMapsLink: string | null;
  isVerified: boolean;
  translations: ShopAddressTranslation[];
}

/**
 * Shop structure (matches backend LocalizedShopDetails)
 */
export interface Shop {
  id: string;
  ownerId: string;
  slug: string;
  logoId: string | null;
  bannerId: string | null;
  status: ShopStatusType;
  createdAt: string;
  updatedAt: string;
}

/**
 * Inventory movement type constants (matches backend InventoryMovementTypeEnum)
 */
export const INVENTORY_MOVEMENT_TYPE = {
  INITIAL_STOCK: "INITIAL_STOCK",
  RESTOCK: "RESTOCK",
  ORDER_RESERVED: "ORDER_RESERVED",
  ORDER_FULFILLED: "ORDER_FULFILLED",
  ORDER_CANCELLED: "ORDER_CANCELLED",
  CUSTOMER_RETURN: "CUSTOMER_RETURN",
  DAMAGED: "DAMAGED",
  LOST: "LOST",
  ADJUSTMENT: "ADJUSTMENT",
  TRANSFER_OUT: "TRANSFER_OUT",
  TRANSFER_IN: "TRANSFER_IN",
} as const;

export type InventoryMovementType = (typeof INVENTORY_MOVEMENT_TYPE)[keyof typeof INVENTORY_MOVEMENT_TYPE];

/**
 * Variant inventory detail (matches backend inventory + product_variants join)
 */
export interface VariantInventoryDetail {
  inventoryId: string;
  variantId: string;
  sku: string | null;
  variantName: string | null;
  price: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastStockUpdate: string;
}

/**
 * Inventory detail for a product (matches backend GET /products/:id/inventory)
 */
export interface InventoryDetail {
  productId: string;
  productName: string;
  productSlug: string;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  lowStockCount: number;
  outOfStockCount: number;
  variants: VariantInventoryDetail[];
  stockMovements: InventoryMovement[];
}

/**
 * Stock movement record (matches backend inventory_movements table)
 */
export interface InventoryMovement {
  id: string;
  inventoryId: string;
  variantId: string;
  variantSku: string | null;
  variantName: string | null;
  movementType: InventoryMovementType;
  quantityChange: number;
  previousQuantity: number;
  newQuantity: number;
  previousReserved: number;
  newReserved: number;
  referenceType: string | null;
  referenceId: string | null;
  reason: string | null;
  createdBy: string | null;
  createdAt: string;
}

/**
 * Filter options for stock movements (matches backend ListMovementsQueryDto)
 */
export interface InventoryMovementFilter {
  page?: number;
  limit?: number;
  variantId?: string;
  movementType?: InventoryMovementType;
  startDate?: string;
  endDate?: string;
}

/**
 * Paginated stock movements response
 */
export interface InventoryMovementsResponse {
  movements: InventoryMovement[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Restock request (matches backend RestockVariantDto)
 */
export interface RestockVariantRequest {
  variantId: string;
  quantity: number;
  referenceType?: string;
  referenceId?: string;
  reason?: string;
}

/**
 * Stock adjustment request (matches backend AdjustStockDto)
 */
export interface AdjustStockRequest {
  variantId: string;
  quantityChange: number;
  referenceType?: string;
  referenceId?: string;
  reason?: string;
}

/**
 * Mark damaged request (matches backend MarkDamagedDto)
 */
export interface MarkDamagedRequest {
  variantId: string;
  quantity: number;
  reason?: string;
}

/**
 * Generic inventory operation response
 */
export interface InventoryOperationResponse {
  success: boolean;
  message: string;
  data: {
    movement: InventoryMovement;
    newQuantity: number;
    newReserved: number;
  };
}

/**
 * Shop Status for routing decisions (matches backend ShopStatus)
 */
export interface ShopStatus {
  id: string;
  slug: string;
  status: ShopStatusType;
  hasTranslations: boolean;
  rejectionReason: string | null;
}

/**
 * Shop Translation Input for creation
 */
export interface ShopTranslationInput {
  locale: string;
  name: string;
  description: string;
  businessHours?: string;
}

/**
 * Apply as Seller Request (matches backend ApplySellerDto)
 */
export interface ApplyAsSellerRequest {
  slug?: string;
  logoId?: string;
  bannerId?: string;
  translations: ShopTranslationInput[];
}

/**
 * Product status constants (matches backend ProductStatusEnum)
 */
export const PRODUCT_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;

export type ProductStatus = (typeof PRODUCT_STATUS)[keyof typeof PRODUCT_STATUS];

/**
 * @deprecated Use PRODUCT_STATUS instead
 */
export const PLANT_STATUS = PRODUCT_STATUS;
export type PlantStatus = ProductStatus;

/**
 * Plant product category (from list response)
 */
export interface PlantCategory {
  id: string;
  slug: string;
  name: string | null;
}

/**
 * Plant tag (from list response)
 */
export interface PlantTag {
  id: string;
  slug: string;
  name: string | null;
}

/**
 * Plant thumbnail (from list response)
 */
export interface PlantThumbnail {
  id: string;
  url: string;
}

/**
 * Plant list item (matches backend PlantListItemResponseDto)
 */
export interface PlantListItem {
  id: string;
  slug: string;
  status: PlantStatus;
  thumbnail: PlantThumbnail | null;
  name: string | null;
  shortDescription: string | null;
  price: string | null;
  inventoryCount: number;
  category: PlantCategory | null;
  tags: PlantTag[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Plant list response with pagination (matches backend paginated response)
 */
export interface PlantListResponse {
  success: boolean;
  message: string;
  data: PlantListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Plant filter options (matches backend ListPlantsQueryDto)
 */
export interface PlantFilter {
  page?: number;
  limit?: number;
  search?: string;
  status?: PlantStatus;
  categoryId?: string;
  tagIds?: string[];
  sortBy?: "createdAt" | "updatedAt" | "name" | "price" | "inventory";
  sortOrder?: "asc" | "desc";
}

/**
 * Plant variant attributes (matches backend plantVariantAttributesSchema)
 */
export interface PlantVariantAttributesInput {
  growthStage?: string;
  plantForm?: string;
  variegation?: string;
  leafDensity?: string;
  stemCount?: number;
  currentHeight?: string;
  currentSpread?: string;
  propagationType?: string;
  containerType?: string;
  containerSize?: string;
  bundleType?: string;
}

/**
 * Product translation input (matches backend productTranslationSchema)
 */
export interface ProductTranslationInput {
  locale: "en" | "bn";
  name: string;
  description?: string;
  shortDescription?: string;
}

/**
 * Plant details translation input (matches backend plantDetailsTranslationSchema)
 */
export interface PlantDetailsTranslationInput {
  commonNames?: string;
  origin?: string;
  soilType?: string;
  toxicityInfo?: string;
}

/**
 * Plant details input (matches backend plantDetailsSchema)
 */
export interface PlantDetailsInput {
  categoryId: string;
  tagIds?: string[];
  scientificName?: string;
  lightRequirement: string;
  wateringFrequency: string;
  humidityLevel: string;
  temperatureRange?: string;
  careDifficulty: string;
  growthRate?: string;
  matureHeight?: string;
  matureSpread?: string;
  translations: {
    en: PlantDetailsTranslationInput;
    bn: PlantDetailsTranslationInput;
  };
}

/**
 * Plant variant attributes input (matches backend plantVariantAttributesSchema)
 */
export interface PlantVariantAttributesInput {
  growthStage?: string;
  plantForm?: string;
  variegation?: string;
  propagationType?: string;
  containerType?: string;
  bundleType?: string;
}

/**
 * Plant variant input (matches backend productVariantSchema)
 */
export interface PlantVariantInput {
  sku?: string;
  price: number;
  inventoryCount?: number;
  trackInventory?: boolean;
  lowStockThreshold?: number;
  isBase?: boolean;
  isActive?: boolean;
  plantAttributes?: PlantVariantAttributesInput;
  mediaIds?: string[];
}

/**
 * Care guide input (matches backend careGuideSchema)
 */
export interface CareGuideInput {
  lightInstructions?: string;
  wateringInstructions?: string;
  humidityInstructions?: string;
  fertilizerSchedule?: string;
  repottingFrequency?: string;
  pruningNotes?: string;
  commonProblems?: string;
  seasonalCare?: string;
}

/**
 * Create plant request (matches backend CreatePlantDto)
 */
export interface CreatePlantRequest {
  slug?: string;
  thumbnailId: string;
  status?: PlantStatus;
  translations: ProductTranslationInput[];
  plantDetails: PlantDetailsInput;
  variants: PlantVariantInput[];
  careGuide?: {
    en?: CareGuideInput;
    bn?: CareGuideInput;
  };
}

/**
 * Create plant response (backend returns { id })
 */
export interface CreatePlantResponse {
  id: string;
}

/**
 * Product type constants (matches backend ProductTypeEnum)
 */
export const PRODUCT_TYPE = {
  PLANT: "plant",
  POT: "pot",
  SEED: "seed",
  FERTILIZER: "fertilizer",
} as const;

export type ProductType = (typeof PRODUCT_TYPE)[keyof typeof PRODUCT_TYPE];

/**
 * Shop status constants (matches backend ShopStatusEnum)
 */
export const SHOP_STATUS = {
  DRAFT: "DRAFT",
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  APPROVED: "APPROVED",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  REJECTED: "REJECTED",
  SUSPENDED: "SUSPENDED",
  DELETED: "DELETED",
} as const;

export type ShopStatusType = (typeof SHOP_STATUS)[keyof typeof SHOP_STATUS];

/**
 * Shop verification status constants (matches backend ShopVerificationStatusEnum)
 */
export const SHOP_VERIFICATION_STATUS = {
  PENDING: "PENDING",
  REVIEWING: "REVIEWING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;

export type ShopVerificationStatusType = (typeof SHOP_VERIFICATION_STATUS)[keyof typeof SHOP_VERIFICATION_STATUS];

/**
 * Light requirement constants (matches backend LightRequirementEnum)
 */
export const LIGHT_REQUIREMENT = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  BRIGHT_INDIRECT: "BRIGHT_INDIRECT",
  DIRECT: "DIRECT",
} as const;

export type LightRequirement = (typeof LIGHT_REQUIREMENT)[keyof typeof LIGHT_REQUIREMENT];

/**
 * Watering frequency constants (matches backend WateringFrequencyEnum)
 */
export const WATERING_FREQUENCY = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  BI_WEEKLY: "BI_WEEKLY",
  MONTHLY: "MONTHLY",
} as const;

export type WateringFrequency = (typeof WATERING_FREQUENCY)[keyof typeof WATERING_FREQUENCY];

/**
 * Humidity level constants (matches backend HumidityLevelEnum)
 */
export const HUMIDITY_LEVEL = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
} as const;

export type HumidityLevel = (typeof HUMIDITY_LEVEL)[keyof typeof HUMIDITY_LEVEL];

/**
 * Care difficulty constants (matches backend CareDifficultyEnum)
 */
export const CARE_DIFFICULTY = {
  BEGINNER: "BEGINNER",
  INTERMEDIATE: "INTERMEDIATE",
  EXPERT: "EXPERT",
} as const;

export type CareDifficulty = (typeof CARE_DIFFICULTY)[keyof typeof CARE_DIFFICULTY];

/**
 * Growth rate constants (matches backend GrowthRateEnum)
 */
export const GROWTH_RATE = {
  SLOW: "SLOW",
  MODERATE: "MODERATE",
  FAST: "FAST",
} as const;

export type GrowthRate = (typeof GROWTH_RATE)[keyof typeof GROWTH_RATE];

/**
 * Growth stage constants (matches backend GrowthStageEnum)
 */
export const GROWTH_STAGE = {
  SEEDLING: "SEEDLING",
  JUVENILE: "JUVENILE",
  MATURE: "MATURE",
  CUTTING: "CUTTING",
} as const;

export type GrowthStage = (typeof GROWTH_STAGE)[keyof typeof GROWTH_STAGE];

/**
 * Plant form constants (matches backend PlantFormEnum)
 */
export const PLANT_FORM = {
  UPRIGHT: "UPRIGHT",
  TRAILING: "TRAILING",
  BUSHY: "BUSHY",
  CLIMBING: "CLIMBING",
  ROSETTE: "ROSETTE",
} as const;

export type PlantForm = (typeof PLANT_FORM)[keyof typeof PLANT_FORM];

/**
 * Leaf density constants (matches backend LeafDensityEnum)
 */
export const LEAF_DENSITY = {
  SPARSE: "SPARSE",
  MODERATE: "MODERATE",
  DENSE: "DENSE",
} as const;

export type LeafDensity = (typeof LEAF_DENSITY)[keyof typeof LEAF_DENSITY];

/**
 * Variegation constants (matches backend VariegationEnum)
 */
export const VARIEGATION = {
  NONE: "NONE",
  VARIEGATED: "VARIEGATED",
  SEMI_VARIEGATED: "SEMI_VARIEGATED",
  ALBO: "ALBO",
  AUREO: "AUREO",
} as const;

export type Variegation = (typeof VARIEGATION)[keyof typeof VARIEGATION];

/**
 * Propagation type constants (matches backend PropagationTypeEnum)
 */
export const PROPAGATION_TYPE = {
  CUTTING: "CUTTING",
  SEED: "SEED",
  TISSUE_CULTURE: "TISSUE_CULTURE",
  AIR_LAYER: "AIR_LAYER",
  DIVISION: "DIVISION",
} as const;

export type PropagationType = (typeof PROPAGATION_TYPE)[keyof typeof PROPAGATION_TYPE];

/**
 * Container type constants (matches backend ContainerTypeEnum)
 */
export const CONTAINER_TYPE = {
  NURSERY_POT: "NURSERY_POT",
  DECORATIVE_POT: "DECORATIVE_POT",
  HANGING_BASKET: "HANGING_BASKET",
  TERRARIUM: "TERRARIUM",
  GROW_BAG: "GROW_BAG",
} as const;

export type ContainerType = (typeof CONTAINER_TYPE)[keyof typeof CONTAINER_TYPE];

/**
 * Product thumbnail (from list response)
 */
export interface ProductThumbnail {
  id: string;
  url: string;
}

/**
 * Product list item (matches backend ProductListItemResponseDto)
 */
export interface ProductListItem {
  id: string;
  slug: string;
  productType: ProductType;
  status: PlantStatus;
  thumbnail: ProductThumbnail | null;
  name: string | null;
  shortDescription: string | null;
  price: string | null;
  inventoryCount: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Product detail response (matches backend ProductDetailResponseDto)
 */
export interface ProductDetail {
  id: string;
  slug: string;
  productType: ProductType;
  status: PlantStatus;
  thumbnail: ProductThumbnail | null;
  translations: Array<{
    locale: "en" | "bn";
    name: string;
    description: string | null;
    shortDescription: string | null;
  }>;
  variants: Array<{
    id: string;
    sku: string | null;
    price: string;
    inventoryCount: number;
    lowStockThreshold: number;
    isBase: boolean;
    isActive: boolean;
  }>;
  stockBreakdown: {
    totalStock: number;
    availableStock: number;
    reservedStock: number;
    lowStockCount: number;
  };
  createdAt: string;
  updatedAt: string;
}

/**
 * Helper to extract a locale-specific translation from a ProductDetail
 */
export function getProductTranslation(
  product: ProductDetail | undefined | null,
  locale: string = "en"
) {
  if (!product) return null;
  return (
    product.translations.find((t) => t.locale === locale) ??
    product.translations[0] ??
    null
  );
}

/**
 * Product summary response (matches backend ProductSummaryResponseDto)
 * Lightweight data for layout header - localized by x-locale header
 */
export interface ProductSummary {
  id: string;
  slug: string;
  productType: ProductType;
  status: PlantStatus;
  name: string;
  shortDescription: string | null;
}

/**
 * Product overview response (matches backend ProductOverviewResponseDto)
 * Data for overview/tab content
 */
export interface ProductOverview {
  id: string;
  status: PlantStatus;
  createdAt: string;
  thumbnail: ProductThumbnail | null;
  variants: Array<{
    id: string;
    sku: string | null;
    price: string;
    inventoryCount: number;
    lowStockThreshold: number;
    isBase: boolean;
    isActive: boolean;
  }>;
  stockBreakdown: {
    totalStock: number;
    availableStock: number;
    reservedStock: number;
    lowStockCount: number;
  };
}

/**
 * Product list response with pagination (matches backend paginated response)
 */
export interface ProductListResponse {
  success: boolean;
  message: string;
  data: ProductListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

/**
 * Product filter options (matches backend ListProductsQueryDto)
 */
export interface ProductFilter {
  page?: number;
  limit?: number;
  search?: string;
  productType?: ProductType;
  status?: PlantStatus;
  sortBy?: "createdAt" | "updatedAt" | "name" | "price" | "inventory";
  sortOrder?: "asc" | "desc";
}

/**
 * Shop Verification Status (matches backend VerificationStatus)
 */
export interface VerificationStatus {
  id: string;
  shopId: string;
  status: ShopVerificationStatusType;
  tradeLicenseNumber: string | null;
  tinNumber: string | null;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Shipping rate per district (matches backend ShippingRate)
 */
export interface ShippingRate {
  id: string;
  shopId: string;
  districtId: string;
  cost: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Bulk shipping rate item for update request
 */
export interface BulkShippingRateItem {
  districtId: string;
  cost: string | number;
}

/**
 * Bulk update shipping rates request
 */
export interface BulkUpdateShippingRatesRequest {
  rates: BulkShippingRateItem[];
}

/**
 * Update Verification Request (matches backend UpdateVerificationDto)
 */
export interface UpdateVerificationRequest {
  tradeLicenseNumber?: string;
  tinNumber?: string;
  tradeLicenseDocumentId?: string;
  tinDocumentId?: string;
  utilityBillDocumentId?: string;
}

/**
 * Plant detail response (matches backend PlantDetailResult)
 * Full plant data with translations, plant details, care instructions, and variants
 */
export interface PlantDetail {
  id: string;
  slug: string;
  status: ProductStatus;
  thumbnail: { id: string; url: string } | null;
  translations: Array<{
    locale: string;
    name: string;
    description: string | null;
    shortDescription: string | null;
  }>;
  plantDetails: {
    id: string;
    categoryId: string | null;
    scientificName: string | null;
    commonNames: string | null;
    origin: string | null;
    lightRequirement: string | null;
    wateringFrequency: string | null;
    humidityLevel: string | null;
    temperatureRange: string | null;
    soilType: string | null;
    careDifficulty: string | null;
    growthRate: string | null;
    matureHeight: string | null;
    matureSpread: string | null;
    toxicityInfo: string | null;
    category: {
      id: string;
      slug: string;
      translations: Array<{ locale: string; name: string }>;
    } | null;
    tags: Array<{
      id: string;
      slug: string;
      translations: Array<{ locale: string; name: string }>;
    }>;
    translations: Array<{
      locale: string;
      commonNames: string | null;
      origin: string | null;
      soilType: string | null;
      toxicityInfo: string | null;
    }>;
  } | null;
  careInstructions: {
    id: string;
    lightInstructions: string | null;
    wateringInstructions: string | null;
    humidityInstructions: string | null;
    fertilizerSchedule: string | null;
    repottingFrequency: string | null;
    pruningNotes: string | null;
    commonProblems: string | null;
    seasonalCare: string | null;
    translations: Array<{
      locale: string;
      lightInstructions: string | null;
      wateringInstructions: string | null;
      humidityInstructions: string | null;
      fertilizerSchedule: string | null;
      repottingFrequency: string | null;
      pruningNotes: string | null;
      commonProblems: string | null;
      seasonalCare: string | null;
    }>;
  } | null;
  variants: Array<{
    id: string;
    sku: string | null;
    price: string;
    inventoryCount: number;
    lowStockThreshold: number;
    trackInventory: boolean;
    displayOrder: number;
    isBase: boolean;
    isActive: boolean;
    plantAttributes: {
      id: string;
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
    } | null;
    translations: Array<{
      locale: string;
      title: string;
    }>;
    media: Array<{
      id: string;
      mediaId: string;
      displayOrder: number;
      type: string;
      url: string;
    }>;
  }>;
  createdAt: string;
  updatedAt: string;
}
