import { A } from "@solidjs/router";
import { createSignal } from "solid-js";
import { MagnifyingGlassIcon, ShopIcon, HeartIcon } from "~/components/icons";
import { LinkButton } from "~/components/ui";
import { useI18n } from "~/i18n";

const categoryChips = [
  "Monstera",
  "Philodendron",
  "Succulents",
  "Rare Plants",
  "Pots & Planters",
  "Fertilizers",
];

export function Hero() {
  const { t } = useI18n();
  const [searchQuery, setSearchQuery] = createSignal("");

  return (
    <div class="relative w-full min-h-[90dvh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        class="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-200 dark:opacity-70 dark:brightness-[0.8]"
        style={{ "background-image": "url('/bg-2.webp')" }}
      >
        <div class="absolute inset-0 bg-forest-900/30 dark:bg-forest-950/60 transition-colors duration-200"></div>
      </div>

      {/* Content */}
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-16">
        {/* Live Badge */}
        <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-in fade-in duration-500">
          <span class="relative flex h-2.5 w-2.5">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-terracotta-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-terracotta-500"></span>
          </span>
          <span class="body-small text-white font-medium">
            {t("landing.hero.liveBadge")}
          </span>
        </div>

        <h1 class="h1 text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {t("landing.hero.title")}
        </h1>

        <p class="body-large text-cream-100 mb-10 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          {t("landing.hero.subtitle")}
        </p>

        {/* Search Bar */}
        <div class="w-full max-w-xl mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery()}
              onInput={(e) => setSearchQuery(e.currentTarget.value)}
              placeholder={t("landing.hero.searchPlaceholder")}
              class="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-forest-800 border-2 border-transparent focus:border-forest-500 focus:outline-none body-base shadow-lg transition-standard"
            />
          </div>
        </div>

        {/* Category Chips */}
        <div class="flex flex-wrap justify-center gap-2 mb-10 animate-in fade-in duration-700 delay-200">
          {categoryChips.map((chip) => (
            <A
              href="/plants"
              class="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white body-small font-medium hover:bg-white/20 hover:border-white/40 transition-standard"
            >
              {chip}
            </A>
          ))}
        </div>

        {/* Dual CTAs */}
        <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-250">
          <LinkButton
            href="/plants"
            size="lg"
            variant="primary"
            class="w-full sm:w-auto"
          >
            <HeartIcon class="w-5 h-5 mr-2" />
            {t("landing.hero.shopNow")}
          </LinkButton>
          <LinkButton
            href="/auth/register"
            variant="outline"
            size="lg"
            class="w-full sm:w-auto !border-white/30 !text-white hover:!bg-white/10 hover:!border-white/60"
          >
            <ShopIcon class="w-5 h-5 mr-2" />
            {t("landing.hero.startSelling")}
          </LinkButton>
        </div>

        {/* Social Proof / Stats */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 border-t border-white/10 pt-10 w-full max-w-4xl animate-in fade-in duration-1000 delay-300">
          <div class="text-center group">
            <div class="h3 text-white mb-1 group-hover:scale-110 transition-standard">500+</div>
            <div class="body-small text-cream-200 uppercase tracking-widest opacity-80">{t("landing.hero.stats.verifiedShops")}</div>
          </div>
          <div class="text-center group">
            <div class="h3 text-white mb-1 group-hover:scale-110 transition-standard">50k+</div>
            <div class="body-small text-cream-200 uppercase tracking-widest opacity-80">{t("landing.hero.stats.activeBuyers")}</div>
          </div>
          <div class="text-center group">
            <div class="h3 text-white mb-1 group-hover:scale-110 transition-standard">4.9/5</div>
            <div class="body-small text-cream-200 uppercase tracking-widest opacity-80">{t("landing.hero.stats.avgRating")}</div>
          </div>
          <div class="text-center group">
            <div class="h3 text-white mb-1 group-hover:scale-110 transition-standard">64</div>
            <div class="body-small text-cream-200 uppercase tracking-widest opacity-80">{t("landing.hero.stats.districts")}</div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-1">
          <div class="w-1 h-3 bg-white/80 rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
}
