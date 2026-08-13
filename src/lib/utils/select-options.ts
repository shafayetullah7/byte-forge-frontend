import type { SelectOption } from "~/components/ui/Select";

export function labelFromOptions(
  options: SelectOption[],
  value: string | undefined | null,
): string {
  if (!value) return "";
  return options.find((o) => o.value === value)?.label ?? value;
}
