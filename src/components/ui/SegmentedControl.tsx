import { For, Show, Component } from "solid-js";

export interface SegmentedControlOption<T extends string> {
    value: T;
    label: string;
    icon?: Component<{ class?: string }>;
}

interface SegmentedControlProps<T extends string> {
    options: SegmentedControlOption<T>[];
    value: T;
    onChange: (value: T) => void;
    class?: string;
    size?: "sm" | "md";
    fullWidth?: boolean;
}

export default function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
    return (
        <div
            class={`flex items-center bg-cream-100 dark:bg-forest-900/40 rounded-lg p-1 border border-cream-200 dark:border-forest-700 ${props.class || ""
                }`}
        >
            <For each={props.options}>
                {(option) => {
                    const isActive = () => props.value === option.value;

                    return (
                        <button
                            onClick={() => !isActive() && props.onChange(option.value)}
                            class={`flex items-center justify-center gap-1.5 rounded-md font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-forest-500/30 focus-visible:ring-offset-1 focus-visible:ring-offset-cream-100 dark:focus-visible:ring-offset-forest-900/40 ${props.fullWidth ? "flex-1" : ""
                                } ${props.size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs sm:text-sm"
                                } ${isActive()
                                    ? "bg-white dark:bg-forest-600 text-forest-700 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                    : "text-forest-700/60 dark:text-cream-100/60 hover:text-forest-700 dark:hover:text-cream-100"
                                }`}
                            aria-pressed={isActive()}
                            type="button"
                        >
                            <Show when={option.icon}>
                                {(IconAccessor) => {
                                    const IconComponent = IconAccessor();
                                    return <IconComponent class="w-4 h-4" />;
                                }}
                            </Show>
                            <span>{option.label}</span>
                        </button>
                    );
                }}
            </For>
        </div>
    );
}
