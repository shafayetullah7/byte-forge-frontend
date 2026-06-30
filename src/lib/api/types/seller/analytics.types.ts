export interface SellerAnalyticsOverview {
  ordersLast30Days: {
    count: number;
    revenue: string;
  };
  topProducts: Array<{
    productId: string;
    name: string;
    slug: string | null;
    unitsSold: number;
    revenue: string;
    thumbnail: { id: string; url: string } | null;
  }>;
  followerCount: number;
  publishedCampaignsCount: number;
  publishedArticlesCount: number;
}
