import { For, Show, Component } from "solid-js";

export interface SegmentedControlOption {
    value: string;
    label: string;
    icon?: Component<{ class?: string }>;
}

interface SegmentedControlProps {
    options: SegmentedControlOption[];
    value: string;
    onChange: (value: string) => void;
    class?: string;
    size?: "sm" | "md";
}

export default function SegmentedControl(props: SegmentedControlProps) {
    return (
        <div
            class={`flex items-center bg-gray-100 dark:bg-forest-700/50 rounded-lg p-1 border border-gray-200 dark:border-forest-700 ${props.class || ""
                }`}
        >
            <For each={props.options}>
                {(option) => {
                    const isActive = () => props.value === option.value;

                    return (
                        <button
                            onClick={() => !isActive() && props.onChange(option.value)}
                            class={`flex items-center justify-center gap-1.5 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-1 focus:ring-offset-gray-100 dark:focus:ring-offset-gray-800 ${props.size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-xs sm:text-sm"
                                } ${isActive()
                                    ? "bg-white dark:bg-forest-600 text-forest-700 dark:text-white shadow-sm ring-1 ring-black/5 dark:ring-white/10"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
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
