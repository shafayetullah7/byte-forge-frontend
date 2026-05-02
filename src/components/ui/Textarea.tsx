import { JSX, splitProps, Show, createUniqueId } from "solid-js";

export interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea(props: TextareaProps) {
  const [local, others] = splitProps(props, ["label", "error", "class"]);

  const textareaId = createUniqueId();

  const baseStyles =
    "w-full px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed text-sm bg-white dark:bg-forest-900/30 resize-none";

  const stateStyles = local.error
    ? "border-red-500 active:border-red-600"
    : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600 focus:border-forest-500 dark:focus:border-forest-400";

  const classes = `${baseStyles} ${stateStyles} ${local.class || ""}`;

  return (
    <div class="w-full">
      <Show when={local.label}>
        <label for={textareaId} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {local.label}
        </label>
      </Show>
      <textarea id={textareaId} class={classes} {...others} />
      <Show when={local.error}>
        <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{local.error}</p>
      </Show>
    </div>
  );
}
