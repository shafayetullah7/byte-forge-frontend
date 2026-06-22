import type {
  PublicShopListItem,
  PublicShopProfile,
  PublicShopBadge,
} from "~/lib/types/public/shops.types";

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

export const MOCK_SHOP_CATEGORIES = [
  "Indoor Plants",
  "Outdoor & Garden",
  "Nursery & Saplings",
  "Bonsai & Ornamental",
  "Herbs & Vegetables",
] as const;

function baseMetrics(overrides: Partial<PublicShopListItem["metrics"]>) {
  return {
    totalProducts: 24,
    completedOrders: 320,
    averageRating: 4.6,
    reviewCount: 89,
    followerCount: 1200,
    deliverySuccessRate: 97,
    responseRate: 94,
    cancellationRate: 2.1,
    memberSince: "2024-03-15",
    campaignsRun: 8,
    campaignParticipants: 2400,
    blogCount: 6,
    buyerSatisfactionScore: 4.7,
    ...overrides,
  };
}

export const MOCK_SHOP_LIST: PublicShopListItem[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    slug: "green-haven-nursery",
    name: "Green Haven Nursery",
    tagline: "Dhaka's trusted home for indoor greenery",
    description:
      "Family-run nursery specializing in low-maintenance indoor plants, ceramic pots, and personalized care advice for urban homes.",
    category: "Indoor Plants",
    division: "Dhaka",
    city: "Gulshan",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#2D6A4F",
    logo: { id: "logo-1", url: img("photo-1416879595882-3373a0480b0b") },
    banner: { id: "banner-1", url: img("photo-1466692476866-aef1dfb1e01f") },
    createdAt: "2023-06-10T08:00:00.000Z",
    metrics: baseMetrics({
      totalProducts: 48,
      completedOrders: 2840,
      averageRating: 4.8,
      reviewCount: 412,
      followerCount: 8900,
      campaignsRun: 24,
      campaignParticipants: 12000,
      blogCount: 18,
      buyerSatisfactionScore: 4.9,
    }),
    engagementScore: 94,
    featuredProductPreviews: [
      { id: "p1", slug: "monstera-deliciosa", name: "Monstera Deliciosa", thumbnailUrl: img("photo-1614594975525-e45190c55d0c"), price: 1850 },
      { id: "p2", slug: "snake-plant", name: "Snake Plant", thumbnailUrl: img("photo-1593482892261-0ff27397f870"), price: 750 },
      { id: "p3", slug: "peace-lily", name: "Peace Lily", thumbnailUrl: img("photo-1593691509543-c55fb32e98ca"), price: 920 },
    ],
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    slug: "aponika-garden-center",
    name: "Aponika Garden Center",
    tagline: "From balcony herbs to backyard orchards",
    description:
      "Verified agro marketplace partner offering seasonal saplings, organic fertilizers, and expert-guided plant bundles for Bangladeshi growers.",
    category: "Outdoor & Garden",
    division: "Chattogram",
    city: "Panchlaish",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#40916C",
    logo: { id: "logo-2", url: img("photo-1501004318641-b39e6831c78a") },
    banner: { id: "banner-2", url: img("photo-1416339306562-f3d12fefd36e") },
    createdAt: "2023-11-22T10:30:00.000Z",
    metrics: baseMetrics({
      totalProducts: 62,
      completedOrders: 1950,
      averageRating: 4.7,
      reviewCount: 278,
      followerCount: 6200,
      campaignsRun: 18,
      campaignParticipants: 8500,
      blogCount: 14,
    }),
    engagementScore: 88,
    featuredProductPreviews: [
      { id: "p4", slug: "mango-sapling", name: "Amrapali Mango Sapling", thumbnailUrl: img("photo-1605027990120-9a52420f3d69"), price: 450 },
      { id: "p5", slug: "tomato-seedling", name: "Hybrid Tomato Seedling", thumbnailUrl: img("photo-1592419041756-53bdfa1df29a"), price: 35 },
    ],
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    slug: "leaf-and-root",
    name: "Leaf & Root",
    tagline: "Curated plants for modern apartments",
    description:
      "Boutique plant studio focused on aesthetic indoor collections, self-watering pots, and beginner-friendly care kits.",
    category: "Indoor Plants",
    division: "Dhaka",
    city: "Banani",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#1B4332",
    logo: { id: "logo-3", url: img("photo-1463936575829-25148e1db1b8") },
    banner: { id: "banner-3", url: img("photo-1459411550354-09e94960a59f") },
    createdAt: "2024-01-08T14:00:00.000Z",
    metrics: baseMetrics({
      totalProducts: 31,
      completedOrders: 890,
      averageRating: 4.9,
      reviewCount: 156,
      followerCount: 4100,
      responseRate: 98,
      campaignsRun: 12,
      blogCount: 9,
    }),
    engagementScore: 91,
    featuredProductPreviews: [
      { id: "p6", slug: "fiddle-leaf-fig", name: "Fiddle Leaf Fig", thumbnailUrl: img("photo-1509423350710-849f661848c0"), price: 3200 },
      { id: "p7", slug: "zz-plant", name: "ZZ Plant", thumbnailUrl: img("photo-1632207691143-643e2a9a9361"), price: 1100 },
    ],
  },
  {
    id: "d4e5f6a7-b8c9-0123-def0-234567890123",
    slug: "sylhet-hills-nursery",
    name: "Sylhet Hills Nursery",
    tagline: "Highland-grown natives & fruit trees",
    description:
      "Mountain nursery shipping hardy outdoor species, tea garden ornamentals, and citrus saplings nationwide with COD-friendly packaging.",
    category: "Nursery & Saplings",
    division: "Sylhet",
    city: "Zindabazar",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#52796F",
    logo: { id: "logo-4", url: img("photo-1585320806297-9794b7933b8c") },
    banner: { id: "banner-4", url: img("photo-1502082553048-f009c37129b9") },
    createdAt: "2022-09-01T06:00:00.000Z",
    metrics: baseMetrics({
      totalProducts: 55,
      completedOrders: 3420,
      averageRating: 4.6,
      reviewCount: 521,
      followerCount: 11200,
      deliverySuccessRate: 96,
      campaignsRun: 30,
      campaignParticipants: 15000,
      blogCount: 22,
      memberSince: "2022-09-01",
    }),
    engagementScore: 86,
    featuredProductPreviews: [
      { id: "p8", slug: "lemon-tree", name: "Lemon Tree Sapling", thumbnailUrl: img("photo-1515589664695-8ce324637051"), price: 680 },
    ],
  },
  {
    id: "e5f6a7b8-c9d0-1234-ef01-345678901234",
    slug: "bonsai-house-dhaka",
    name: "Bonsai House Dhaka",
    tagline: "Miniature trees, maximum artistry",
    description:
      "Specialist bonsai studio with trained specimens, workshops, and premium tools for collectors across Bangladesh.",
    category: "Bonsai & Ornamental",
    division: "Dhaka",
    city: "Dhanmondi",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#344E41",
    logo: { id: "logo-5", url: img("photo-1509937528035-c750e94f2565") },
    banner: { id: "banner-5", url: img("photo-1542601906990-b4d3fb778b09") },
    createdAt: "2024-04-18T09:00:00.000Z",
    metrics: baseMetrics({
      totalProducts: 18,
      completedOrders: 420,
      averageRating: 4.9,
      reviewCount: 98,
      followerCount: 2800,
      responseRate: 99,
      campaignsRun: 6,
      blogCount: 11,
    }),
    engagementScore: 82,
    featuredProductPreviews: [
      { id: "p9", slug: "ficus-bonsai", name: "Ficus Bonsai", thumbnailUrl: img("photo-1592158840-933886b0d5a3"), price: 4500 },
    ],
  },
  {
    id: "f6a7b8c9-d0e1-2345-f012-456789012345",
    slug: "krishi-khamar-plants",
    name: "Krishi Khamar Plants",
    tagline: "Farm-fresh herbs for every kitchen garden",
    description:
      "Herb and vegetable starter plants for rooftop and courtyard growers, with seasonal growing calendars in Bangla and English.",
    category: "Herbs & Vegetables",
    division: "Rajshahi",
    city: "Boalia",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#588157",
    logo: { id: "logo-6", url: img("photo-1464226184884-fa280b87c399") },
    banner: { id: "banner-6", url: img("photo-1530836369253-7daaa600a4d0") },
    createdAt: "2024-02-14T11:00:00.000Z",
    metrics: baseMetrics({
      totalProducts: 36,
      completedOrders: 1120,
      averageRating: 4.5,
      reviewCount: 187,
      followerCount: 3500,
      campaignsRun: 10,
      blogCount: 8,
    }),
    engagementScore: 79,
    featuredProductPreviews: [
      { id: "p10", slug: "coriander-bundle", name: "Coriander Starter Bundle", thumbnailUrl: img("photo-1622206151226-18ca2c9ab4a1"), price: 120 },
    ],
  },
  {
    id: "a7b8c9d0-e1f2-3456-0123-567890123456",
    slug: "urban-jungle-bd",
    name: "Urban Jungle BD",
    tagline: "Turn your workspace into a green oasis",
    description:
      "Corporate and home office plant programs with maintenance guides, bulk office bundles, and fast Dhaka delivery.",
    category: "Indoor Plants",
    division: "Dhaka",
    city: "Uttara",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#386641",
    logo: { id: "logo-7", url: img("photo-1485955900006-10f4d324d621") },
    banner: { id: "banner-7", url: img("photo-1490759847868-88e44862c798") },
    createdAt: "2023-08-30T07:00:00.000Z",
    metrics: baseMetrics({
      totalProducts: 42,
      completedOrders: 1680,
      averageRating: 4.7,
      reviewCount: 245,
      followerCount: 5400,
      campaignsRun: 15,
      blogCount: 7,
    }),
    engagementScore: 85,
    featuredProductPreviews: [
      { id: "p11", slug: "pothos-golden", name: "Golden Pothos", thumbnailUrl: img("photo-1614594975525-e45190c55d0c"), price: 480 },
    ],
  },
  {
    id: "b8c9d0e1-f2a3-4567-1234-678901234567",
    slug: "chattogram-tropicals",
    name: "Chattogram Tropicals",
    tagline: "Coastal climate plants that thrive",
    description:
      "Tropical ornamentals and palms selected for humid southern regions, with humidity-care tips for new plant parents.",
    category: "Outdoor & Garden",
    division: "Chattogram",
    city: "Agrabad",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#2D6A4F",
    logo: { id: "logo-8", url: img("photo-1502082553048-f009c37129b9") },
    banner: { id: "banner-8", url: img("photo-1501004318641-b39e6831c78a") },
    createdAt: "2024-06-01T12:00:00.000Z",
    metrics: baseMetrics({
      totalProducts: 27,
      completedOrders: 540,
      averageRating: 4.4,
      reviewCount: 72,
      followerCount: 1900,
      campaignsRun: 5,
      blogCount: 4,
      cancellationRate: 3.2,
    }),
    engagementScore: 74,
    featuredProductPreviews: [
      { id: "p12", slug: "areca-palm", name: "Areca Palm", thumbnailUrl: img("photo-1509423350710-849f661848c0"), price: 1450 },
    ],
  },
  {
    id: "c9d0e1f2-a3b4-5678-2345-789012345678",
    slug: "rising-sprouts",
    name: "Rising Sprouts",
    tagline: "New shop, outstanding service",
    description:
      "Fresh entrant focused on affordable starter plants for first-time buyers, with video care guides and responsive chat support.",
    category: "Indoor Plants",
    division: "Dhaka",
    city: "Mirpur",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#52B788",
    logo: { id: "logo-9", url: img("photo-1466692476866-aef1dfb1e01f") },
    banner: { id: "banner-9", url: img("photo-1459411550354-09e94960a59f") },
    createdAt: "2025-10-01T08:00:00.000Z",
    metrics: baseMetrics({
      totalProducts: 15,
      completedOrders: 180,
      averageRating: 4.8,
      reviewCount: 42,
      followerCount: 890,
      campaignsRun: 3,
      blogCount: 2,
      memberSince: "2025-10-01",
    }),
    engagementScore: 77,
    featuredProductPreviews: [
      { id: "p13", slug: "aloe-vera", name: "Aloe Vera", thumbnailUrl: img("photo-1509423350710-849f661848c0"), price: 280 },
    ],
  },
  {
    id: "d0e1f2a3-b4c5-6789-3456-890123456789",
    slug: "verdant-veranda",
    name: "Verdant Veranda",
    tagline: "Balcony gardens made simple",
    description:
      "Compact plants, railing planters, and vertical garden kits designed for apartment balconies across metro areas.",
    category: "Outdoor & Garden",
    division: "Dhaka",
    city: "Mohammadpur",
    isVerified: true,
    status: "ACTIVE",
    primaryColor: "#40916C",
    logo: { id: "logo-10", url: img("photo-1416879595882-3373a0480b0b") },
    banner: { id: "banner-10", url: img("photo-1463936575829-25148e1db1b8") },
    createdAt: "2024-07-20T10:00:00.000Z",
    metrics: baseMetrics({
      totalProducts: 33,
      completedOrders: 760,
      averageRating: 4.6,
      reviewCount: 134,
      followerCount: 3200,
      campaignsRun: 9,
      blogCount: 6,
    }),
    engagementScore: 80,
    featuredProductPreviews: [
      { id: "p14", slug: "petunia-mix", name: "Petunia Mix Pack", thumbnailUrl: img("photo-1490759847868-88e44862c798"), price: 220 },
    ],
  },
];

