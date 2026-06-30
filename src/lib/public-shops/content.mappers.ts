import type {
  ApiPublicShopArticle,
  ApiPublicShopCampaign,
  ApiPublicShopCampaignHighlights,
  ApiSuccessEnvelope,
} from "~/lib/api/types/public/shops.api.types";
import type {
  PublicCampaignStatus,
  PublicCampaignType,
  PublicShopArticle,
  PublicShopCampaign,
  PublicShopCampaignHighlights,
} from "~/lib/types/public/shops.types";

export function unwrapSuccess<T>(envelope: ApiSuccessEnvelope<T>): T {
  return envelope.data;
}

export function mapApiCampaign(item: ApiPublicShopCampaign): PublicShopCampaign {
  return {
    id: item.id,
    slug: item.slug ?? item.id,
    title: item.title,
    type: item.type as PublicCampaignType,
    bannerUrl: item.bannerUrl,
    startDate: item.startDate,
    endDate: item.endDate,
    discountPercent: item.discountPercent,
    description: item.description,
    status: item.status as PublicCampaignStatus,
    participants: item.participants,
    views: item.views,
    productsIncluded: item.productsIncluded,
    ordersGenerated: item.ordersGenerated,
    savingsProvided: item.savingsProvided,
    likes: item.likes,
    bookmarks: item.bookmarks,
  };
}

export function mapApiCampaignHighlights(
  data: ApiPublicShopCampaignHighlights,
): PublicShopCampaignHighlights {
  return {
    campaignsLast12Months: data.campaignsLast12Months,
    totalSavingsBdt: data.totalSavingsBdt,
    totalParticipants: data.totalParticipants,
    mostSuccessfulReach: data.mostSuccessfulReach,
  };
}

export function mapApiArticle(item: ApiPublicShopArticle): PublicShopArticle {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    coverUrl: item.coverUrl,
    publishedAt: item.publishedAt,
    readMinutes: item.readMinutes,
    category: item.category,
    viewCount: item.viewCount,
    likeCount: item.likeCount,
    shareCount: item.shareCount,
    isEditorsPick: item.isEditorsPick,
    isPopular: item.isPopular,
  };
}
