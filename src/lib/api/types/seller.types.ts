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