const PROFILE_EXTRAS: Record<
  string,
  Omit<PublicShopProfile, keyof PublicShopListItem>
> = {
  "green-haven-nursery": {
    about:
      "Green Haven Nursery has helped thousands of Dhaka households bring nature indoors since 2018. We hand-select every plant for Bangladesh's climate and provide bilingual care support.",
    sellerStory:
      "Started on a rooftop in Gulshan, we grew through word-of-mouth and now operate a full nursery team dedicated to healthy, pest-free plants.",
    brandMission:
      "Make indoor gardening accessible, affordable, and joyful for every home in Bangladesh.",
    categoriesServed: ["Indoor Plants", "Desk Plants", "Air-Purifying Plants", "Gift Plants"],
    whyChooseUs: [
      "Verified nursery with 2,800+ completed COD orders",
      "Live plant health guarantee on delivery",
      "Free care consultation for first-time buyers",
    ],
    values: ["Quality", "Transparency", "Sustainability", "Customer Education"],
    badges: [
      "TOP_SELLER",
      "HIGHLY_RATED",
      "TRUSTED_SHOP",
      "CAMPAIGN_CHAMPION",
    ] as PublicShopBadge[],
  },
};

function defaultProfileExtras(slug: string): Omit<PublicShopProfile, keyof PublicShopListItem> {
  const shop = MOCK_SHOP_LIST.find((s) => s.slug === slug);
  return (
    PROFILE_EXTRAS[slug] ?? {
      about: shop?.description ?? "",
      sellerStory: `Founded with a passion for plants, ${shop?.name ?? "this shop"} serves buyers across ${shop?.division ?? "Bangladesh"} with care and consistency.`,
      brandMission: "Grow trust through healthy plants and honest service.",
      categoriesServed: [shop?.category ?? "Plants"],
      whyChooseUs: [
        "Verified seller on Byte Forge",
        "COD-friendly nationwide delivery",
        "Responsive customer support",
      ],
      values: ["Trust", "Quality", "Community"],
      badges: ["TRUSTED_SHOP", "BUYER_FRIENDLY"] as PublicShopBadge[],
    }
  );
}

export function getMockShopProfiles(): PublicShopProfile[] {
  return MOCK_SHOP_LIST.map((shop) => ({
    ...shop,
    ...defaultProfileExtras(shop.slug),
  }));
}

export function getMockShopProfileBySlug(slug: string): PublicShopProfile | undefined {
  const shop = MOCK_SHOP_LIST.find((s) => s.slug === slug);
  if (!shop) return undefined;
  return { ...shop, ...defaultProfileExtras(slug) };
}
