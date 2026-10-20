import { query } from "@solidjs/router";
import { getPublicCampaignsFeed } from "~/lib/api/endpoints/public/campaigns-feed.api";
import type { ApiPublicCampaignFeedItem } from "~/lib/api/types/public/shops.api.types";
import { mapApiCampaign } from "~/lib/public-shops/content.mappers";
import {
  PUBLIC_CAMPAIGN_STATUS,
  type PublicShopCampaign,
} from "~/lib/types/public/shops.types";

export type HomeCampaignItem = {
  shopSlug: string;
  shopName: string;
  campaign: PublicShopCampaign;
};

/** Max cards rendered on the home row. */
export const HOME_CAMPAIGNS_DISPLAY_CAP = 8;

/** Feed page size for the dedicated `/offers` page. */
export const OFFERS_CAMPAIGNS_FEED_LIMIT = 48;

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

export function isDisplayableCampaign(
  campaign: PublicShopCampaign,
  now = new Date(),
): boolean {
  if (campaign.status !== PUBLIC_CAMPAIGN_STATUS.ACTIVE) {
    return false;
  }

  const start = startOfDay(new Date(campaign.startDate));
  const end = endOfDay(new Date(campaign.endDate));
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return false;
  }

  return now >= start && now <= end;
}

export function mapFeedItemToHomeCampaign(item: ApiPublicCampaignFeedItem): HomeCampaignItem {
  return {
    shopSlug: item.shopSlug,
    shopName: item.shopName,
    campaign: mapApiCampaign(item.campaign),
  };
}

async function fetchDisplayableFeedItems(limit: number): Promise<HomeCampaignItem[]> {
  const envelope = await getPublicCampaignsFeed({ page: 1, limit });
  return envelope.data
    .map(mapFeedItemToHomeCampaign)
    .filter((item) => isDisplayableCampaign(item.campaign));
}

export const listHomeCampaigns = query(async () => {
  "use server";
  return fetchDisplayableFeedItems(HOME_CAMPAIGNS_DISPLAY_CAP);
}, "public-home-campaigns");

export const listOffersCampaigns = query(async () => {
  "use server";
  return fetchDisplayableFeedItems(OFFERS_CAMPAIGNS_FEED_LIMIT);
}, "public-offers-campaigns");
