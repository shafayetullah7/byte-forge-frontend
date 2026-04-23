import { JSX, splitProps, Show } from "solid-js";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

// Simple unique ID generator for label-input association
let inputIdCounter = 0;
function generateInputId(): string {
  return `input-${++inputIdCounter}`;
}

export default function Input(props: InputProps) {
  const [local, others] = splitProps(props, ["label", "error", "class"]);
  
  // Generate unique ID for label-input association
  const inputId = generateInputId();

  // Base styles
  const baseStyles =
    "w-full px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed body-base bg-white dark:bg-forest-900/30";

  // State styles
  const stateStyles = local.error
    ? "border-red-500 active:border-red-600"
    : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600 focus:border-forest-500 dark:focus:border-forest-400";

  const classes = `${baseStyles} ${stateStyles} ${local.class || ""}`;

  return (
    <div class="w-full">
      <Show when={local.label}>
        <label for={inputId} class="block body-small font-semibold mb-2">
          {local.label}
        </label>
      </Show>
      <input id={inputId} class={classes} {...others} />
      <Show when={local.error}>
        <p class="mt-1 body-small text-red-600 dark:text-red-400 font-semibold">{local.error}</p>
      </Show>
    </div>
  );
}
