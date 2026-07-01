import { Show, type JSX } from "solid-js";

export function FieldGroup(props: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: JSX.Element;
}) {
  return (
    <div>
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {props.label}
        <Show when={props.required}>
          <span class="text-red-500 ml-1">*</span>
        </Show>
      </label>
      {props.children}
      <Show when={props.error}>
        <p class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium">{props.error}</p>
      </Show>
      <Show when={props.hint && !props.error}>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{props.hint}</p>
      </Show>
    </div>
  );
}
