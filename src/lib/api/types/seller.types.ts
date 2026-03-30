/**
 * Shop Translation structure (matches backend TShopTranslation)
 */
export interface ShopTranslation {
  id: string;
  shopId: string;
  locale: string;
  shopName: string;
  about: string | null;
  brandStory: string | null;
  featuredHighlight: string | null;
}

/**
 * Media structure for logo/banner
 */
export interface MediaAttachment {
  id: string;
  url: string;
  mimeType: string;
  fileName: string;
  size: number;
}

/**
 * Shop structure (matches backend LocalizedShopDetails)
 */
export interface Shop {
  id: string;
  ownerId: string;
  slug: string;
  address: string | null;
  logoId: string | null;
  bannerId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  shopName: string;
  about: string | null;
  brandStory: string | null;
  featuredHighlight: string | null;
  logo: MediaAttachment | null;
  banner: MediaAttachment | null;
  translations: ShopTranslation[];
}

/**
 * Shop Status for routing decisions (matches backend ShopStatus)
 */
export interface ShopStatus {
  id: string;
  status: string;
  hasTranslations: boolean;
}

/**
 * Shop Translation Input for creation
 */
export interface ShopTranslationInput {
  locale: string;
  shopName: string;
  about: string;
  brandStory?: string;
  featuredHighlight?: string;
}

/**
 * Apply as Seller Request (matches backend ApplySellerDto)
 */
export interface ApplyAsSellerRequest {
  address: string;
  slug?: string; // Optional - if not provided, will be generated from English shop name
  logoId?: string;
  bannerId?: string;
  translations: ShopTranslationInput[];
  tradeLicenseNumber: string;
  tradeLicenseDocumentId: string; // Required for shop application
  tinNumber?: string;
  tinDocumentId?: string;
  utilityBillDocumentId?: string;
}

/**
 * Plant status constants
 */
export const PLANT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  OUT_OF_STOCK: "out_of_stock",
} as const;

export type PlantStatus = (typeof PLANT_STATUS)[keyof typeof PLANT_STATUS];

/**
 * Plant structure
 */
export interface Plant {
  id: string;
  shopId: string;
  categoryId: string;
  name: string;
  slug: string;
  commonName: string | null;
  scientificName: string | null;
  description: string | null;
  price: number;
  stock: number;
  status: PlantStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Plant filter options
 */
export interface PlantFilter {
  name?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Create Plant Request
 */
export interface CreatePlantRequest {
  categoryId: string;
  name: string;
  slug: string;
  commonName?: string;
  scientificName?: string;
  description?: string;
  price: number;
  stock: number;
}

/**
 * Update Plant Request
 */
export interface UpdatePlantRequest {
  categoryId?: string;
  name?: string;
  slug?: string;
  commonName?: string;
  scientificName?: string;
  description?: string;
  price?: number;
  stock?: number;
  status?: "active" | "inactive" | "out_of_stock";
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
