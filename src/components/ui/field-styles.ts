/**
 * Shared form-field class tokens.
 *
 * Visual baseline is `Input` (`px-4 py-2.5`, `text-sm`, `border-2`, forest focus).
 * Phase 1+ components should import these instead of repeating Tailwind strings.
 *
 * @see docs/FORM_FIELD_UNIFORMITY_PLAN.md
 */

export type FieldSize = "md" | "sm";

/** Default page-form label: 14px, not a heading. Never use `h6` on labels. */
export const fieldLabel =
  "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5";

/** Compact surfaces (toolbars, ship panel, inventory). */
export const fieldLabelSm =
  "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1";

/** Default control chrome without border color (pair with idle or error). */
export const fieldControl =
  "w-full px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed text-sm bg-white dark:bg-forest-900/30";

export const fieldControlSm =
  "w-full px-3 py-2 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed text-sm bg-white dark:bg-forest-900/30";

export const fieldControlIdle =
  "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600 focus:border-forest-500 dark:focus:border-forest-400";

export const fieldControlError =
  "border-red-500 active:border-red-600";

/** Open dropdown trigger (same weight as focus). */
export const fieldControlOpen =
  "border-forest-500 dark:border-forest-400";

export const fieldError =
  "mt-1 text-xs text-red-600 dark:text-red-400 font-medium";

export const fieldHint = "mt-1 text-xs text-gray-500 dark:text-gray-400";

export const fieldRequiredMark = "text-red-500 ml-1";

export const fieldOptionalMark =
  "text-gray-400 dark:text-gray-500 font-normal ml-1";

export const fieldCounter =
  "absolute right-3 top-1/2 -translate-y-1/2 text-xs select-none pointer-events-none";

export const fieldCounterWarn = "text-amber-600 dark:text-amber-400";

export const fieldCounterIdle = "text-gray-400 dark:text-gray-500";

/** Vertical rhythm between fields on a page form. */
export const fieldStack = "space-y-5";

export function fieldControlClass(options?: {
  size?: FieldSize;
  error?: boolean;
  open?: boolean;
  class?: string;
}): string {
  const size = options?.size === "sm" ? fieldControlSm : fieldControl;
  const state = options?.error
    ? fieldControlError
    : options?.open
      ? fieldControlOpen
      : fieldControlIdle;
  return [size, state, options?.class].filter(Boolean).join(" ");
}

export function fieldLabelClass(size: FieldSize = "md"): string {
  return size === "sm" ? fieldLabelSm : fieldLabel;
}
