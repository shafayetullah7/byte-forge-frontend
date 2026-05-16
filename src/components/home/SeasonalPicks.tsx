import { DropletIcon, SunIcon, ThermometerIcon, LeafIcon } from "~/components/icons";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";

const seasonalPlants = [
  {
    name: "Monstera Adansonii",
    description: "Thrives in humid monsoon weather. Perfect for rainy season.",
    image: "https://images.unsplash.com/photo-1614594975570-32d8c594f222?w=400&h=300&fit=crop",
    condition: "High Humidity",
    icon: DropletIcon,
    color: "forest",
  },
  {
    name: "Bird of Paradise",
    description: "Needs bright sunlight — ideal for summer months.",
    image: "https://images.unsplash.com/photo-1459411552884-841db9b30b77?w=400&h=300&fit=crop",
    condition: "Full Sun",
    icon: SunIcon,
    color: "terracotta",
  },
  {
    name: "Peace Lily",
    description: "Loves cooler winter temperatures. Blooms beautifully in winter.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop",
    condition: "Cool Weather",
    icon: ThermometerIcon,
    color: "sage",
  },
  {
    name: "Snake Plant",
    description: "Year-round survivor. Low maintenance in any season.",
    image: "https://images.unsplash.com/photo-1491147334523-76d5e6616330?w=400&h=300&fit=crop",
    condition: "All Seasons",
    icon: LeafIcon,
    color: "cream",
  },
];

const colorMap: Record<string, { bg: string; text: string; iconBg: string }> = {
  forest: {
    bg: "bg-forest-50 dark:bg-forest-900/30",
    text: "text-forest-600 dark:text-forest-400",
    iconBg: "bg-forest-100 dark:bg-forest-800",
  },
  terracotta: {
    bg: "bg-terracotta-50 dark:bg-terracotta-900/30",
    text: "text-terracotta-600 dark:text-terracotta-400",
    iconBg: "bg-terracotta-100 dark:bg-terracotta-800",
  },
  sage: {
    bg: "bg-sage-50 dark:bg-sage-900/30",
    text: "text-sage-600 dark:text-sage-400",
    iconBg: "bg-sage-100 dark:bg-sage-800",
  },
  cream: {
    bg: "bg-cream-50 dark:bg-cream-900/30",
    text: "text-cream-800 dark:text-cream-400",
    iconBg: "bg-cream-100 dark:bg-cream-800",
  },
};

export function SeasonalPicks() {
  const { t } = useI18n();

  return (
    <section class="py-24 px-4 bg-cream-50 dark:bg-forest-950">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
            {t("landing.seasonal.label")}
          </span>
          <h2 class="h2 mt-3 mb-4">{t("landing.seasonal.title")}</h2>
          <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.seasonal.description")}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {seasonalPlants.map((plant) => {
            const colors = colorMap[plant.color];
            const Icon = plant.icon;

            return (
              <div class={`flat-card flat-card-hover overflow-hidden group ${colors.bg}`}>
                <div class="relative h-44 overflow-hidden">
                  <img
                    src={plant.image}
                    alt={plant.name}
                    class="w-full h-full object-cover group-hover:scale-110 transition-standard duration-500"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>

                <div class="p-6">
                  <div class="flex items-center gap-2 mb-3">
                    <div class={`w-8 h-8 rounded-lg ${colors.iconBg} flex items-center justify-center`}>
                      <Icon class={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <span class={`body-small font-semibold ${colors.text}`}>{plant.condition}</span>
                  </div>

                  <h3 class="h5 mb-2">{plant.name}</h3>
                  <p class="body-small text-gray-600 dark:text-gray-400 mb-4">
                    {plant.description}
                  </p>

                  <LinkButton href="/plants" variant="outline" size="sm" class="w-full">
                    {t("landing.seasonal.shop")} →
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
