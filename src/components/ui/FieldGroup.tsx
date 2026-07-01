import { Show, type JSX } from "solid-js";
import { useI18n } from "~/i18n";

export type FieldRequirement = "required" | "optional" | "requiredForReview";

export function FieldGroup(props: {
  label: string;
  requirement?: FieldRequirement;
  /** @deprecated Use `requirement="required"` instead. */
  required?: boolean;
  hint?: string;
  error?: string;
  children: JSX.Element;
}) {
  const { t } = useI18n();

  const requirement = (): FieldRequirement => {
    if (props.requirement) return props.requirement;
    if (props.required) return "required";
    return "required";
  };

  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {props.label}
        <Show when={requirement() === "required"}>
          <span class="text-red-500 ml-1">*</span>
        </Show>
        <Show when={requirement() === "optional"}>
          <span class="text-gray-400 dark:text-gray-500 font-normal ml-1">
            ({t("common.optional")})
          </span>
        </Show>
        <Show when={requirement() === "requiredForReview"}>
          <span class="text-gray-400 dark:text-gray-500 font-normal ml-1">
            ({t("common.requiredForReview")})
          </span>
        </Show>
      </label>
      {props.children}
      <Show when={props.error}>
        <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{props.error}</p>
      </Show>
      <Show when={props.hint && !props.error}>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{props.hint}</p>
      </Show>
    </div>
  );
}
