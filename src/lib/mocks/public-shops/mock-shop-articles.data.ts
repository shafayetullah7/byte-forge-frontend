import type { PublicShopArticle } from "~/lib/types/public/shops.types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const ARTICLE_TEMPLATES: Omit<PublicShopArticle, "id" | "slug">[] = [
  {
    title: "5 Low-Light Plants Perfect for Bangladesh Apartments",
    excerpt: "Discover hardy indoor plants that thrive without direct sunlight in urban flats.",
    coverUrl: img("photo-1466692476866-aef1dfb1e01f"),
    publishedAt: "2026-05-10",
    readMinutes: 6,
    category: "Care Guide",
    viewCount: 4200,
    likeCount: 312,
    shareCount: 89,
    isPopular: true,
    isEditorsPick: true,
  },
  {
    title: "Monsoon Plant Care: What Every Buyer Should Know",
    excerpt: "Humidity, drainage, and pest prevention tips for the rainy season.",
    coverUrl: img("photo-1416879595882-3373a0480b0b"),
    publishedAt: "2026-04-22",
    readMinutes: 8,
    category: "Seasonal",
    viewCount: 3800,
    likeCount: 278,
    shareCount: 64,
    isPopular: true,
  },
  {
    title: "How to Repot Your First Indoor Plant",
    excerpt: "Step-by-step repotting guide for beginners with tool recommendations.",
    coverUrl: img("photo-1459411550354-09e94960a59f"),
    publishedAt: "2026-03-15",
    readMinutes: 5,
    category: "Buying Guide",
    viewCount: 2900,
    likeCount: 198,
    shareCount: 45,
  },
  {
    title: "Balcony Garden Setup on a Budget",
    excerpt: "Create a thriving balcony garden with under ৳3,000 starter investment.",
    coverUrl: img("photo-1490759847868-88e44862c798"),
    publishedAt: "2026-02-28",
    readMinutes: 7,
    category: "Maintenance Tips",
    viewCount: 5100,
    likeCount: 401,
    shareCount: 112,
    isEditorsPick: true,
  },
  {
    title: "Understanding Soil Mix for Tropical Plants",
    excerpt: "Why drainage matters and how to choose the right potting mix in BD climate.",
    coverUrl: img("photo-1501004318641-b39e6831c78a"),
    publishedAt: "2026-01-18",
    readMinutes: 9,
    category: "Industry Insights",
    viewCount: 2100,
    likeCount: 156,
    shareCount: 38,
  },
  {
    title: "Winter Care for Outdoor Saplings",
    excerpt: "Protect young fruit trees and ornamentals during cooler months.",
    coverUrl: img("photo-1502082553048-f009c37129b9"),
    publishedAt: "2025-12-05",
    readMinutes: 6,
    category: "Seasonal",
    viewCount: 1800,
    likeCount: 134,
    shareCount: 29,
  },
];

export const MOCK_SHOP_ARTICLES: Record<string, PublicShopArticle[]> = {};

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
  const count = 2 + (i % 4);
  MOCK_SHOP_ARTICLES[slug] = ARTICLE_TEMPLATES.slice(0, count).map((a, j) => ({
    ...a,
    id: `${slug}-article-${j + 1}`,
    slug: `${slug}-article-${j + 1}`,
    viewCount: a.viewCount + i * 300,
  }));
});
