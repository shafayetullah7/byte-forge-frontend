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
}

export function Select(props: SelectProps) {
  const [local, rest] = splitProps(props, ["label", "options", "error", "class", "value", "id", "placeholder"]);
  const id = local.id || `select-${Math.random().toString(36).slice(2, 11)}`;
  const errorId = `${id}-error`;

  return (
    <div class="space-y-2 w-full">
      <Show when={local.label}>
        <label for={id} class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {local.label}
        </label>
      </Show>
      <select
        {...rest}
        id={id}
        value={local.value ?? ""}
        class={`block w-full px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed body-base bg-white dark:bg-forest-900/30 ${
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
        <p id={errorId} class="mt-1 body-small text-red-600 dark:text-red-400 font-semibold">
          {local.error}
        </p>
      </Show>
    </div>
  );
}
