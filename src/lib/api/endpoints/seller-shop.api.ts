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

export interface UpdateContactDto {
  businessEmail?: string;
  phone?: string;
  alternativePhone?: string;
  whatsapp?: string;
  telegram?: string;
  facebook?: string;
  instagram?: string;
  x?: string;
}

export interface ShopBrandingDto {
  logoId?: string;
  bannerId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface ShopTranslationDto {
  name: string;
  description?: string;
  businessHours?: string;
}

export interface UpdateShopInfoDto {
  slug?: string;
  branding?: ShopBrandingDto;
  translations: {
    en: ShopTranslationDto;
    bn: ShopTranslationDto;
  };
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

export type VerificationStatusType = 'PENDING' | 'REVIEWING' | 'APPROVED' | 'REJECTED';
export type ShopStatusType = 'DRAFT' | 'PENDING_VERIFICATION' | 'APPROVED' | 'ACTIVE' | 'INACTIVE' | 'REJECTED' | 'SUSPENDED' | 'DELETED';

export interface ShopVerificationStatus {
  id: string;
  shopId: string;
  status: VerificationStatusType;
  tradeLicenseNumber: string | null;
  tinNumber: string | null;
  tradeLicenseDocumentId: string | null;
  tinDocumentId: string | null;
  utilityBillDocumentId: string | null;
  rejectionReason: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateVerificationDto {
  tradeLicenseNumber?: string;
  tinNumber?: string;
  tradeLicenseDocumentId?: string;
  tinDocumentId?: string;
  utilityBillDocumentId?: string;
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

  /**
   * Upsert shop contact information (contact + social media)
   */
  updateContact: async (dto: UpdateContactDto): Promise<Shop> => {
    return fetcher<Shop>('/api/v1/user/seller/shops/my-shop/contact', {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Update shop info (branding + translations)
   */
  updateShopInfo: async (dto: UpdateShopInfoDto): Promise<Shop> => {
    return fetcher<Shop>('/api/v1/user/seller/shops/my-shop', {
      method: 'PUT',
      body: JSON.stringify(dto),
    });
  },

  /**
   * Update verification documents
   */
  updateVerification: async (dto: UpdateVerificationDto): Promise<ShopVerificationStatus> => {
    return fetcher<ShopVerificationStatus>(
      '/api/v1/user/seller/shops/my-shop/verification',
      {
        method: 'PATCH',
        body: JSON.stringify(dto),
      }
    );
  },
};
