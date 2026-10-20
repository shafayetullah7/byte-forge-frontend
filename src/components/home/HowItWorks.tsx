import { createMemo, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import {
  ShoppingBagIcon,
  ShopIcon,
  HeartIcon,
  PackageIcon,
  SproutIcon,
  CheckBadgeIcon,
} from "~/components/icons";
import { config } from "~/lib/config";
import { useI18n } from "~/i18n";
import {
  HOME_ANALYTICS_SECTIONS,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";

type StepDef = {
  step: string;
  icon: typeof ShoppingBagIcon;
  titleKey: string;
  descriptionKey: string;
  href?: string;
};

const buyerStepDefs: StepDef[] = [
  {
    step: "01",
    icon: ShoppingBagIcon,
    titleKey: "landing.howItWorks.buyerSteps.step01.title",
    descriptionKey: "landing.howItWorks.buyerSteps.step01.description",
    href: "/plants",
  },
  {
    step: "02",
    icon: PackageIcon,
    titleKey: "landing.howItWorks.buyerSteps.step02.title",
    descriptionKey: "landing.howItWorks.buyerSteps.step02.description",
    href: "/help/cod",
  },
  {
    step: "03",
    icon: HeartIcon,
    titleKey: "landing.howItWorks.buyerSteps.step03.title",
    descriptionKey: "landing.howItWorks.buyerSteps.step03.description",
    href: "/plants",
  },
];

const sellerStepDefs: StepDef[] = [
  {
    step: "01",
    icon: ShopIcon,
    titleKey: "landing.howItWorks.sellerSteps.step01.title",
    descriptionKey: "landing.howItWorks.sellerSteps.step01.description",
    href: config.auth.registerUrl,
  },
  {
    step: "02",
    icon: SproutIcon,
    titleKey: "landing.howItWorks.sellerSteps.step02.title",
    descriptionKey: "landing.howItWorks.sellerSteps.step02.description",
    href: "/help",
  },
  {
    step: "03",
    icon: CheckBadgeIcon,
    titleKey: "landing.howItWorks.sellerSteps.step03.title",
    descriptionKey: "landing.howItWorks.sellerSteps.step03.description",
    href: config.auth.registerUrl,
  },
];

export function HowItWorks() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = createSignal<"buyer" | "seller">("buyer");

  const steps = createMemo(() =>
    activeTab() === "buyer" ? buyerStepDefs : sellerStepDefs,
  );

  return (
    <section
      class="py-24 px-4 bg-cream-50 dark:bg-forest-950"
      {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.how_it_works)}
    >
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
            {t("landing.howItWorks.label")}
          </span>
          <h2 class="h2 mt-3 mb-4">{t("landing.howItWorks.title")}</h2>
          <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.howItWorks.description")}
          </p>

          <div class="inline-flex items-center bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-700 rounded-full p-1 mt-8">
            <button
              type="button"
              onClick={() => setActiveTab("buyer")}
              class={`px-6 py-2.5 rounded-full body-small font-semibold transition-standard ${
                activeTab() === "buyer"
                  ? "bg-forest-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400"
              }`}
            >
              {t("landing.howItWorks.buyer")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("seller")}
              class={`px-6 py-2.5 rounded-full body-small font-semibold transition-standard ${
                activeTab() === "seller"
                  ? "bg-terracotta-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-terracotta-600 dark:hover:text-terracotta-400"
              }`}
            >
              {t("landing.howItWorks.seller")}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps().map((item, index) => {
            const Icon = item.icon;
            const isLast = index < steps().length - 1;
            const isBuyer = activeTab() === "buyer";
            const title = () => t(item.titleKey);
            const description = () => t(item.descriptionKey);

            return (
              <div class="relative">
                <div class="flat-card p-8 text-center relative z-10">
                  <div
                    class={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                      isBuyer
                        ? "bg-forest-100 dark:bg-forest-800"
                        : "bg-terracotta-100 dark:bg-terracotta-800"
                    }`}
                  >
                    <Icon
                      class={`w-8 h-8 ${
                        isBuyer
                          ? "text-forest-600 dark:text-forest-400"
                          : "text-terracotta-600 dark:text-terracotta-400"
                      }`}
                    />
                  </div>

                  <span
                    class={`body-small font-bold ${
                      isBuyer
                        ? "text-forest-600 dark:text-forest-400"
                        : "text-terracotta-600 dark:text-terracotta-400"
                    }`}
                  >
                    {item.step}
                  </span>
                  {item.href ? (
                    <A
                      href={item.href}
                      class="h4 mt-2 mb-3 block hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 rounded"
                    >
                      {title()}
                    </A>
                  ) : (
                    <h3 class="h4 mt-2 mb-3">{title()}</h3>
                  )}
                  <p class="body-small text-gray-600 dark:text-gray-400">{description()}</p>
                </div>

                {isLast && (
                  <div class="hidden md:block absolute top-1/2 -right-4 w-8 border-t-2 border-dashed border-cream-300 dark:border-forest-700" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
