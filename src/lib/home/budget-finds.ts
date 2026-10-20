/** Minimum cards to show the home budget row (P-034). */
export const BUDGET_FINDS_MIN_DISPLAY = 4;

/** Max cards rendered in the budget row after dedupe. */
export const BUDGET_FINDS_DISPLAY_CAP = 8;

export function excludePlantIds<T extends { id: string }>(
  plants: T[],
  excludeIds: Set<string>,
  max = BUDGET_FINDS_DISPLAY_CAP,
): T[] {
  const out: T[] = [];
  for (const plant of plants) {
    if (excludeIds.has(plant.id)) continue;
    out.push(plant);
    if (out.length >= max) break;
  }
  return out;
}
