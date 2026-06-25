import { config } from "../config";

export const SEO_TITLE_SUFFIX = "Byte Forge";

export function formatPageTitle(pageTitle: string): string {
  return `${pageTitle} — ${SEO_TITLE_SUFFIX}`;
}

export function getSiteOrigin(): string {
  if (config.siteUrl) return config.siteUrl;
  if (!config.isServer && typeof window !== "undefined") {
    return window.location.origin;
  }
  return "https://byteforge.com.bd";
}

export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${getSiteOrigin()}${normalized}`;
}

export interface HreflangAlternate {
  lang: string;
  href: string;
}

export function hreflangAlternates(path: string): HreflangAlternate[] {
  const url = absoluteUrl(path);
  return [
    { lang: "en", href: url },
    { lang: "bn", href: url },
    { lang: "x-default", href: url },
  ];
}
