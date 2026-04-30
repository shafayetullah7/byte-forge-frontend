import { For, JSX, Show, splitProps } from "solid-js";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
  required?: boolean;
}

export function Select(props: SelectProps) {
  const [local, rest] = splitProps(props, ["label", "options", "error", "class", "value", "id", "placeholder", "required"]);
  // SSR-safe: derive ID from label text (deterministic, no Math.random)
  const labelId = local.label ? local.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") : "select";
  const id = local.id || `select-${labelId}`;
  const errorId = `${id}-error`;

  return (
    <div class="space-y-2 w-full">
      <Show when={local.label}>
        <label for={id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {local.label}
          <Show when={local.required}>
            <span class="text-red-500 ml-1">*</span>
          </Show>
        </label>
      </Show>
      <select
        {...rest}
        id={id}
        value={local.value ?? ""}
        class={`block w-full px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed text-sm bg-white dark:bg-forest-900/30 ${
          local.error
            ? "border-red-500 active:border-red-600"
            : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600 focus:border-forest-500 dark:focus:border-forest-400"
        } ${local.class || ""}`}
      >
        <option value="" disabled>
          {local.placeholder || "Select an option"}
        </option>
        <For each={local.options}>
          {(option) => <option value={option.value}>{option.label}</option>}
        </For>
      </select>
      <Show when={local.error}>
        <p id={errorId} class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">
          {local.error}
        </p>
      </Show>
    </div>
  );
}
