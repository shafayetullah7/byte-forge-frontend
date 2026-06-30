import type {
  PublicShopCampaign,
  PublicShopCampaignHighlights,
} from "~/lib/types/public/shops.types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const CAMPAIGN_TEMPLATES: Omit<PublicShopCampaign, "id" | "slug">[] = [
  {
    title: "Monsoon Green Sale",
    type: "SEASONAL",
    bannerUrl: img("photo-1466692476866-aef1dfb1e01f"),
    startDate: "2026-05-01",
    endDate: "2026-06-30",
    discountPercent: 15,
    description: "15% off on all indoor plants with free care guide booklet.",
    status: "ACTIVE",
    participants: 2400,
    views: 18500,
    productsIncluded: 32,
    ordersGenerated: 890,
    savingsProvided: 125000,
    likes: 420,
    bookmarks: 310,
  },
  {
    title: "New Buyer Welcome Pack",
    type: "BUNDLE",
    bannerUrl: img("photo-1416879595882-3373a0480b0b"),
    startDate: "2026-04-01",
    endDate: "2026-12-31",
    discountPercent: 10,
    description: "Bundle discount for first-time buyers on starter plant kits.",
    status: "ACTIVE",
    participants: 1800,
    views: 12000,
    productsIncluded: 8,
    ordersGenerated: 540,
    savingsProvided: 68000,
    likes: 290,
    bookmarks: 210,
  },
  {
    title: "Eid Garden Festival",
    type: "DISCOUNT",
    bannerUrl: img("photo-1490759847868-88e44862c798"),
    startDate: "2026-03-15",
    endDate: "2026-04-15",
    discountPercent: 20,
    description: "Celebrate Eid with special pricing on gift plants and pots.",
    status: "COMPLETED",
    participants: 3200,
    views: 28000,
    productsIncluded: 45,
    ordersGenerated: 1200,
    savingsProvided: 210000,
    likes: 680,
    bookmarks: 520,
  },
  {
    title: "Flash Friday — 24 Hours Only",
    type: "FLASH_SALE",
    bannerUrl: img("photo-1459411550354-09e94960a59f"),
    startDate: "2026-06-14",
    endDate: "2026-06-15",
    discountPercent: 25,
    description: "Limited-time flash deals on trending bestsellers.",
    status: "COMPLETED",
    participants: 8500,
    views: 42000,
    productsIncluded: 12,
    ordersGenerated: 2100,
    savingsProvided: 185000,
    likes: 920,
    bookmarks: 740,
  },
  {
    title: "Free Shipping Week",
    type: "FREE_SHIPPING",
    bannerUrl: img("photo-1501004318641-b39e6831c78a"),
    startDate: "2026-07-01",
    endDate: "2026-07-07",
    discountPercent: null,
    description: "Nationwide free delivery on orders above ৳1,500.",
    status: "UPCOMING",
    participants: 0,
    views: 3200,
    productsIncluded: 60,
    ordersGenerated: 0,
    savingsProvided: 0,
    likes: 145,
    bookmarks: 98,
  },
];

export const MOCK_SHOP_CAMPAIGNS: Record<string, PublicShopCampaign[]> = {};

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
  const count = 3 + (i % 3);
  MOCK_SHOP_CAMPAIGNS[slug] = CAMPAIGN_TEMPLATES.slice(0, count).map((c, j) => ({
    ...c,
    id: `${slug}-campaign-${j + 1}`,
    slug: `${slug}-campaign-${j + 1}`,
    participants: c.participants + i * 200,
    savingsProvided: c.savingsProvided + i * 15000,
  }));
});

export function getMockCampaignHighlights(
  slug: string,
): PublicShopCampaignHighlights {
  const campaigns = MOCK_SHOP_CAMPAIGNS[slug] ?? [];
  return {
    campaignsLast12Months: campaigns.length + 8,
    totalSavingsBdt: campaigns.reduce((s, c) => s + c.savingsProvided, 0) + 250000,
    totalParticipants: campaigns.reduce((s, c) => s + c.participants, 0) + 12000,
    mostSuccessfulReach: 8500,
  };
}
