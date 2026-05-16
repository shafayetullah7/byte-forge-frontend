import { SproutIcon, LeafIcon, DropletIcon, CubeIcon } from "~/components/icons";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";

const plantCategories = [
  {
    title: "Indoor Plants",
    description: "Low-maintenance beauties for your home",
    count: "120+",
    icon: SproutIcon,
    color: "forest",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b30b77?w=400&h=300&fit=crop",
  },
  {
    title: "Rare & Exotic",
    description: "Collectible specimens for enthusiasts",
    count: "85+",
    icon: LeafIcon,
    color: "sage",
    image: "https://images.unsplash.com/photo-1463320726281-696a4859787d?w=400&h=300&fit=crop",
  },
  {
    title: "Succulents & Cacti",
    description: "Drought-friendly, endlessly charming",
    count: "200+",
    icon: DropletIcon,
    color: "terracotta",
    image: "https://images.unsplash.com/photo-1509423350716-97f936044a00?w=400&h=300&fit=crop",
  },
  {
    title: "Pots & Planters",
    description: "The perfect home for every plant",
    count: "150+",
    icon: CubeIcon,
    color: "cream",
    image: "https://images.unsplash.com/photo-1491147334523-76d5e6616330?w=400&h=300&fit=crop",
  },
];

const colorMap: Record<string, { bg: string; text: string; border: string; badge: string }> = {
  forest: {
    bg: "bg-forest-50 dark:bg-forest-900/30",
    text: "text-forest-700 dark:text-forest-300",
    border: "border-forest-200 dark:border-forest-700",
    badge: "bg-forest-100 text-forest-700 dark:bg-forest-800 dark:text-forest-300",
  },
  sage: {
    bg: "bg-sage-50 dark:bg-sage-900/30",
    text: "text-sage-700 dark:text-sage-300",
    border: "border-sage-200 dark:border-sage-700",
    badge: "bg-sage-100 text-sage-700 dark:bg-sage-800 dark:text-sage-300",
  },
  terracotta: {
    bg: "bg-terracotta-50 dark:bg-terracotta-900/30",
    text: "text-terracotta-700 dark:text-terracotta-300",
    border: "border-terracotta-200 dark:border-terracotta-700",
    badge: "bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-800 dark:text-terracotta-300",
  },
  cream: {
    bg: "bg-cream-50 dark:bg-cream-900/30",
    text: "text-cream-800 dark:text-cream-300",
    border: "border-cream-200 dark:border-cream-700",
    badge: "bg-cream-100 text-cream-800 dark:bg-cream-800 dark:text-cream-300",
  },
};

export function FeaturedPlants() {
  const { t } = useI18n();

  return (
    <section class="py-24 px-4 bg-white dark:bg-forest-900/50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
            {t("landing.categories.label")}
          </span>
          <h2 class="h2 mt-3 mb-4">{t("landing.categories.title")}</h2>
          <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.categories.description")}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {plantCategories.map((category) => {
            const colors = colorMap[category.color];
            const Icon = category.icon;

            return (
              <div class={`flat-card flat-card-hover overflow-hidden group ${colors.bg}`}>
                <div class="relative h-48 overflow-hidden">
                  <img
                    src={category.image}
                    alt={category.title}
                    class="w-full h-full object-cover group-hover:scale-110 transition-standard duration-500"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div class="absolute bottom-4 left-4">
                    <span class={`body-small ${colors.badge} px-3 py-1 rounded-full font-semibold`}>
                      {category.count} {t("landing.categories.items")}
                    </span>
                  </div>
                </div>

                <div class="p-6">
                  <div class="flex items-center gap-3 mb-3">
                    <div class={`w-10 h-10 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                      <Icon class={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <h3 class="h5 mb-0">{category.title}</h3>
                  </div>
                  <p class="body-small text-gray-600 dark:text-gray-400 mb-4">
                    {category.description}
                  </p>
                  <LinkButton
                    href="/plants"
                    variant="outline"
                    size="sm"
                    class="w-full"
                  >
                    {t("landing.categories.browse")} →
                  </LinkButton>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
