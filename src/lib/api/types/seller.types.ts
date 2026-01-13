/**
 * Business Account structure
 */
export interface BusinessAccount {
  id: string;
  userId: string;
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  address: string;
  country: string;
  city: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Setup Business Account Request
 */
export interface CreateBusinessAccountRequest {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  address: string;
  country: string;
  city: string;
}

/**
 * Shop structure
 */
export interface Shop {
  id: string;
  businessAccountId: string;
  name: string;
  slug: string;
  description: string | null;
  logoId: string | null;
  bannerId: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Setup Shop Request
 */
export interface CreateShopRequest {
  name: string;
  slug: string;
  description?: string;
  logoId?: string;
  bannerId?: string;
}

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
  status: "active" | "inactive" | "out_of_stock";
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
