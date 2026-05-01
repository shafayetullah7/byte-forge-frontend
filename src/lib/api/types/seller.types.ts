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
  status: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string | null;
  businessHours: string | null;
  logo: MediaAttachment | null;
  banner: MediaAttachment | null;
  translations: ShopTranslation[];
  contact: ShopContact | null;
  address: ShopAddress | null;
}

/**
 * Shop Status for routing decisions (matches backend ShopStatus)
 */
export interface ShopStatus {
  id: string;
  slug: string;
  status: string;
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
 * Plant status constants
 */
export const PLANT_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;

export type PlantStatus = (typeof PLANT_STATUS)[keyof typeof PLANT_STATUS];

/**
 * Plant product category (from list response)
 */
export interface PlantCategory {
  id: string;
  slug: string;
  name?: string;
}

/**
 * Plant list item (matches backend PlantListItemResponseDto)
 */
export interface PlantListItem {
  id: string;
  slug: string;
  status: PlantStatus;
  thumbnailId?: string;
  name?: string;
  shortDescription?: string;
  price?: number;
  salePrice?: number;
  inventoryCount: number;
  category?: PlantCategory;
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
    totalPages: number;
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
  locale?: "en" | "bn";
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
 * Shop Verification Status (matches backend VerificationStatus)
 */
export interface VerificationStatus {
  id: string;
  shopId: string;
  status: "PENDING" | "REVIEWING" | "APPROVED" | "REJECTED";
  tradeLicenseNumber: string | null;
  tinNumber: string | null;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
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
