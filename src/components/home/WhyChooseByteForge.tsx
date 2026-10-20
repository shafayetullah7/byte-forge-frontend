import {
  ShieldCheckIcon,
  GlobeAltIcon,
  SparklesIcon,
  TrendingUpIcon,
  TagIcon,
  HeartIcon,
} from "~/components/icons";
import { useI18n } from "~/i18n";
import {
  HOME_ANALYTICS_SECTIONS,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";

const features = [
  { icon: ShieldCheckIcon, id: "verified" },
  { icon: GlobeAltIcon, id: "bilingual" },
  { icon: SparklesIcon, id: "profiles" },
  { icon: TrendingUpIcon, id: "sellerTools" },
  { icon: TagIcon, id: "categories" },
  { icon: HeartIcon, id: "community" },
] as const;

export function WhyChooseByteForge() {
  const { t } = useI18n();

  return (
    <section
      class="py-24 px-4 bg-white dark:bg-forest-900/50"
      {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.why_byte_forge)}
    >
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

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            const titleKey = `landing.whyChoose.features.${feature.id}.title`;
            const descriptionKey = `landing.whyChoose.features.${feature.id}.description`;

            return (
              <div class="flat-card p-8">
                <div class="w-14 h-14 rounded-2xl bg-forest-100 dark:bg-forest-800 flex items-center justify-center mb-6">
                  <Icon class="w-7 h-7 text-forest-600 dark:text-forest-400" />
                </div>
                <h3 class="h5 mb-3">{t(titleKey)}</h3>
                <p class="body-small text-gray-600 dark:text-gray-400">{t(descriptionKey)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
