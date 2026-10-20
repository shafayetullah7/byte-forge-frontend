import { dict as enDict } from "~/i18n/en";
import { dict as bnDict } from "~/i18n/bn";

type Locale = "en" | "bn";

export type ClientAuthMessageKey =
  | "logoutMissingXsrf"
  | "sessionExpiredSoft";

const dictionaries = {
  en: enDict,
  bn: bnDict,
} as const;

function readLocaleFromCookieHeader(cookieHeader: string): Locale {
  const match = cookieHeader.match(/(?:^|;\s*)locale=([^;]*)/);
  const raw = match?.[1] ? decodeURIComponent(match[1]) : "";
  return raw === "bn" ? "bn" : "en";
}

/** Resolve auth toast copy without Solid i18n context (cookie locale). */
export function resolveClientAuthMessage(
  key: ClientAuthMessageKey,
  cookieHeader?: string,
): string {
  const header =
    cookieHeader ??
    (typeof document !== "undefined" ? document.cookie : "");
  const locale = readLocaleFromCookieHeader(header);
  return dictionaries[locale].auth[key];
}
