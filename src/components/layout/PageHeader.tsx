import { Component, JSX, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { ChevronRightIcon } from "~/components/icons";

interface Breadcrumb {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    breadcrumbs?: Breadcrumb[];
    actions?: JSX.Element;
}

export const PageHeader: Component<PageHeaderProps> = (props) => {
    return (
        <div class="mb-8">
            {/* Breadcrumbs */}
            <Show when={props.breadcrumbs && props.breadcrumbs.length > 0}>
                <nav class="flex mb-4" aria-label="Breadcrumb">
                    <ol class="flex items-center space-x-2">
                        <For each={props.breadcrumbs}>
                            {(crumb, index) => (
                                <li class="flex items-center">
                                    <Show when={index() > 0}>
                                        <ChevronRightIcon class="w-4 h-4 text-gray-400 mx-2" />
                                    </Show>
                                    <Show
                                        when={crumb.href}
                                        fallback={
                                            <span class="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                {crumb.label}
                                            </span>
                                        }
                                    >
                                        <A
                                            href={crumb.href!}
                                            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
                                        >
                                            {crumb.label}
                                        </A>
                                    </Show>
                                </li>
                            )}
                        </For>
                    </ol>
                </nav>
            </Show>

            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                        {props.title}
                    </h1>
                    <Show when={props.subtitle}>
                        <p class="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-400">
                            {props.subtitle}
                        </p>
                    </Show>
                </div>
                <Show when={props.actions}>
                    <div class="flex items-center gap-3">
                        {props.actions}
                    </div>
                </Show>
            </div>
        </div>
    );
};
