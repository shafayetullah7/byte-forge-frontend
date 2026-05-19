export function translateEnum(
  t: (key: string) => string,
  category: string,
  value: string | null | undefined
): string {
  if (!value) return "";
  return t(`public.plants.variant.${category}Values.${value}`) || value;
}
