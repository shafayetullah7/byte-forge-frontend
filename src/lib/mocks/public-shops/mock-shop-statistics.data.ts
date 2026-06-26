import type { PublicShopStatistics } from "~/lib/types/public/shops.types";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function trend(base: number, variance: number) {
  return months.map((label, i) => ({
    label,
    value: Math.round(base + i * variance + (i % 2) * 10),
  }));
}

export const MOCK_SHOP_STATISTICS: Record<string, PublicShopStatistics> = {};

const SHOP_SLUGS = [
  "green-haven-nursery",
  "aponika-garden-center",
  "leaf-and-root",
  "sylhet-hills-nursery",
  "bonsai-house-dhaka",
  "krishi-khamar-plants",
  "urban-jungle-bd",
  "chattogram-tropicals",
  "rising-sprouts",
  "verdant-veranda",
];

SHOP_SLUGS.forEach((slug, i) => {
  const mult = 1 + i * 0.15;
  MOCK_SHOP_STATISTICS[slug] = {
    ordersCompleted: trend(120 * mult, 35),
    followersGrowth: trend(200 * mult, 80),
    ratingTrend: months.map((label, j) => ({
      label,
      value: Math.round((4.2 + j * 0.08 + (i % 3) * 0.05) * 10) / 10,
    })),
    campaignTrend: trend(2 + i, 1),
    contentViewsTrend: trend(800 * mult, 200),
  };
});
