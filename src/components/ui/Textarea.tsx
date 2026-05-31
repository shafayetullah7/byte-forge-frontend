import { JSX, splitProps, Show, createUniqueId, createMemo } from "solid-js";

export interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea(props: TextareaProps) {
  const [local, others] = splitProps(props, ["label", "error", "class", "required", "maxLength"]);

  const textareaId = createUniqueId();

  const charCount = createMemo(() => {
    const val = props.value ?? "";
    return local.maxLength ? `${String(val).length}/${local.maxLength}` : "";
  });

  const isNearLimit = createMemo(() => {
    const val = props.value ?? "";
    return local.maxLength ? (Number(local.maxLength) - String(val).length) <= 10 : false;
  });

  const hasCounter = createMemo(() => !!local.maxLength);

  const baseStyles =
    "w-full px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat disabled:opacity-50 disabled:cursor-not-allowed text-sm bg-white dark:bg-forest-900/30 resize-none";

  const counterStyles = "absolute right-3 bottom-2.5 text-xs select-none pointer-events-none";

  const stateStyles = local.error
    ? "border-red-500 active:border-red-600"
    : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600 focus:border-forest-500 dark:focus:border-forest-400";

  const textareaClass = hasCounter()
    ? `${baseStyles} ${stateStyles} pr-20 ${local.class || ""}`
    : `${baseStyles} ${stateStyles} ${local.class || ""}`;

  const handleInput = (e: InputEvent) => {
    const target = e.target as HTMLTextAreaElement;
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
      handler(e as InputEvent & { currentTarget: HTMLTextAreaElement; target: HTMLTextAreaElement; });
    }
  };

  const errorId = `${textareaId}-error`;

  return (
    <div class="w-full">
      <Show when={local.label}>
        <label for={textareaId} class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          {local.label}
          <Show when={local.required}>
            <span class="text-red-500 ml-1">*</span>
          </Show>
        </label>
      </Show>
      <div class="relative">
        <textarea
          id={textareaId}
          class={textareaClass}
          {...others}
          onInput={onInputHandler}
          aria-invalid={!!local.error}
          aria-describedby={local.error ? errorId : undefined}
        />
        <Show when={hasCounter()}>
          <span class={`${counterStyles} ${isNearLimit() ? "text-amber-600 dark:text-amber-400" : "text-gray-400 dark:text-gray-500"}`}>
            {charCount()}
          </span>
        </Show>
      </div>
      <Show when={local.error}>
        <p id={errorId} class="mt-1 text-xs text-red-600 dark:text-red-400 font-medium" role="alert">
          {local.error}
        </p>
      </Show>
    </div>
  );
}
