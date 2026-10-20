export type NavPrimaryLink = {
  href: string;
  labelKey: "landing.nav.categories" | "landing.nav.nurseries" | "landing.nav.offers";
  /** Hide when campaigns feature flag is off */
  requiresCampaigns?: boolean;
};

export const NAV_PRIMARY_LINKS: readonly NavPrimaryLink[] = [
  { href: "/plants", labelKey: "landing.nav.categories" },
  { href: "/shops", labelKey: "landing.nav.nurseries" },
  { href: "/offers", labelKey: "landing.nav.offers", requiresCampaigns: true },
];

/** Shown in mobile drawer only (desktop uses logo for home). */
export type NavMobileOnlyLink = {
  href: string;
  labelKey: "common.home";
  end?: boolean;
};

export const NAV_MOBILE_ONLY_LINKS: readonly NavMobileOnlyLink[] = [
  { href: "/", labelKey: "common.home", end: true },
];

export const NAV_DESKTOP_LINK_CLASS =
  "text-forest-700 dark:text-gray-300 font-semibold body-small hover:text-terracotta-500 dark:hover:text-terracotta-300 transition-standard whitespace-nowrap";

export const NAV_DESKTOP_ACTIVE_CLASS =
  "text-terracotta-600 dark:text-terracotta-400 font-bold";

export const NAV_MOBILE_LINK_CLASS =
  "px-4 py-3 body-small font-semibold text-forest-700 dark:text-gray-300 hover:bg-terracotta-50/50 dark:hover:bg-terracotta-900/30 transition-colors duration-200";

export const NAV_MOBILE_ACTIVE_CLASS =
  "text-terracotta-600 dark:text-terracotta-400 font-bold bg-terracotta-50/30 dark:bg-terracotta-900/40";
