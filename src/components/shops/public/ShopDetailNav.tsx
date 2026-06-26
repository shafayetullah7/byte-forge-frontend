import { For } from "solid-js";
import type { Component } from "solid-js";
import { A, useLocation } from "@solidjs/router";
import type { PublicShopDetailSection } from "~/lib/types/public/shops.types";

export const ShopDetailNav: Component<{
  slug: string;
  sections: Array<{ path: PublicShopDetailSection; label: string }>;
}> = (props) => {
  const location = useLocation();

  const isActiveSection = (path: PublicShopDetailSection) => {
    const base = `/shops/${props.slug}`;
    if (path === "") {
      return location.pathname === base || location.pathname === `${base}/`;
    }
    return location.pathname.startsWith(`${base}/${path}`);
  };

  const hrefFor = (path: PublicShopDetailSection) =>
    path === "" ? `/shops/${props.slug}` : `/shops/${props.slug}/${path}`;

  return (
    <nav
      class="sticky top-0 z-20 bg-cream-50/95 dark:bg-forest-900/95 backdrop-blur border-b border-cream-200 dark:border-forest-700"
      aria-label="Shop sections"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex gap-1 overflow-x-auto scrollbar-hide -mb-px">
          <For each={props.sections}>
            {(section) => {
              const isActive = () => isActiveSection(section.path);
              return (
                <A
                  href={hrefFor(section.path)}
                  noScroll
                  aria-current={isActive() ? "page" : undefined}
                  class={`shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-inset ${
                    isActive()
                      ? "border-forest-600 text-forest-700 dark:border-forest-400 dark:text-forest-300"
                      : "border-transparent text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 hover:border-cream-300"
                  }`}
                >
                  {section.label}
                </A>
              );
            }}
          </For>
        </div>
      </div>
    </nav>
  );
};
