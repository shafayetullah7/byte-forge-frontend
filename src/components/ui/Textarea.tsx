import { splitProps, type ParentComponent, type JSX } from "solid-js";

export interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Textarea component with consistent styling
 */
export const Textarea: ParentComponent<TextareaProps> = (props) => {
  const [local, others] = splitProps(props, ["label", "error", "helperText", "class", "children"]);

  return (
    <div class="space-y-1.5">
      {local.label && (
        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {local.label}
        </label>
      )}
      <textarea
        {...others}
        class={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-forest-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-terracotta-500 focus:border-transparent transition-colors resize-none body-small ${
          local.error
            ? "border-red-500 dark:border-red-500"
            : "border-gray-200 dark:border-gray-600"
        } ${local.class || ""}`}
      />
      {local.error && (
        <p class="text-sm text-red-600 dark:text-red-400">{local.error}</p>
      )}
      {local.helperText && !local.error && (
        <p class="text-sm text-gray-500 dark:text-gray-400">{local.helperText}</p>
      )}
    </div>
  );
};
