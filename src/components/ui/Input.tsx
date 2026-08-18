import { JSX, splitProps, Show, createUniqueId, createMemo } from "solid-js";
import {
  fieldControlClass,
  fieldCounter,
  fieldCounterIdle,
  fieldCounterWarn,
  fieldError,
  fieldLabelClass,
  fieldRequiredMark,
  type FieldSize,
} from "./field-styles";

export interface InputProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  size?: FieldSize;
}

export default function Input(props: InputProps) {
  const [local, others] = splitProps(props, [
    "label",
    "error",
    "class",
    "required",
    "maxLength",
    "size",
  ]);

  const inputId = createUniqueId();
  const size = () => local.size ?? "md";

  const charCount = createMemo(() => {
    const val = props.value ?? "";
    return local.maxLength ? `${String(val).length}/${local.maxLength}` : "";
  });

  const isNearLimit = createMemo(() => {
    const val = props.value ?? "";
    return local.maxLength ? (Number(local.maxLength) - String(val).length) <= 10 : false;
  });

  const hasCounter = createMemo(() => !!local.maxLength);

  const inputClass = () =>
    fieldControlClass({
      size: size(),
      error: !!local.error,
      class: `${hasCounter() ? "pr-20" : ""} ${local.class || ""}`.trim(),
    });

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    if (local.maxLength) {
      const max = Number(local.maxLength);
      if (target.value.length > max) {
        target.value = target.value.slice(0, max);
      }
    }
  };

  const onInputHandler = (e: Event) => {
    handleInput(e as InputEvent);
    const handler = props.onInput;
    if (typeof handler === "function") {
      handler(e as InputEvent & { currentTarget: HTMLInputElement; target: HTMLInputElement });
    }
  };

  const errorId = `${inputId}-error`;

  return (
    <div class="w-full">
      <Show when={local.label}>
        <label for={inputId} class={fieldLabelClass(size())}>
          {local.label}
          <Show when={local.required}>
            <span class={fieldRequiredMark}>*</span>
          </Show>
        </label>
      </Show>
      <div class="relative">
        <input
          id={inputId}
          class={inputClass()}
          {...others}
          onInput={onInputHandler}
          aria-invalid={!!local.error}
          aria-describedby={local.error ? errorId : undefined}
        />
        <Show when={hasCounter()}>
          <span class={`${fieldCounter} ${isNearLimit() ? fieldCounterWarn : fieldCounterIdle}`}>
            {charCount()}
          </span>
        </Show>
      </div>
      <Show when={local.error}>
        <p id={errorId} class={fieldError} role="alert">
          {local.error}
        </p>
      </Show>
    </div>
  );
}
