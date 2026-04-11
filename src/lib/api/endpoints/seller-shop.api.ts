import { apiClient } from '../api-client';

export interface ShopTranslation {
  locale: string;
  name: string;
  description: string;
  businessHours?: string;
}

export interface CreateShopDto {
  translations: ShopTranslation[];
  slug?: string;
  logoId?: string;
  bannerId?: string;
  address: string;
  division: string;
  city: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  slug: string;
  status: string;
  address: string | null;
  logoId: string | null;
  bannerId: string | null;
  createdAt: string;
  updatedAt: string;
  translations: ShopTranslation[];
}

export interface ShopVerificationStatus {
  id: string;
  shopId: string;
  status: string;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Get seller's shop
 */
export const getMyShop = async () => {
  return apiClient<Shop>('/seller/shop');
};

/**
 * Create shop
 */
export const createShop = async (dto: CreateShopDto) => {
  return apiClient.post<Shop>('/seller/shop', dto);
};

/**
 * Update shop (minor changes - immediate)
 */
export const updateShop = async (dto: Partial<CreateShopDto>) => {
  return apiClient.patch<Shop>('/seller/shop', dto);
};

/**
 * Submit shop for review (major changes)
 */
export const submitShopForReview = async (dto: Partial<CreateShopDto>) => {
  return apiClient.patch<Shop>('/seller/shop/submit-for-review', dto);
};

/**
 * Get shop verification status
 */
export const getVerificationStatus = async () => {
  return apiClient<ShopVerificationStatus>('/seller/shop/verification');
};

/**
 * Upload shop images
 */
export const uploadShopImages = async (formData: FormData) => {
  return apiClient.post<{ logoId?: string; bannerId?: string }>(
    '/seller/shop/images',
    formData,
    {
      headers: {}, // Content-Type will be set automatically for FormData
    }
  );
};

export const sellerShopApi = {
  getMyShop,
  createShop,
  updateShop,
  submitShopForReview,
  getVerificationStatus,
  uploadShopImages,
};
