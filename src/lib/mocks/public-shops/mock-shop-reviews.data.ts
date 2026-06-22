import type {
  PublicShopReview,
  PublicShopReviewSummary,
} from "~/lib/types/public/shops.types";

const REVIEW_TEMPLATES: Omit<PublicShopReview, "id">[] = [
  {
    customerName: "Rahim U.",
    rating: 5,
    title: "Healthy plants, careful packaging",
    comment: "Every leaf arrived intact. The care card in Bangla was a nice touch for my mother.",
    createdAt: "2026-05-18T10:00:00.000Z",
    isVerifiedPurchase: true,
    productName: "Monstera Deliciosa",
  },
  {
    customerName: "Nadia K.",
    rating: 5,
    title: "Fast COD delivery to Chattogram",
    comment: "Seller confirmed quickly and the plant looked exactly like the photos. Will order again.",
    createdAt: "2026-05-12T14:30:00.000Z",
    isVerifiedPurchase: true,
    productName: "Snake Plant",
  },
  {
    customerName: "Farhan A.",
    rating: 4,
    title: "Good value for money",
    comment: "Slightly smaller than expected but very healthy. Support team answered my questions promptly.",
    createdAt: "2026-05-08T09:15:00.000Z",
    isVerifiedPurchase: true,
    productName: "Peace Lily",
  },
  {
    customerName: "Sadia M.",
    rating: 5,
    title: "Best online plant purchase",
    comment: "Verified seller badge gave me confidence. Packaging was eco-friendly and secure.",
    createdAt: "2026-04-28T16:45:00.000Z",
    isVerifiedPurchase: true,
    productName: "Fiddle Leaf Fig",
  },
  {
    customerName: "Karim H.",
    rating: 4,
    title: "Reliable for office bulk order",
    comment: "Ordered 12 desk plants for our team. All arrived fresh with consistent sizing.",
    createdAt: "2026-04-20T11:00:00.000Z",
    isVerifiedPurchase: true,
    productName: "Golden Pothos",
  },
  {
    customerName: "Priya S.",
    rating: 5,
    title: "Exceeded expectations",
    comment: "The campaign discount was real and delivery was on time. Highly recommend this shop.",
    createdAt: "2026-04-10T08:20:00.000Z",
    isVerifiedPurchase: true,
    productName: "ZZ Plant",
  },
  {
    customerName: "Anwar B.",
    rating: 3,
    title: "Decent but delayed",
    comment: "Plant quality was fine. Delivery took an extra day due to rain but seller kept me updated.",
    createdAt: "2026-03-25T13:00:00.000Z",
    isVerifiedPurchase: true,
    productName: "Aloe Vera",
  },
  {
    customerName: "Tasnim R.",
    rating: 5,
    title: "Perfect gift plant",
    comment: "Bought as a housewarming gift. Beautiful presentation and the recipient loved it.",
    createdAt: "2026-03-15T17:30:00.000Z",
    isVerifiedPurchase: true,
    productName: "Rubber Plant",
  },
];

export const MOCK_SHOP_REVIEWS: Record<string, PublicShopReview[]> = {};

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
  const count = 5 + (i % 4);
  MOCK_SHOP_REVIEWS[slug] = REVIEW_TEMPLATES.slice(0, count).map((r, j) => ({
    ...r,
    id: `${slug}-review-${j + 1}`,
    customerName: j % 2 === 0 ? r.customerName : r.customerName.replace(/.$/, "*"),
  }));
});

export function getMockReviewSummary(slug: string): PublicShopReviewSummary {
  const reviews = MOCK_SHOP_REVIEWS[slug] ?? [];
  const total = reviews.length;
  const average =
    total === 0
      ? 0
      : reviews.reduce((s, r) => s + r.rating, 0) / total;
  const distribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    return {
      rating,
      count,
      percentage: total === 0 ? 0 : Math.round((count / total) * 100),
    };
  });
  return { average, total, distribution };
}
