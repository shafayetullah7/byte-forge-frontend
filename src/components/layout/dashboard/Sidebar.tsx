import { Component, Show, For, createMemo, createSignal, createEffect } from "solid-js";
import { A, useMatch, useLocation } from "@solidjs/router";
import { ChevronDownIcon } from "~/components/icons";

export interface NavLink {
    href: string;
    icon: Component<{ class?: string }>;
    label: string;
    id?: string;
    children?: NavLink[];
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

const isParentLink = (link: NavLink): boolean => !!link.children && link.children.length > 0;

const PlainNavItem: Component<{
    link: NavLink;
    brandColor: "forest" | "terracotta";
    onClick: () => void;
    variant?: "default" | "child";
}> = (props) => {
    const match = useMatch(() => props.link.href, { exact: true });
    const isActive = () => !!match();

    const activeStyles = createMemo(() => {
        if (props.variant === "child") {
            return props.brandColor === "terracotta"
                ? "bg-terracotta-50 dark:bg-terracotta-900/20 text-terracotta-700 dark:text-terracotta-300"
                : "bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-sage-300";
        }
        return props.brandColor === "terracotta"
            ? "bg-terracotta-100 dark:bg-terracotta-900/40 border-l-4 border-terracotta-500 text-terracotta-800 dark:text-terracotta-300"
            : "bg-forest-100 dark:bg-forest-900/40 border-l-4 border-forest-500 text-forest-800 dark:text-sage-400";
    });

    const activeIconStyles = createMemo(() => {
        return props.brandColor === "terracotta"
            ? "text-terracotta-600 dark:text-terracotta-400"
            : "text-forest-600 dark:text-sage-500";
    });

    const baseClasses = createMemo(() => {
        const childClasses = props.variant === "child"
            ? "pl-11 py-2.5 text-sm font-medium rounded-md mb-0.5"
            : "px-3 py-3 text-sm font-semibold rounded-lg mb-1";

        const inactiveClasses = props.variant === "child"
            ? "text-forest-600/70 dark:text-cream-100/60 hover:bg-forest-50 dark:hover:bg-forest-900/20 hover:text-forest-700 dark:hover:text-cream-100"
            : "text-forest-700/80 dark:text-cream-100/80 hover:bg-forest-50 dark:hover:bg-forest-900/30 hover:text-forest-800 dark:hover:text-cream-100";

        return `group flex items-center transition-standard ${childClasses} ${isActive() ? activeStyles() : inactiveClasses}`;
    });

    const iconClasses = createMemo(() => {
        const base = props.variant === "child" ? "mr-2.5 shrink-0 h-4 w-4" : "mr-3 shrink-0 h-5 w-5";
        const active = props.variant === "child"
            ? activeIconStyles()
            : `transition-colors ${base}`;

        if (isActive()) {
            return `${base} transition-colors ${activeIconStyles()}`;
        }
        return `${base} transition-colors text-forest-600/60 dark:text-forest-400/60 group-hover:text-forest-600 dark:group-hover:text-forest-400`;
    });

    return (
        <A
            href={props.link.href}
            class={baseClasses()}
            onClick={props.onClick}
            aria-current={isActive() ? "page" : undefined}
        >
            <props.link.icon class={iconClasses()} />
            <span class="whitespace-nowrap">{props.link.label}</span>
        </A>
    );
};

const ParentNavItem: Component<{
    link: NavLink;
    brandColor: "forest" | "terracotta";
    onClick: () => void;
    isExpanded: boolean;
    onToggle: () => void;
}> = (props) => {
    const partialMatch = useMatch(() => props.link.href + "/*");
    const exactMatch = useMatch(() => props.link.href, { exact: true });
    const isPartiallyActive = () => !!partialMatch();
    const isExactlyActive = () => !!exactMatch();
    const isActive = () => isPartiallyActive() || isExactlyActive();

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
        <div class="mb-1">
            <div
                class={`group flex items-center justify-between px-3 py-3 text-sm font-semibold rounded-lg transition-standard cursor-pointer ${
                    isActive()
                        ? activeStyles()
                        : "text-forest-700/80 dark:text-cream-100/80 hover:bg-forest-50 dark:hover:bg-forest-900/30 hover:text-forest-800 dark:hover:text-cream-100"
                }`}
                onClick={props.onToggle}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        props.onToggle();
                    }
                    if (e.key === 'Escape' && props.isExpanded) {
                        e.preventDefault();
                        props.onToggle();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={props.isExpanded}
                aria-haspopup="true"
            >
                <div class="flex items-center min-w-0 flex-1">
                    <props.link.icon
                        class={`mr-3 shrink-0 h-5 w-5 transition-colors ${
                            isActive()
                                ? activeIconStyles()
                                : "text-forest-600/60 dark:text-forest-400/60 group-hover:text-forest-600 dark:group-hover:text-forest-400"
                        }`}
                    />
                    <span class="whitespace-nowrap">{props.link.label}</span>
                </div>
                <ChevronDownIcon
                    class={`shrink-0 h-4 w-4 transition-transform duration-200 text-forest-500 dark:text-forest-400 ${
                        props.isExpanded ? "rotate-0" : "-rotate-90"
                    }`}
                    aria-hidden="true"
                />
            </div>
            <Show when={props.isExpanded}>
                <div
                    class="ml-3 pl-3 border-l-2 border-forest-200 dark:border-forest-700 mt-1 space-y-0.5 animate-slideDown"
                    role="group"
                    aria-label={`${props.link.label} submenu`}
                >
                    <For each={props.link.children}>
                        {(child) => (
                            <PlainNavItem
                                link={child}
                                brandColor={props.brandColor}
                                onClick={props.onClick}
                                variant="child"
                            />
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
};

export const Sidebar: Component<SidebarProps> = (props) => {
    const [expandedKeys, setExpandedKeys] = createSignal<Record<string, boolean>>({});
    const location = useLocation();

    const getLinkKey = (link: NavLink): string => link.id || link.href;

    const autoExpanded = createMemo(() => {
        const currentPath = location.pathname;
        const expanded: Record<string, boolean> = {};
        for (const link of props.config.links) {
            if (!isParentLink(link)) continue;
            for (const child of link.children!) {
                if (currentPath.startsWith(child.href)) {
                    expanded[getLinkKey(link)] = true;
                    break;
                }
            }
        }
        return expanded;
    });

    const isExpanded = (link: NavLink): boolean => {
        const key = getLinkKey(link);
        if (key in expandedKeys()) {
            return expandedKeys()[key];
        }
        return !!autoExpanded()[key];
    };

    const toggleExpand = (link: NavLink) => {
        const key = getLinkKey(link);
        setExpandedKeys(prev => ({ ...prev, [key]: !isExpanded(link) }));
    };

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
                class={`fixed inset-y-0 left-0 z-50 w-64 sm:w-72 bg-white dark:bg-forest-800 border-r border-cream-200 dark:border-forest-700 transform transition-transform duration-300 ease-in-out will-change-transform md:translate-x-0 md:relative md:inset-auto md:z-auto md:flex md:flex-col md:h-full md:overflow-y-auto md:overscroll-contain ${props.isOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div class="h-full flex flex-col">
                    {/* Navigation Links */}
                    <div class="flex-1 flex flex-col overflow-y-auto overscroll-contain pt-5 pb-4 px-3">
                        <nav class="flex-1 space-y-1" role="navigation" aria-label="Main navigation">
                            <For each={props.config.links}>
                                {(link) => (
                                    isParentLink(link) ? (
                                        <ParentNavItem
                                            link={link}
                                            brandColor={props.config.brandColor}
                                            onClick={props.onClose}
                                            isExpanded={isExpanded(link)}
                                            onToggle={() => toggleExpand(link)}
                                        />
                                    ) : (
                                        <PlainNavItem
                                            link={link}
                                            brandColor={props.config.brandColor}
                                            onClick={props.onClose}
                                        />
                                    )
                                )}
                            </For>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};
