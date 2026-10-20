import { A } from "@solidjs/router";
import { SproutIcon, MapPinIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
import { buildPlantsFilterHref } from "~/lib/plants/plants-url";
import {
  HOME_ANALYTICS_SECTIONS,
  homeSectionAttrs,
} from "~/lib/analytics/home-analytics";

const footerSections = [
  {
    headerKey: "landing.footer.marketplace",
    links: [
      { labelKey: "landing.footer.links.browsePlants", href: "/plants" },
      { labelKey: "landing.footer.links.allShops", href: "/shops" },
      {
        labelKey: "landing.footer.links.inStockPlants",
        href: buildPlantsFilterHref({ inStockOnly: true }),
      },
    ],
  },
  {
    headerKey: "landing.footer.sellers",
    links: [
      { labelKey: "landing.footer.links.startSelling", href: config.auth.registerUrl },
      { labelKey: "landing.footer.links.sellerGuide", href: "/help" },
      { labelKey: "landing.footer.links.sellerHelp", href: "/help" },
    ],
  },
  {
    headerKey: "landing.footer.company",
    links: [
      { labelKey: "landing.footer.links.about", href: "/help" },
      { labelKey: "landing.footer.links.privacy", href: "/legal/privacy" },
      { labelKey: "landing.footer.links.terms", href: "/legal/terms" },
    ],
  },
  {
    headerKey: "landing.footer.support",
    links: [
      { labelKey: "landing.footer.links.helpCenter", href: "/help" },
      { labelKey: "landing.footer.links.contact", href: "/help" },
      { labelKey: "landing.footer.links.shipping", href: "/help/shipping-and-returns" },
      { labelKey: "landing.footer.links.cod", href: "/help/cod" },
    ],
  },
] as const;

export function Footer() {
  const { t } = useI18n();

  return (
    <footer
      class="bg-forest-900 dark:bg-forest-950 text-cream-100"
      {...homeSectionAttrs(HOME_ANALYTICS_SECTIONS.footer)}
    >
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          <div class="lg:col-span-2">
            <A
              href="/"
              class="h4 flex items-center gap-2 text-white hover:text-forest-300 transition-standard mb-4"
            >
              ByteForge
              <span class="w-2 h-2 bg-terracotta-500 rounded-full" />
            </A>
            <p class="body-small text-cream-300 leading-relaxed mb-6 max-w-sm">
              {t("landing.footer.brandBlurb")}
            </p>

            <div class="space-y-3">
              <A
                href="/help"
                class="body-small text-cream-300 hover:text-white transition-standard block"
              >
                {t("landing.footer.contactHelp")}
              </A>
              <div class="flex items-start gap-3">
                <MapPinIcon class="w-4 h-4 text-forest-400 flex-shrink-0 mt-0.5" />
                <span class="body-small text-cream-300">{t("landing.footer.contactLocation")}</span>
              </div>
            </div>
          </div>

          {footerSections.map((section) => (
            <div>
              <h4 class="h6 text-white mb-4">{t(section.headerKey)}</h4>
              <ul class="space-y-3">
                {section.links.map((link) => (
                  <li>
                    <A
                      href={link.href}
                      class="body-small text-cream-300 hover:text-white transition-standard"
                    >
                      {t(link.labelKey)}
                    </A>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div class="border-t border-forest-700">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="body-small text-cream-400">
              © 2026 ByteForge. {t("landing.footer.rights")}
            </p>
            <div class="flex items-center gap-2">
              <SproutIcon class="w-4 h-4 text-forest-400" />
              <span class="body-small text-cream-400">{t("landing.footer.madeWith")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
