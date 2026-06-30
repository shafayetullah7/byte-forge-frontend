import { query, revalidate } from "@solidjs/router";
import { fetcher } from "../../api-client";
import type { SellerAnalyticsOverview } from "../../types/seller/analytics.types";

type SuccessEnvelope<T> = { success: boolean; message: string; data: T };

export const getSellerAnalyticsOverview = query(
  async () => {
    "use server";
    const response = await fetcher<SuccessEnvelope<SellerAnalyticsOverview>>(
      "/api/v1/user/seller/analytics/overview",
      { unwrapData: false },
    );
    return response.data;
  },
  "seller-analytics-overview",
);

export const invalidateSellerAnalytics = () =>
  revalidate(getSellerAnalyticsOverview.keyFor());
