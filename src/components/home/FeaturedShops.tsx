import { CheckBadgeIcon, MapPinIcon, StarIcon, SparklesIcon } from "~/components/icons";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";

const featuredShops = [
  {
    name: "Green Haven Nursery",
    nameBn: "গ্রীন হেভেন নার্সারী",
    description: "Premium indoor plants and exotic species from Dhaka",
    location: "Dhaka, Bangladesh",
    rating: 4.9,
    reviewCount: 234,
    productCount: 85,
    verified: true,
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop",
    primaryColor: "#2d7a4d",
    activeCampaign: {
      title: "30% Off Indoor Plants",
      code: "MONSOON30",
    },
  },
  {
    name: "Sylhet Plant House",
    nameBn: "সিলেট প্ল্যান্ট হাউস",
    description: "Rare terrarium plants and succulents from the hills",
    location: "Sylhet, Bangladesh",
    rating: 4.8,
    reviewCount: 189,
    productCount: 62,
    verified: true,
    image: "https://images.unsplash.com/photo-1459411552884-841db9b30b77?w=400&h=250&fit=crop",
    primaryColor: "#5f8f52",
    activeCampaign: null,
  },
  {
    name: "Chittagong Cacti Co.",
    nameBn: "চট্টগ্রাম ক্যাকটাস কো.",
    description: "Specialists in cacti, succulents, and arid plants",
    location: "Chittagong, Bangladesh",
    rating: 4.7,
    reviewCount: 156,
    productCount: 120,
    verified: true,
    image: "https://images.unsplash.com/photo-1509423350716-97f936044a00?w=400&h=250&fit=crop",
    primaryColor: "#d06d48",
    activeCampaign: {
      title: "Buy 2 Get 1 Free",
      code: "B2G1SUCC",
    },
  },
];

export function FeaturedShops() {
  const { t } = useI18n();

  return (
    <section class="py-24 px-4 bg-cream-50 dark:bg-forest-950">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
            {t("landing.featuredShops.label")}
          </span>
          <h2 class="h2 mt-3 mb-4">{t("landing.featuredShops.title")}</h2>
          <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.featuredShops.description")}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredShops.map((shop) => (
            <div class="flat-card flat-card-hover overflow-hidden group">
              <div class="relative h-48 overflow-hidden">
                <img
                  src={shop.image}
                  alt={shop.name}
                  class="w-full h-full object-cover group-hover:scale-110 transition-standard duration-500"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {shop.verified && (
                  <div class="absolute top-3 right-3 bg-white dark:bg-forest-800 rounded-full p-1.5 shadow-sm">
                    <CheckBadgeIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                  </div>
                )}

                <div class="absolute bottom-3 left-3">
                  <span
                    class="w-3 h-3 rounded-full inline-block shadow-sm"
                    style={{ "background-color": shop.primaryColor }}
                  />
                </div>
              </div>

              <div class="p-6">
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <h3 class="h5 mb-0">{shop.name}</h3>
                    <p class="body-small text-gray-500 dark:text-gray-400">{shop.nameBn}</p>
                  </div>
                </div>

                {/* Active Campaign Badge */}
                {shop.activeCampaign && (
                  <div class="inline-flex items-center gap-1.5 bg-terracotta-50 dark:bg-terracotta-900/30 border border-terracotta-200 dark:border-terracotta-700 rounded-lg px-3 py-1.5 mb-3">
                    <SparklesIcon class="w-3.5 h-3.5 text-terracotta-600 dark:text-terracotta-400" />
                    <span class="body-small text-terracotta-700 dark:text-terracotta-300 font-semibold">
                      {shop.activeCampaign.title}
                    </span>
                    <span class="body-small font-mono font-bold text-terracotta-600 dark:text-terracotta-400 bg-terracotta-100 dark:bg-terracotta-800 px-1.5 py-0.5 rounded">
                      {shop.activeCampaign.code}
                    </span>
                  </div>
                )}

                <div class="flex items-center gap-1.5 mb-3">
                  <MapPinIcon class="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span class="body-small text-gray-600 dark:text-gray-400">{shop.location}</span>
                </div>

                <p class="body-small text-gray-600 dark:text-gray-400 mb-4">
                  {shop.description}
                </p>

                <div class="flex items-center gap-4 pt-4 border-t border-cream-200 dark:border-forest-700">
                  <div class="flex items-center gap-1">
                    <StarIcon class="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span class="body-small font-semibold">{shop.rating}</span>
                    <span class="body-small text-gray-500 dark:text-gray-400">({shop.reviewCount})</span>
                  </div>
                  <div class="body-small text-gray-500 dark:text-gray-400">
                    {shop.productCount} {t("landing.featuredShops.products")}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div class="text-center mt-12">
          <LinkButton href="/shops" variant="primary" size="lg">
            {t("landing.featuredShops.viewAll")} →
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
