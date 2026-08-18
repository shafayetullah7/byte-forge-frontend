import type { Component, JSX } from "solid-js";
import { fieldControlClass, type FieldSize } from "~/components/ui";

interface CurrencyInputProps {
  value: string;
  placeholder?: string;
  onInput: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
  onBlur?: JSX.FocusEventHandler<HTMLInputElement, FocusEvent>;
  disabled?: boolean;
  size?: FieldSize;
  class?: string;
  max?: number;
}

export const CurrencyInput: Component<CurrencyInputProps> = (props) => {
  const size = () => props.size ?? "md";
  const maxVal = () => props.max ?? 999999.99;
  return (
    <div class={size() === "sm" ? "relative flex-1" : "relative"}>
      <span
        class={`absolute top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm ${
          size() === "sm" ? "left-2.5" : "left-3"
        }`}
      >
        ৳
      </span>
      <input
        type="number"
        step="0.01"
        min="0"
        max={maxVal()}
        placeholder={props.placeholder}
        value={props.value}
        onInput={props.onInput}
        onBlur={props.onBlur}
        disabled={props.disabled}
        class={fieldControlClass({
          size: size(),
          class: `${size() === "sm" ? "!pl-6 !pr-2" : "!pl-7 !pr-3"} ${props.class || ""}`,
        })}
      />
    </div>
  );
};
