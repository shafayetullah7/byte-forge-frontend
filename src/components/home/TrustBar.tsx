import { ShieldCheckIcon, GlobeAltIcon, HeartIcon, CheckCircleIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

const trustItems = [
  {
    icon: ShieldCheckIcon,
    label: "Verified Sellers Only",
    sublabel: "Trade license verified",
  },
  {
    icon: GlobeAltIcon,
    label: "64 Districts Delivery",
    sublabel: "Nationwide shipping",
  },
  {
    icon: HeartIcon,
    label: "Buyer Protection",
    sublabel: "Money-back guarantee",
  },
  {
    icon: CheckCircleIcon,
    label: "Secure Payments",
    sublabel: "bKash, Nagad, COD, Card",
  },
];

export function TrustBar() {
  const { t } = useI18n();

  return (
    <section class="bg-white dark:bg-forest-900 border-b border-cream-200 dark:border-forest-700">
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item) => {
            const Icon = item.icon;

            return (
              <div class="flex items-center gap-3 justify-center md:justify-start">
                <div class="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-800 flex items-center justify-center flex-shrink-0">
                  <Icon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                </div>
                <div>
                  <div class="body-small font-semibold text-forest-900 dark:text-white">{item.label}</div>
                  <div class="body-small text-gray-500 dark:text-gray-400">{item.sublabel}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
