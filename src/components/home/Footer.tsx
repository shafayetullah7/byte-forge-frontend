import { A } from "@solidjs/router";
import { SproutIcon, EnvelopeIcon, PhoneIcon, MapPinIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";

const footerLinks = {
  marketplace: [
    { label: "Browse Plants", href: "/plants" },
    { label: "All Shops", href: "/shops" },
    { label: "New Arrivals", href: "/plants" },
    { label: "Best Sellers", href: "/plants" },
  ],
  sellers: [
    { label: "Start Selling", href: config.auth.registerUrl },
    { label: "Seller Guide", href: "/help" },
    { label: "Pricing", href: "/help" },
    { label: "Success Stories", href: "/help" },
  ],
  company: [
    { label: "About Us", href: "/help" },
    { label: "Careers", href: "/help" },
    { label: "Privacy Policy", href: "/legal/privacy" },
    { label: "Terms of Service", href: "/legal/terms" },
  ],
  support: [
    { label: "Help Center", href: "/help" },
    { label: "Contact Us", href: "/help" },
    { label: "Shipping Info", href: "/help/shipping-and-returns" },
    { label: "COD Policy", href: "/help/cod" },
  ],
};

export function Footer() {
  const { t } = useI18n();

  return (
    <footer class="bg-forest-900 dark:bg-forest-950 text-cream-100">
      {/* Main Footer */}
      <div class="max-w-7xl mx-auto px-4 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div class="lg:col-span-2">
            <A href="/" class="h4 flex items-center gap-2 text-white hover:text-forest-300 transition-standard mb-4">
              ByteForge
              <span class="w-2 h-2 bg-terracotta-500 rounded-full" />
            </A>
            <p class="body-small text-cream-300 leading-relaxed mb-6 max-w-sm">
              Bangladesh's premier marketplace for plants. Connect with verified nurseries, discover rare species, and grow your green world.
            </p>

            {/* Contact Info */}
            <div class="space-y-3">
              <div class="flex items-center gap-3">
                <EnvelopeIcon class="w-4 h-4 text-forest-400 flex-shrink-0" />
                <span class="body-small text-cream-300">hello@byteforge.com.bd</span>
              </div>
              <div class="flex items-center gap-3">
                <PhoneIcon class="w-4 h-4 text-forest-400 flex-shrink-0" />
                <span class="body-small text-cream-300">+880 1XXX-XXXXXX</span>
              </div>
              <div class="flex items-start gap-3">
                <MapPinIcon class="w-4 h-4 text-forest-400 flex-shrink-0 mt-0.5" />
                <span class="body-small text-cream-300">Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 class="h6 text-white mb-4">{t("landing.footer.marketplace")}</h4>
            <ul class="space-y-3">
              {footerLinks.marketplace.map((link) => (
                <li>
                  <A href={link.href} class="body-small text-cream-300 hover:text-white transition-standard">
                    {link.label}
                  </A>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 class="h6 text-white mb-4">{t("landing.footer.sellers")}</h4>
            <ul class="space-y-3">
              {footerLinks.sellers.map((link) => (
                <li>
                  <A href={link.href} class="body-small text-cream-300 hover:text-white transition-standard">
                    {link.label}
                  </A>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 class="h6 text-white mb-4">{t("landing.footer.company")}</h4>
            <ul class="space-y-3">
              {footerLinks.company.map((link) => (
                <li>
                  <A href={link.href} class="body-small text-cream-300 hover:text-white transition-standard">
                    {link.label}
                  </A>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 class="h6 text-white mb-4">{t("landing.footer.support")}</h4>
            <ul class="space-y-3">
              {footerLinks.support.map((link) => (
                <li>
                  <A href={link.href} class="body-small text-cream-300 hover:text-white transition-standard">
                    {link.label}
                  </A>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div class="border-t border-forest-700">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <div class="flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="body-small text-cream-400">
              © 2026 ByteForge. {t("landing.footer.rights")}
            </p>
            <div class="flex items-center gap-2">
              <SproutIcon class="w-4 h-4 text-forest-400" />
              <span class="body-small text-cream-400">
                {t("landing.footer.madeWith")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
