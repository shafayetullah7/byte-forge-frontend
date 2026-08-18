import { For, JSX, Show, splitProps } from "solid-js";
import {
  fieldControlClass,
  fieldError,
  fieldLabelClass,
  fieldRequiredMark,
  type FieldSize,
} from "./field-styles";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  required?: boolean;
  size?: FieldSize;
}

export function Select(props: SelectProps) {
  const [local, rest] = splitProps(props, [
    "label",
    "options",
    "error",
    "class",
    "value",
    "id",
    "placeholder",
    "required",
    "size",
  ]);
  const labelId = local.label
    ? local.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
    : "select";
  const id = local.id || `select-${labelId}`;
  const errorId = `${id}-error`;
  const size = () => local.size ?? "md";

  return (
    <div class="w-full">
      <Show when={local.label}>
        <label for={id} class={fieldLabelClass(size())}>
          {local.label}
          <Show when={local.required}>
            <span class={fieldRequiredMark}>*</span>
          </Show>
        </label>
      </Show>
      <select
        {...rest}
        id={id}
        value={local.value ?? ""}
        class={fieldControlClass({
          size: size(),
          error: !!local.error,
          class: local.class,
        })}
      >
        <option value="" disabled>
          {local.placeholder || "Select an option"}
        </option>
        <For each={local.options}>
          {(option) => <option value={option.value}>{option.label}</option>}
        </For>
      </select>
      <Show when={local.error}>
        <p id={errorId} class={fieldError}>
          {local.error}
        </p>
      </Show>
    </div>
  );
}
