import { Show, type JSX } from "solid-js";
import { useI18n } from "~/i18n";
import {
  fieldError,
  fieldHint,
  fieldLabelClass,
  fieldOptionalMark,
  fieldRequiredMark,
  type FieldSize,
} from "./field-styles";

export type FieldRequirement = "required" | "optional" | "requiredForReview";

export function FieldGroup(props: {
  label: string;
  requirement?: FieldRequirement;
  /** @deprecated Use `requirement="required"` instead. */
  required?: boolean;
  hint?: string;
  error?: string;
  size?: FieldSize;
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
      <label class={fieldLabelClass(props.size ?? "md")}>
        {props.label}
        <Show when={requirement() === "required"}>
          <span class={fieldRequiredMark}>*</span>
        </Show>
        <Show when={requirement() === "optional"}>
          <span class={fieldOptionalMark}>({t("common.optional")})</span>
        </Show>
        <Show when={requirement() === "requiredForReview"}>
          <span class={fieldOptionalMark}>({t("common.requiredForReview")})</span>
        </Show>
      </label>
      {props.children}
      <Show when={props.error}>
        <p class={fieldError}>{props.error}</p>
      </Show>
      <Show when={props.hint && !props.error}>
        <p class={fieldHint}>{props.hint}</p>
      </Show>
    </div>
  );
}
