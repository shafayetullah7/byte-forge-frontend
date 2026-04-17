import { Component, Show, For } from "solid-js";
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

export const Sidebar: Component<SidebarProps> = (props) => {
    const getActiveStyles = () => {
        if (props.config.brandColor === "terracotta") {
            return "bg-terracotta-100 dark:bg-terracotta-900/40 border-l-4 border-terracotta-500 text-terracotta-800 dark:text-terracotta-300";
        }
        return "bg-forest-100 dark:bg-forest-900/40 border-l-4 border-forest-500 text-forest-800 dark:text-sage-400";
    };

    const getActiveIconStyles = () => {
        if (props.config.brandColor === "terracotta") {
            return "text-terracotta-600 dark:text-terracotta-400";
        }
        return "text-forest-600 dark:text-sage-500";
    };

    const NavItem = (itemProps: NavLink) => {
        // useMatch with exact: true ensures only exact path matches are considered active
        // This prevents /app/seller/shops from matching both /app/seller and /app/seller/shops
        const match = useMatch(() => itemProps.href, { exact: true });

        return (
            <A
                href={itemProps.href}
                class={`group flex items-center px-3 py-2.5 body-small font-semibold rounded-lg transition-standard mb-1 ${match()
                    ? getActiveStyles()
                    : "text-forest-700/80 dark:text-cream-100/80 hover:bg-forest-50 dark:hover:bg-forest-900/30 hover:text-forest-800 dark:hover:text-cream-100"
                    }`}
                onClick={props.onClose}
            >
                <itemProps.icon
                    class={`mr-3 shrink-0 h-5 w-5 transition-colors ${match()
                        ? getActiveIconStyles()
                        : "text-forest-600/60 dark:text-forest-400/60 group-hover:text-forest-600 dark:group-hover:text-forest-400"
                        }`}
                />
                <span class="whitespace-nowrap">{itemProps.label}</span>
            </A>
        );
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <Show when={props.isOpen}>
                <div
                    class="fixed inset-0 z-40 bg-forest-900/60 backdrop-blur-sm md:hidden"
                    onClick={props.onClose}
                ></div>
            </Show>

            {/* Sidebar Container */}
            <div
                class={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-forest-800 border-r border-cream-200 dark:border-forest-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:inset-0 ${props.isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div class="h-full flex flex-col">
                    {/* Navigation Links */}
                    <div class="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-3">
                        <nav class="flex-1 space-y-1">
                            {/* Navigation Links */}
                            <For each={props.config.links}>
                                {(link) => <NavItem href={link.href} icon={link.icon} label={link.label} />}
                            </For>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};
