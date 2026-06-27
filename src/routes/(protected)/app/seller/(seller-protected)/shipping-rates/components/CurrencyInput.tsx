import type { Component, JSX } from "solid-js";

interface CurrencyInputProps {
  value: string;
  placeholder?: string;
  onInput: JSX.InputEventHandler<HTMLInputElement, InputEvent>;
  onBlur?: JSX.FocusEventHandler<HTMLInputElement, FocusEvent>;
  disabled?: boolean;
  size?: "sm" | "md";
  class?: string;
  max?: number;
}

const sizeClasses = {
  sm: {
    wrapper: "relative flex-1",
    prefix: "absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm",
    input: "w-full pl-6 pr-2 py-1.5 rounded-lg border-2 text-sm",
  },
  md: {
    wrapper: "relative",
    prefix: "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm",
    input: "w-full pl-7 pr-3 py-2.5 rounded-lg border-2 text-sm",
  },
};

export const CurrencyInput: Component<CurrencyInputProps> = (props) => {
  const s = () => sizeClasses[props.size || "md"];
  const maxVal = () => props.max ?? 999999.99;
  return (
    <div class={s().wrapper}>
      <span class={s().prefix}>৳</span>
      <input
        type="number" step="0.01" min="0" max={maxVal()}
        placeholder={props.placeholder}
        value={props.value}
        onInput={props.onInput}
        onBlur={props.onBlur}
        disabled={props.disabled}
        class={`${s().input} border-2 border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-900 text-forest-800 dark:text-cream-50 placeholder-gray-400 dark:placeholder-gray-500 focus:border-terracotta-500 dark:focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-500/20 transition-colors ${props.class || ""}`}
      />
    </div>
  );
};
