import { fetcher } from "../../api-client";
import type {
  ApiPaginatedEnvelope,
  ApiPublicCampaignFeedItem,
} from "../../types/public/shops.api.types";

export type PublicCampaignsFeedFilter = {
  page?: number;
  limit?: number;
};

/**
 * Cross-shop approved campaign feed (BL-01).
 * Public endpoint — no authentication required.
 */
export async function getPublicCampaignsFeed(filter?: PublicCampaignsFeedFilter) {
  const params: Record<string, number | undefined> = {};
  if (filter?.page !== undefined) params.page = filter.page;
  if (filter?.limit !== undefined) params.limit = filter.limit;

  return fetcher<ApiPaginatedEnvelope<ApiPublicCampaignFeedItem>>("/api/v1/campaigns/feed", {
    params: Object.keys(params).length > 0 ? params : undefined,
    unwrapData: false,
  });
}
