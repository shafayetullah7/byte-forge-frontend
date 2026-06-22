import type {
  PublicShopProduct,
  PublicShopCommunityMetrics,
} from "~/lib/types/public/shops.types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;

const PRODUCT_TEMPLATES: Omit<PublicShopProduct, "id">[] = [
  { slug: "monstera-deliciosa", name: "Monstera Deliciosa", price: 1850, compareAtPrice: 2200, thumbnailUrl: img("photo-1614594975525-e45190c55d0c"), rating: 4.8, reviewCount: 124, soldCount: 890, inStock: true, productType: "PLANT", category: "Indoor", isFeatured: true, isTrending: true },
  { slug: "snake-plant", name: "Snake Plant", price: 750, thumbnailUrl: img("photo-1593482892261-0ff27397f870"), rating: 4.7, reviewCount: 98, soldCount: 1200, inStock: true, productType: "PLANT", category: "Indoor", isFeatured: true },
  { slug: "peace-lily", name: "Peace Lily", price: 920, compareAtPrice: 1100, thumbnailUrl: img("photo-1593691509543-c55fb32e98ca"), rating: 4.6, reviewCount: 67, soldCount: 540, inStock: true, productType: "PLANT", category: "Indoor", isCampaignProduct: true },
  { slug: "fiddle-leaf-fig", name: "Fiddle Leaf Fig", price: 3200, thumbnailUrl: img("photo-1509423350710-849f661848c0"), rating: 4.9, reviewCount: 45, soldCount: 210, inStock: true, productType: "PLANT", category: "Indoor", isStaffPick: true },
  { slug: "zz-plant", name: "ZZ Plant", price: 1100, thumbnailUrl: img("photo-1632207691143-643e2a9a9361"), rating: 4.8, reviewCount: 82, soldCount: 430, inStock: true, productType: "PLANT", category: "Indoor", isTrending: true },
  { slug: "pothos-golden", name: "Golden Pothos", price: 480, thumbnailUrl: img("photo-1614594975525-e45190c55d0c"), rating: 4.5, reviewCount: 156, soldCount: 2100, inStock: true, productType: "PLANT", category: "Indoor" },
  { slug: "rubber-plant", name: "Rubber Plant", price: 1350, thumbnailUrl: img("photo-1509423350710-849f661848c0"), rating: 4.6, reviewCount: 54, soldCount: 380, inStock: true, productType: "PLANT", category: "Indoor" },
  { slug: "aloe-vera", name: "Aloe Vera", price: 280, thumbnailUrl: img("photo-1509423350710-849f661848c0"), rating: 4.4, reviewCount: 201, soldCount: 3200, inStock: true, productType: "PLANT", category: "Herbs" },
  { slug: "mango-sapling", name: "Amrapali Mango Sapling", price: 450, thumbnailUrl: img("photo-1605027990120-9a52420f3d69"), rating: 4.3, reviewCount: 38, soldCount: 620, inStock: true, productType: "PLANT", category: "Fruit Trees" },
  { slug: "areca-palm", name: "Areca Palm", price: 1450, compareAtPrice: 1700, thumbnailUrl: img("photo-1509423350710-849f661848c0"), rating: 4.5, reviewCount: 29, soldCount: 180, inStock: false, productType: "PLANT", category: "Outdoor" },
  { slug: "ficus-bonsai", name: "Ficus Bonsai", price: 4500, thumbnailUrl: img("photo-1592158840-933886b0d5a3"), rating: 4.9, reviewCount: 22, soldCount: 85, inStock: true, productType: "PLANT", category: "Bonsai", isStaffPick: true },
  { slug: "coriander-bundle", name: "Coriander Starter Bundle", price: 120, thumbnailUrl: img("photo-1622206151226-18ca2c9ab4a1"), rating: 4.2, reviewCount: 44, soldCount: 980, inStock: true, productType: "PLANT", category: "Herbs" },
  { slug: "tomato-seedling", name: "Hybrid Tomato Seedling", price: 35, thumbnailUrl: img("photo-1592419041756-53bdfa1df29a"), rating: 4.1, reviewCount: 67, soldCount: 1500, inStock: true, productType: "PLANT", category: "Vegetables" },
  { slug: "lemon-tree", name: "Lemon Tree Sapling", price: 680, thumbnailUrl: img("photo-1515589664695-8ce324637051"), rating: 4.4, reviewCount: 31, soldCount: 290, inStock: true, productType: "PLANT", category: "Fruit Trees" },
  { slug: "petunia-mix", name: "Petunia Mix Pack", price: 220, thumbnailUrl: img("photo-1490759847868-88e44862c798"), rating: 4.3, reviewCount: 19, soldCount: 340, inStock: true, productType: "PLANT", category: "Outdoor" },
  { slug: "spider-plant", name: "Spider Plant", price: 390, thumbnailUrl: img("photo-1593482892261-0ff27397f870"), rating: 4.6, reviewCount: 73, soldCount: 670, inStock: true, productType: "PLANT", category: "Indoor", isTrending: true },
  { slug: "philodendron-brasil", name: "Philodendron Brasil", price: 890, thumbnailUrl: img("photo-1614594975525-e45190c55d0c"), rating: 4.7, reviewCount: 41, soldCount: 320, inStock: true, productType: "PLANT", category: "Indoor" },
  { slug: "jade-plant", name: "Jade Plant", price: 520, thumbnailUrl: img("photo-1632207691143-643e2a9a9361"), rating: 4.5, reviewCount: 88, soldCount: 760, inStock: true, productType: "PLANT", category: "Indoor" },
];

export const MOCK_SHOP_PRODUCTS: Record<string, PublicShopProduct[]> = {};

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

SHOP_SLUGS.forEach((slug, shopIndex) => {
  const count = 15 + (shopIndex % 4) * 3;
  MOCK_SHOP_PRODUCTS[slug] = Array.from({ length: count }, (_, i) => {
    const template = PRODUCT_TEMPLATES[i % PRODUCT_TEMPLATES.length];
    return {
      ...template,
      id: `${slug}-product-${i + 1}`,
      slug: `${template.slug}-${shopIndex}`,
      name: i > 0 ? `${template.name} ${i > 5 ? "(Premium)" : ""}`.trim() : template.name,
      price: template.price + (i % 3) * 50,
    };
  });
});

export const MOCK_COMMUNITY_METRICS: Record<string, PublicShopCommunityMetrics> =
  Object.fromEntries(
    SHOP_SLUGS.map((slug, i) => [
      slug,
      {
        profileViews: 12000 + i * 3400,
        productViews: 45000 + i * 12000,
        wishlistAdds: 800 + i * 220,
        repeatBuyerPercent: 28 + (i % 5) * 4,
        campaignParticipants: 1200 + i * 800,
        articleViews: 5000 + i * 1500,
        articleLikes: 420 + i * 90,
        articleShares: 180 + i * 40,
        engagementScore: 70 + (i % 6) * 4,
      },
    ]),
  );
