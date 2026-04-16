import { fetcher } from '../api-client';
import { ApiError } from '../types';

export interface ShopTranslation {
  id: string;
  shopId: string;
  locale: string;
  name: string;
  description: string | null;
  businessHours: string | null;
}

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

export interface ShopAddressTranslation {
  locale: string;
  country: string;
  division: string;
  district: string;
  street: string;
}

export interface ShopAddress {
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  googleMapsLink: string | null;
  isVerified: boolean;
  translations: ShopAddressTranslation[];
}

export interface AddressTranslation {
  country: string;
  division: string;
  district: string;
  street: string;
}

export interface UpdateAddressDto {
  postalCode?: string;
  latitude?: string;
  longitude?: string;
  googleMapsLink?: string;
  translations?: {
    en: AddressTranslation;
    bn: AddressTranslation;
  };
}

export interface ShopMedia {
  id: string;
  url: string;
  mimeType: string;
  fileName: string;
  size: number;
}

export interface CreateShopDto {
  translations: ShopTranslation[];
  slug?: string;
  logoId?: string;
  bannerId?: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  slug: string;
  status: string;
  logoId: string | null;
  bannerId: string | null;
  createdAt: string;
  updatedAt: string;
  name: string;
  description: string | null;
  businessHours: string | null;
  logo: ShopMedia | null;
  banner: ShopMedia | null;
  translations: ShopTranslation[];
  contact: ShopContact | null;
  address: ShopAddress | null;
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
 * Seller Shop API endpoints
 */
export const sellerShopApi = {
  /**
   * Get seller's shop
   */
  getMyShop: async (): Promise<Shop | null> => {
    try {
      return await fetcher<Shop>('/api/v1/user/seller/shops/my-shop');
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Create shop
   */
  create: async (dto: CreateShopDto): Promise<Shop> => {
    return fetcher<Shop>('/api/v1/user/seller/shops/apply', {
      method: 'POST',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Update shop (minor changes - immediate)
   */
  update: async (dto: Partial<CreateShopDto>): Promise<Shop> => {
    return fetcher<Shop>('/api/v1/user/seller/shops/my-shop', {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Submit shop for review (major changes)
   */
  submitForReview: async (dto: Partial<CreateShopDto>): Promise<Shop> => {
    return fetcher<Shop>('/api/v1/user/seller/shops/my-shop/submit-for-review', {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Get shop verification status
   */
  getVerificationStatus: async (): Promise<ShopVerificationStatus | null> => {
    try {
      return await fetcher<ShopVerificationStatus>(
        '/api/v1/user/seller/shops/my-shop/verification'
      );
    } catch (error: any) {
      if (error instanceof ApiError && error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  },

  /**
   * Upload shop images
   */
  uploadImages: async (formData: FormData): Promise<{ logoId?: string; bannerId?: string }> => {
    return fetcher<{ logoId?: string; bannerId?: string }>(
      '/api/v1/user/seller/shops/my-shop/images',
      {
        method: 'POST',
        body: formData,
      }
    );
  },

  /**
   * Delete shop
   */
  delete: async (): Promise<void> => {
    return fetcher<void>('/api/v1/user/seller/shops/my-shop', {
      method: 'DELETE',
    });
  },

  /**
   * Update shop address
   */
  updateAddress: async (dto: UpdateAddressDto): Promise<Shop> => {
    return fetcher<Shop>('/api/v1/user/seller/shops/my-shop/address', {
      method: 'PATCH',
      body: JSON.stringify(dto),
    });
  },
};
