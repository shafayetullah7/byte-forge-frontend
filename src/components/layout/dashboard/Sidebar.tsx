import { Component, Show, For } from "solid-js";
import { A, useLocation } from "@solidjs/router";

export interface NavLink {
    href: string;
    icon: Component<{ class?: string }>;
    label: string;
}

export interface SidebarConfig {
    mode: "buyer" | "seller";
    brandColor: "forest" | "terracotta";
    workspaceTitle: string;
    links: NavLink[];
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    config: SidebarConfig;
}

export const Sidebar: Component<SidebarProps> = (props) => {
    const location = useLocation();

    const isActive = (path: string) => {
        if (path === "/app") return location.pathname === "/app";
        return location.pathname.startsWith(path);
    };

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

    const NavItem = (itemProps: NavLink) => (
        <A
            href={itemProps.href}
            class={`group flex items-center px-3 py-2.5 body-small font-semibold rounded-lg transition-standard mb-1 ${isActive(itemProps.href)
                ? getActiveStyles()
                : "text-forest-700/80 dark:text-cream-100/80 hover:bg-forest-50 dark:hover:bg-forest-900/30 hover:text-forest-800 dark:hover:text-cream-100"
                }`}
            onClick={props.onClose}
        >
            <itemProps.icon
                class={`mr-3 flex-shrink-0 h-5 w-5 transition-colors ${isActive(itemProps.href)
                    ? getActiveIconStyles()
                    : "text-forest-600/60 dark:text-forest-400/60 group-hover:text-forest-600 dark:group-hover:text-forest-400"
                    }`}
            />
            {itemProps.label}
        </A>
    );

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
                    {/* Logo Area */}
                    <div class="flex items-center h-16 flex-shrink-0 px-4 border-b border-cream-200 dark:border-forest-700">
                        <A
                            href="/"
                            class="text-xl font-bold text-forest-800 dark:text-sage-400 flex items-center gap-2 hover:text-forest-700 dark:hover:text-sage-300 transition-standard"
                        >
                            GreenHaven
                            <span class="w-2 h-2 bg-forest-500 rounded-full"></span>
                        </A>
                    </div>

                    {/* Navigation Links */}
                    <div class="flex-1 flex flex-col overflow-y-auto pt-5 pb-4 px-3">
                        <nav class="flex-1 space-y-1">
                            {/* Workspace Title */}
                            <div class="px-3 mb-3 body-small font-semibold text-forest-700/60 dark:text-cream-100/50 uppercase tracking-wider">
                                {props.config.workspaceTitle}
                            </div>

                            {/* Navigation Links */}
                            <For each={props.config.links}>
                                {(link) => <NavItem {...link} />}
                            </For>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};
