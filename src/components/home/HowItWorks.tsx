import { createSignal } from "solid-js";
import { ShoppingBagIcon, ShopIcon, HeartIcon, PackageIcon, SproutIcon, CheckBadgeIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

const buyerSteps = [
  {
    icon: ShoppingBagIcon,
    title: "Browse & Discover",
    description: "Explore hundreds of plants from verified nurseries across Bangladesh",
    step: "01",
  },
  {
    icon: PackageIcon,
    title: "Order & Track",
    description: "Place your order and track delivery in real-time to your doorstep",
    step: "02",
  },
  {
    icon: HeartIcon,
    title: "Grow & Enjoy",
    description: "Receive healthy plants with detailed care guides to help them thrive",
    step: "03",
  },
];

const sellerSteps = [
  {
    icon: ShopIcon,
    title: "Create Your Shop",
    description: "Set up your digital nursery in minutes with our simple onboarding",
    step: "01",
  },
  {
    icon: SproutIcon,
    title: "List Your Plants",
    description: "Add plants with rich details, care guides, and beautiful photos",
    step: "02",
  },
  {
    icon: CheckBadgeIcon,
    title: "Get Verified & Sell",
    description: "Complete verification and start reaching thousands of plant lovers",
    step: "03",
  },
];

export function HowItWorks() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = createSignal<"buyer" | "seller">("buyer");

  const steps = activeTab() === "buyer" ? buyerSteps : sellerSteps;

  return (
    <section class="py-24 px-4 bg-cream-50 dark:bg-forest-950">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <span class="body-small text-terracotta-600 dark:text-terracotta-400 uppercase tracking-widest font-semibold">
            {t("landing.howItWorks.label")}
          </span>
          <h2 class="h2 mt-3 mb-4">{t("landing.howItWorks.title")}</h2>
          <p class="body-large text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t("landing.howItWorks.description")}
          </p>

          {/* Tab Switcher */}
          <div class="inline-flex items-center bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-700 rounded-full p-1 mt-8">
            <button
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

        {/* Steps */}
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((item, index) => {
            const Icon = item.icon;
            const isLast = index < steps.length - 1;
            const isBuyer = activeTab() === "buyer";

            return (
              <div class="relative">
                <div class="flat-card p-8 text-center relative z-10">
                  <div class={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                    isBuyer
                      ? "bg-forest-100 dark:bg-forest-800"
                      : "bg-terracotta-100 dark:bg-terracotta-800"
                  }`}>
                    <Icon class={`w-8 h-8 ${
                      isBuyer
                        ? "text-forest-600 dark:text-forest-400"
                        : "text-terracotta-600 dark:text-terracotta-400"
                    }`} />
                  </div>

                  <span class={`body-small font-bold ${
                    isBuyer
                      ? "text-forest-600 dark:text-forest-400"
                      : "text-terracotta-600 dark:text-terracotta-400"
                  }`}>
                    {item.step}
                  </span>
                  <h3 class="h4 mt-2 mb-3">{item.title}</h3>
                  <p class="body-small text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>

                {/* Connector Line */}
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
