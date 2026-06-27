export function translationFor<T extends { locale: string }>(
  items: T[] | undefined,
  locale: string,
  fallbackLocale = "en",
): T | undefined {
  if (!items?.length) return undefined;
  return (
    items.find((tr) => tr.locale === locale)
    ?? items.find((tr) => tr.locale === fallbackLocale)
    ?? items[0]
  );
}

export function translationField(
  items: { locale: string }[] | undefined,
  locale: string,
  field: string,
  fallbackLocale = "en",
): string {
  const row = translationFor(items, locale, fallbackLocale) as Record<string, unknown> | undefined;
  const value = row?.[field];
  return typeof value === "string" && value.length > 0 ? value : "";
}
