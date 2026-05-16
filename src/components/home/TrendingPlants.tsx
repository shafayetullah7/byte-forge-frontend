import { createSignal } from "solid-js";
import { HeartIcon, StarIcon, EyeIcon, TagIcon } from "~/components/icons";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";

const trendingPlants = [
  {
    name: "Monstera Deliciosa",
    shopName: "Green Haven Nursery",
    price: "৳850",
    originalPrice: "৳1,200",
    rating: 4.9,
    reviews: 128,
    views: "2.4k",
    image: "https://images.unsplash.com/photo-1614594975570-32d8c594f222?w=400&h=400&fit=crop",
    badge: "HOT",
    hasDiscount: true,
  },
  {
    name: "Philodendron Birkin",
    shopName: "Sylhet Plant House",
    price: "৳1,500",
    originalPrice: null,
    rating: 4.8,
    reviews: 89,
    views: "1.8k",
    image: "https://images.unsplash.com/photo-1463320726281-696a4859787d?w=400&h=400&fit=crop",
    badge: "NEW",
    hasDiscount: false,
  },
  {
    name: "Fiddle Leaf Fig",
    shopName: "Dhaka Garden Center",
    price: "৳2,200",
    originalPrice: "৳2,800",
    rating: 4.7,
    reviews: 67,
    views: "1.5k",
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=400&h=400&fit=crop",
    badge: null,
    hasDiscount: true,
  },
  {
    name: "String of Pearls",
    shopName: "Chittagong Cacti Co.",
    price: "৳450",
    originalPrice: null,
    rating: 4.9,
    reviews: 203,
    views: "3.1k",
    image: "https://images.unsplash.com/photo-1509423350716-97f936044a00?w=400&h=400&fit=crop",
    badge: "TOP RATED",
    hasDiscount: false,
  },
  {
    name: "Pink Princess Philodendron",
    shopName: "Green Haven Nursery",
    price: "৳3,500",
    originalPrice: "৳4,200",
    rating: 5.0,
    reviews: 45,
    views: "980",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b30b77?w=400&h=400&fit=crop",
    badge: "RARE",
    hasDiscount: true,
  },
  {
    name: "Snake Plant Laurentii",
    shopName: "Rajshahi Greens",
    price: "৳600",
    originalPrice: null,
    rating: 4.8,
    reviews: 156,
    views: "2.1k",
    image: "https://images.unsplash.com/photo-1491147334523-76d5e6616330?w=400&h=400&fit=crop",
    badge: null,
    hasDiscount: false,
  },
];

const tabs = [
  { key: "trending" as const, label: "Trending", icon: EyeIcon },
  { key: "new" as const, label: "New Arrivals", icon: TagIcon },
  { key: "loved" as const, label: "Most Loved", icon: HeartIcon },
];

const badgeColors: Record<string, string> = {
  HOT: "bg-terracotta-500 text-white",
  NEW: "bg-forest-500 text-white",
  "TOP RATED": "bg-amber-500 text-white",
  RARE: "bg-purple-500 text-white",
};

export function TrendingPlants() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = createSignal<"trending" | "new" | "loved">("trending");

  return (
    <section class="py-24 px-4 bg-white dark:bg-forest-900/50">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
              {t("landing.trending.label")}
            </span>
            <h2 class="h2 mb-0 mt-2">{t("landing.trending.title")}</h2>
          </div>

          {/* Tab Switcher */}
          <div class="inline-flex items-center gap-1 bg-cream-100 dark:bg-forest-800 rounded-full p-1 mt-4 sm:mt-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  onClick={() => setActiveTab(tab.key)}
                  class={`flex items-center gap-1.5 px-4 py-2 rounded-full body-small font-semibold transition-standard ${
                    activeTab() === tab.key
                      ? "bg-white dark:bg-forest-700 text-forest-700 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400"
                  }`}
                >
                  <Icon class="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Plant Cards */}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPlants.map((plant) => (
            <div class="flat-card flat-card-hover overflow-hidden group">
              <div class="relative h-56 overflow-hidden">
                <img
                  src={plant.image}
                  alt={plant.name}
                  class="w-full h-full object-cover group-hover:scale-110 transition-standard duration-500"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                {/* Badges */}
                {plant.badge && (
                  <div class={`absolute top-3 left-3 px-2.5 py-1 rounded-md body-small font-bold ${badgeColors[plant.badge]}`}>
                    {plant.badge}
                  </div>
                )}

                {plant.hasDiscount && (
                  <div class="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-1 rounded-md body-small font-bold">
                    SALE
                  </div>
                )}

                {/* Shop Name */}
                <div class="absolute bottom-3 left-3">
                  <span class="body-small text-white/90 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    {plant.shopName}
                  </span>
                </div>
              </div>

              <div class="p-5">
                <h3 class="h5 mb-1">{plant.name}</h3>

                {/* Rating + Views */}
                <div class="flex items-center gap-3 mb-4">
                  <div class="flex items-center gap-1">
                    <StarIcon class="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span class="body-small font-semibold">{plant.rating}</span>
                    <span class="body-small text-gray-500">({plant.reviews})</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <EyeIcon class="w-4 h-4 text-gray-400" />
                    <span class="body-small text-gray-500">{plant.views} views</span>
                  </div>
                </div>

                {/* Price */}
                <div class="flex items-center gap-2 mb-4">
                  <span class="h4 text-forest-700 dark:text-forest-400">{plant.price}</span>
                  {plant.originalPrice && (
                    <span class="body-small text-gray-400 line-through">{plant.originalPrice}</span>
                  )}
                </div>

                <LinkButton href="/plants" variant="outline" size="sm" class="w-full">
                  {t("landing.trending.viewDetails")} →
                </LinkButton>
              </div>
            </div>
          ))}
        </div>

        <div class="text-center mt-12">
          <LinkButton href="/plants" variant="primary" size="lg">
            {t("landing.trending.browseAll")}
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
