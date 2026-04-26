import { createSignal, createMemo, For, Show, createEffect } from "solid-js";
import { ChevronDownIcon, CheckIcon } from "~/components/icons";

export interface FilterOption {
  value: string;
  label: string;
  dotColor?: string;
}

export interface FilterSelectProps {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  class?: string;
}

export function FilterSelect(props: FilterSelectProps) {
  const [isOpen, setIsOpen] = createSignal(false);

  const selectedOption = createMemo(() =>
    props.options.find((opt) => opt.value === props.value)
  );

  const displayLabel = createMemo(() =>
    selectedOption() ? selectedOption()!.label : (props.placeholder || "Select...")
  );

  createEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-filter-select]")) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });

  return (
    <div data-filter-select class={`relative ${props.class || ""}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen())}
        class={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-standard focus-ring-flat text-left min-w-[140px] ${
          isOpen()
            ? "border-forest-500 dark:border-forest-400"
            : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600"
        } bg-white dark:bg-forest-900/30`}
      >
        <Show when={selectedOption()?.dotColor}>
          {(color) => (
            <div class={`w-2 h-2 rounded-full flex-shrink-0 ${color()}`} />
          )}
        </Show>
        <span class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {displayLabel()}
        </span>
        <ChevronDownIcon class={`w-4 h-4 text-gray-400 ml-auto flex-shrink-0 transition-transform ${isOpen() ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      <Show when={isOpen()}>
        <div class="absolute z-50 mt-2 bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden min-w-full">
          <div class="p-1.5">
            <For each={props.options}>
              {(option) => {
                const isSelected = props.value === option.value;
                return (
                  <button
                    type="button"
                    onClick={() => {
                      props.onChange(option.value);
                      setIsOpen(false);
                    }}
                    class={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${
                      isSelected
                        ? "bg-forest-50 dark:bg-forest-900/40"
                        : "hover:bg-gray-50 dark:hover:bg-forest-700"
                    }`}
                  >
                    <Show when={option.dotColor}>
                      {(color) => (
                        <div class={`w-2 h-2 rounded-full flex-shrink-0 ${color()}`} />
                      )}
                    </Show>
                    <span
                      class={`font-medium flex-1 text-gray-900 dark:text-gray-100 ${
                        isSelected ? "font-semibold" : ""
                      }`}
                    >
                      {option.label}
                    </span>
                    <Show when={isSelected}>
                      <CheckIcon class="w-4 h-4 text-forest-600 dark:text-sage-400 flex-shrink-0" />
                    </Show>
                  </button>
                );
              }}
            </For>
          </div>
        </div>
      </Show>
    </div>
  );
}
