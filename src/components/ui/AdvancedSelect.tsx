import { createSignal, createMemo, Show, For, onMount, onCleanup, splitProps } from "solid-js";
import { isServer } from "solid-js/web";
import { Portal } from "solid-js/web";

export interface AdvancedSelectOption {
  value: string;
  label: string;
}

export interface AdvancedSelectProps {
  label?: string;
  options: AdvancedSelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  error?: string;
  disabled?: boolean;
  class?: string;
  allowClear?: boolean;
}

export function AdvancedSelect(props: AdvancedSelectProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const [search, setSearch] = createSignal("");
  let containerRef: HTMLDivElement | undefined;
  let inputRef: HTMLInputElement | undefined;

  const selectedOption = createMemo(() =>
    props.options.find(opt => opt.value === props.value)
  );

  const filteredOptions = createMemo(() => {
    const query = search().toLowerCase();
    if (!query) return props.options;
    return props.options.filter(opt =>
      opt.label.toLowerCase().includes(query)
    );
  });

  const handleClickOutside = (e: MouseEvent) => {
    if (containerRef && !containerRef.contains(e.target as Node)) {
      setIsOpen(false);
    }
  };

  onMount(() => {
    if (!isServer) {
      document.addEventListener("mousedown", handleClickOutside);
    }
  });

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  });

  const handleToggle = () => {
    if (props.disabled) return;
    setIsOpen(!isOpen());
    if (isOpen()) {
      setSearch("");
      setTimeout(() => inputRef?.focus(), 0);
    }
  };

  const handleSelect = (value: string) => {
    props.onChange(value);
    setIsOpen(false);
  };

  const handleClear = (e: MouseEvent) => {
    e.stopPropagation();
    props.onChange(null);
  };

  return (
    <div class={`relative space-y-1.5 w-full ${props.class || ""}`} ref={containerRef}>
      <Show when={props.label}>
        <label class="block h6">
          {props.label}
        </label>
      </Show>

      <div
        onClick={handleToggle}
        class={`flex items-center justify-between w-full h-[46px] px-4 py-2.5 body-base bg-white dark:bg-forest-900/30 border-2 rounded-lg cursor-pointer transition-standard focus-ring-flat
          ${isOpen() ? "border-forest-500 dark:border-forest-400" : "border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600"}
          ${props.disabled ? "bg-cream-50 dark:bg-forest-800 cursor-not-allowed opacity-50" : ""}
          ${props.error ? "border-red-500 focus:border-red-600" : ""}
        `}
      >
        <div class="flex-1 truncate">
          <Show
            when={selectedOption()}
            fallback={<span class="text-gray-400 dark:text-gray-500">{props.placeholder || "Select an option..."}</span>}
          >
            {(opt) => (
              <div class="flex items-center gap-2">
                <span class="text-gray-900 dark:text-gray-100">{opt().label}</span>
              </div>
            )}
          </Show>
        </div>

        <div class="flex items-center gap-2 ml-2">
          <Show when={props.allowClear && props.value}>
            <button
              onClick={handleClear}
              class="p-1 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-forest-700 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </Show>
          <svg
            class={`w-4 h-4 text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen() ? "rotate-180" : ""}`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
      </div>

      <Show when={props.error}>
        <p class="mt-1 body-small text-red-600 dark:text-red-400 font-semibold">{props.error}</p>
      </Show>

      <Show when={isOpen()}>
        <Portal>
          <div
            class="fixed z-[9999] bg-white dark:bg-forest-800 border-2 border-cream-200 dark:border-forest-600 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            style={{
              width: `${containerRef?.offsetWidth}px`,
              top: `${(containerRef?.getBoundingClientRect().bottom || 0) + 6}px`,
              left: `${containerRef?.getBoundingClientRect().left}px`,
              "max-height": "320px"
            }}
          >
            {/* Search Area */}
            <div class="p-2 border-b border-cream-100 dark:border-forest-700 sticky top-0 bg-white dark:bg-forest-800">
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 dark:text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                  </svg>
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  class="w-full pl-9 pr-3 py-2 body-base bg-cream-50 dark:bg-forest-900/50 border-none rounded-lg focus:ring-2 focus:ring-forest-500 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                  placeholder={props.searchPlaceholder || "Search..."}
                  value={search()}
                  onInput={(e) => setSearch(e.currentTarget.value)}
                  autofocus
                />
              </div>
            </div>

            {/* Options List */}
            <div class="overflow-y-auto max-h-[250px] p-1.5 scrollbar-thin scrollbar-thumb-cream-200 dark:scrollbar-thumb-forest-600">
              <For each={filteredOptions()} fallback={
                <div class="px-4 py-8 text-center body-small text-gray-400 dark:text-gray-500 italic">
                  {props.emptyMessage || "No options found"}
                </div>
              }>
                {(option) => (
                  <div
                    onClick={() => handleSelect(option.value)}
                    class={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer body-base transition-all
                      ${option.value === props.value
                        ? "bg-forest-50 dark:bg-forest-900/50 text-forest-700 dark:text-sage-400 font-semibold"
                        : "text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700 hover:pl-4"}
                    `}
                  >
                    <div class="flex-1 truncate">
                      {option.label}
                    </div>
                    <Show when={option.value === props.value}>
                      <svg class="w-4 h-4 text-forest-600 dark:text-sage-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </Show>
                  </div>
                )}
              </For>
            </div>
          </div>
        </Portal>
      </Show>
    </div>
  );
}
