export interface CampaignTranslationFields {
  title: string;
  description?: string | null;
}

export interface SellerCampaignTranslations {
  en: CampaignTranslationFields;
  bn: CampaignTranslationFields;
}

export interface SellerCampaignListItem {
  id: string;
  slug: string;
  type: string;
  title: string;
  moderationStatus: string;
  startDate: string;
  endDate: string;
  productCount: number;
  createdAt: string;
}

export interface SellerCampaignDetail {
  id: string;
  slug: string;
  type: string;
  banner: { id: string; url: string } | null;
  discountPercent: number | null;
  startDate: string;
  endDate: string;
  moderationStatus: string;
  rejectedReason: string | null;
  productIds: string[];
  translations: SellerCampaignTranslations;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignPayload {
  slug?: string;
  type: string;
  bannerId?: string | null;
  discountPercent?: number | null;
  startDate: string;
  endDate: string;
  productIds?: string[];
  translations: {
    en: CampaignTranslationFields;
    bn?: CampaignTranslationFields;
  };
}

export type UpdateCampaignPayload = Partial<CreateCampaignPayload>;

export interface SellerCampaignListResponse {
  success: boolean;
  message: string;
  data: SellerCampaignListItem[];
  meta: { page: number; limit: number; total: number; pages: number };
}
