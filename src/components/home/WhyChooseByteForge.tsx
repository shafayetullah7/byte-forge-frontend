import { ShieldCheckIcon, GlobeAltIcon, SparklesIcon, TrendingUpIcon, TagIcon, HeartIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

const features = [
  {
    icon: ShieldCheckIcon,
    title: "Verified Sellers",
    description: "Every shop is verified with trade licenses, ensuring authenticity and quality",
  },
  {
    icon: GlobeAltIcon,
    title: "Bilingual Experience",
    description: "Full support for English and Bengali — browse, shop, and manage in your language",
  },
  {
    icon: SparklesIcon,
    title: "Rich Plant Profiles",
    description: "Detailed care guides, growth stages, and variant attributes for every plant",
  },
  {
    icon: TrendingUpIcon,
    title: "Grow Your Business",
    description: "Powerful seller tools — inventory tracking, analytics, and multi-variant support",
  },
  {
    icon: TagIcon,
    title: "Smart Categorization",
    description: "Hierarchical categories and tags make discovery effortless for buyers",
  },
  {
    icon: HeartIcon,
    title: "Community Driven",
    description: "Reviews, ratings, and verified purchases build trust across the marketplace",
  },
];

export function WhyChooseByteForge() {
  const { t } = useI18n();

  return (
    <section class="py-24 px-4 bg-white dark:bg-forest-900/50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
            {t("landing.whyChoose.label")}
          </span>
          <h2 class="h2 mt-3 mb-4">{t("landing.whyChoose.title")}</h2>
          <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.whyChoose.description")}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div class="flat-card flat-card-hover p-8 group">
                <div class="w-14 h-14 rounded-2xl bg-forest-100 dark:bg-forest-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-standard">
                  <Icon class="w-7 h-7 text-forest-600 dark:text-forest-400" />
                </div>

                <h3 class="h5 mb-3">{feature.title}</h3>
                <p class="body-small text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
