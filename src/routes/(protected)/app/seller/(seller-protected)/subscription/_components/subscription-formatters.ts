import type { Locale } from "~/i18n";

const FORMAT_LOCALE: Record<Locale, string> = {
  en: "en-BD",
  bn: "bn-BD",
};

export function formatSubscriptionDate(
  dateStr: string | null,
  locale: Locale = "en",
  emptyLabel = "—",
): string {
  if (!dateStr) return emptyLabel;
  return new Date(dateStr).toLocaleDateString(FORMAT_LOCALE[locale], {
    month: locale === "bn" ? "long" : "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatBdtAmount(
  amount: string,
  currency = "BDT",
  locale: Locale = "en",
): string {
  const numeric = Number(amount);
  if (Number.isNaN(numeric)) return `${currency} ${amount}`;
  return new Intl.NumberFormat(FORMAT_LOCALE[locale], {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numeric);
}
