import { Component, Show, For, createMemo } from "solid-js";
import { A, useMatch } from "@solidjs/router";

export interface NavLink {
    href: string;
    icon: Component<{ class?: string }>;
    label: string;
}

export interface SidebarConfig {
    mode: "buyer" | "seller";
    brandColor: "forest" | "terracotta";
    links: NavLink[];
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    config: SidebarConfig;
}

const NavItem: Component<NavLink & { brandColor: "forest" | "terracotta"; onClick: () => void }> = (props) => {
    const match = useMatch(() => props.href, { exact: true });
    const isActive = () => !!match();

    const activeStyles = createMemo(() => {
        return props.brandColor === "terracotta"
            ? "bg-terracotta-100 dark:bg-terracotta-900/40 border-l-4 border-terracotta-500 text-terracotta-800 dark:text-terracotta-300"
            : "bg-forest-100 dark:bg-forest-900/40 border-l-4 border-forest-500 text-forest-800 dark:text-sage-400";
    });

    const activeIconStyles = createMemo(() => {
        return props.brandColor === "terracotta"
            ? "text-terracotta-600 dark:text-terracotta-400"
            : "text-forest-600 dark:text-sage-500";
    });

    return (
        <A
            href={props.href}
            class={`group flex items-center px-3 py-3 text-sm font-semibold rounded-lg transition-standard mb-1 ${
                isActive()
                    ? activeStyles()
                    : "text-forest-700/80 dark:text-cream-100/80 hover:bg-forest-50 dark:hover:bg-forest-900/30 hover:text-forest-800 dark:hover:text-cream-100"
            }`}
            onClick={props.onClick}
            aria-current={isActive() ? "page" : undefined}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    props.onClick();
                }
            }}
            tabIndex={0}
            role="listitem"
        >
            <props.icon
                class={`mr-3 shrink-0 h-5 w-5 transition-colors ${
                    isActive() 
                        ? activeIconStyles() 
                        : "text-forest-600/60 dark:text-forest-400/60 group-hover:text-forest-600 dark:group-hover:text-forest-400"
                }`}
            />
            <span class="whitespace-nowrap">{props.label}</span>
        </A>
    );
};

export const Sidebar: Component<SidebarProps> = (props) => {
    return (
        <>
            {/* Mobile Backdrop */}
            <Show when={props.isOpen}>
                <div
                    class="fixed inset-0 z-40 bg-forest-900/60 backdrop-blur-sm md:hidden"
                    onClick={props.onClose}
                    aria-hidden="true"
                ></div>
            </Show>

            {/* Sidebar Container */}
            <div
                class={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white dark:bg-forest-800 border-r border-cream-200 dark:border-forest-700 transform transition-transform duration-300 ease-in-out will-change-transform md:translate-x-0 md:relative md:inset-0 ${props.isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div class="h-full flex flex-col">
                    {/* Navigation Links */}
                    <div class="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-3">
                        <nav class="flex-1 space-y-1" role="navigation" aria-label="Main navigation">
                            {/* Navigation Links */}
                            <For each={props.config.links}>
                                {(link) => (
                                    <NavItem 
                                        {...link} 
                                        brandColor={props.config.brandColor}
                                        onClick={props.onClose}
                                    />
                                )}
                            </For>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};
