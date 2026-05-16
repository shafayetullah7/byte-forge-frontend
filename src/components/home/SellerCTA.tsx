import { A } from "@solidjs/router";
import { ShopIcon, TrendingUpIcon, CheckIcon } from "~/components/icons";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";

const sellerBenefits = [
  "Free shop creation — no monthly fees to get started",
  "Inventory management with stock tracking & alerts",
  "Bilingual product listings (English + Bengali)",
  "Detailed analytics & sales reporting",
  "Multi-variant support for different sizes & forms",
  "Verified badge builds buyer trust",
];

export function SellerCTA() {
  const { t } = useI18n();

  return (
    <section class="py-24 px-4 bg-cream-50 dark:bg-forest-950">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div>
            <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
              {t("landing.sellerCTA.label")}
            </span>
            <h2 class="h2 mt-3 mb-4">{t("landing.sellerCTA.title")}</h2>
            <p class="body-large text-gray-600 dark:text-gray-400 mb-8">
              {t("landing.sellerCTA.description")}
            </p>

            <div class="space-y-4 mb-10">
              {sellerBenefits.map((benefit) => (
                <div class="flex items-start gap-3">
                  <div class="w-6 h-6 rounded-full bg-sage-100 dark:bg-sage-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon class="w-4 h-4 text-sage-600 dark:text-sage-400" />
                  </div>
                  <span class="body-base text-gray-700 dark:text-gray-300">{benefit}</span>
                </div>
              ))}
            </div>

            <div class="flex flex-col sm:flex-row gap-4">
              <LinkButton href="/auth/register" variant="primary" size="lg">
                <ShopIcon class="w-5 h-5 mr-2" />
                {t("landing.sellerCTA.startSelling")}
              </LinkButton>
              <A
                href="/about"
                class="inline-flex items-center justify-center px-8 py-3.5 border-2 border-forest-600 dark:border-forest-400 text-forest-700 dark:text-forest-300 rounded-12 font-semibold body-base hover:bg-forest-50 dark:hover:bg-forest-800/50 transition-standard"
              >
                {t("landing.sellerCTA.learnMore")}
              </A>
            </div>
          </div>

          {/* Right: Stats Card */}
          <div class="relative">
            <div class="flat-card p-10 bg-gradient-to-br from-forest-600 to-forest-800 dark:from-forest-700 dark:to-forest-900 border-0">
              <div class="text-white">
                <div class="flex items-center gap-3 mb-8">
                  <TrendingUpIcon class="w-8 h-8 text-sage-300" />
                  <h3 class="h3 text-white mb-0">{t("landing.sellerCTA.platformStats")}</h3>
                </div>

                <div class="grid grid-cols-2 gap-8">
                  <div>
                    <div class="h2 text-white mb-1">500+</div>
                    <div class="body-small text-cream-200">{t("landing.sellerCTA.verifiedShops")}</div>
                  </div>
                  <div>
                    <div class="h2 text-white mb-1">50k+</div>
                    <div class="body-small text-cream-200">{t("landing.sellerCTA.activeBuyers")}</div>
                  </div>
                  <div>
                    <div class="h2 text-white mb-1">1M+</div>
                    <div class="body-small text-cream-200">{t("landing.sellerCTA.plantsSold")}</div>
                  </div>
                  <div>
                    <div class="h2 text-white mb-1">64</div>
                    <div class="body-small text-cream-200">{t("landing.sellerCTA.districts")}</div>
                  </div>
                </div>
              </div>

              {/* Decorative dots */}
              <div class="absolute top-6 right-6 grid grid-cols-3 gap-2 opacity-20">
                {Array.from({ length: 9 }).map(() => (
                  <div class="w-2 h-2 rounded-full bg-white" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
