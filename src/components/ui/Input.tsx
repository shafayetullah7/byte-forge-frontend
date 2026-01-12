import { JSX, splitProps, Show } from "solid-js";

export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input(props: InputProps) {
  const [local, others] = splitProps(props, ["label", "error", "class"]);

  // Base styles
  const baseStyles =
    "w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // State styles
  const stateStyles = local.error
    ? "border-red-500 focus:border-red-500 focus:ring-red-200 dark:border-red-400 dark:focus:ring-red-900"
    : "border-gray-300 focus:border-forest-500 focus:ring-forest-200 dark:border-gray-600 dark:focus:border-sage-400 dark:focus:ring-sage-900";

  const classes = `${baseStyles} ${stateStyles} ${local.class || ""}`;

  return (
    <div class="w-full">
      <Show when={local.label}>
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {local.label}
        </label>
      </Show>
      <input class={classes} {...others} />
      <Show when={local.error}>
        <p class="mt-1 text-sm text-red-600 dark:text-red-400">{local.error}</p>
      </Show>
    </div>
  );
}
