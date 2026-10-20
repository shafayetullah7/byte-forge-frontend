import { A } from "@solidjs/router";
import {
  ShieldCheckIcon,
  CheckCircleIcon,
  ClipboardListIcon,
  ChatBubbleLeftRightIcon,
} from "~/components/icons";
import { useI18n } from "~/i18n";
import {
  HOME_ANALYTICS_SECTIONS,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";

type TrustItem = {
  icon: typeof ShieldCheckIcon;
  labelKey: string;
  sublabelKey: string;
  href?: string;
};

const trustItems: TrustItem[] = [
  {
    icon: ShieldCheckIcon,
    labelKey: "landing.trust.items.verified.label",
    sublabelKey: "landing.trust.items.verified.sublabel",
  },
  {
    icon: CheckCircleIcon,
    labelKey: "landing.trust.items.cod.label",
    sublabelKey: "landing.trust.items.cod.sublabel",
    href: "/help/cod",
  },
  {
    icon: ClipboardListIcon,
    labelKey: "landing.trust.items.orders.label",
    sublabelKey: "landing.trust.items.orders.sublabel",
  },
  {
    icon: ChatBubbleLeftRightIcon,
    labelKey: "landing.trust.items.reviews.label",
    sublabelKey: "landing.trust.items.reviews.sublabel",
  },
];

export function TrustBar() {
  const { t } = useI18n();

  return (
    <section
      class="bg-cream-50 dark:bg-forest-900 border-b border-cream-200 dark:border-forest-700"
      {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.trust_bar)}
    >
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trustItems.map((item) => {
            const Icon = item.icon;
            const content = (
              <>
                <div class="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-800 flex items-center justify-center flex-shrink-0">
                  <Icon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                </div>
                <div>
                  <div class="body-small font-semibold text-forest-900 dark:text-white">
                    {t(item.labelKey)}
                  </div>
                  <div class="body-small text-gray-500 dark:text-gray-400">
                    {t(item.sublabelKey)}
                  </div>
                </div>
              </>
            );

            return (
              <div class="flex items-center gap-3 justify-center md:justify-start">
                {item.href ? (
                  <A
                    href={item.href}
                    class="flex items-center gap-3 hover:opacity-90 transition-standard focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 rounded-lg"
                  >
                    {content}
                  </A>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
