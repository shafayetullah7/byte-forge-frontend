import { Component, JSX, Show } from "solid-js";

interface EmptyStateProps {
    title: string;
    description?: string;
    icon?: JSX.Element;
    action?: JSX.Element;
    class?: string;
}

export const EmptyState: Component<EmptyStateProps> = (props) => {
    return (
        <div class={`flex flex-col items-center justify-center py-12 px-4 text-center ${props.class || ""}`}>
            <div class="bg-gray-50 dark:bg-forest-800 rounded-full p-4 mb-4">
                <Show
                    when={props.icon}
                    fallback={
                        <svg class="w-8 h-8 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                    }
                >
                    {props.icon}
                </Show>
            </div>

            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-1">
                {props.title}
            </h3>

            <Show when={props.description}>
                <p class="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                    {props.description}
                </p>
            </Show>

            <Show when={props.action}>
                {props.action}
            </Show>
        </div>
    );
};
