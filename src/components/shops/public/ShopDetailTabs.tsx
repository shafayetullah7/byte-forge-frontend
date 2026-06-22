import { For } from "solid-js";
import type { Component } from "solid-js";
import type { PublicShopDetailTab } from "~/lib/types/public/shops.types";

export const ShopDetailTabs: Component<{
  tabs: Array<{ id: PublicShopDetailTab; label: string }>;
  activeTab: PublicShopDetailTab;
  onTabChange: (tab: PublicShopDetailTab) => void;
}> = (props) => (
  <nav
    class="sticky top-0 z-20 bg-cream-50/95 dark:bg-forest-900/95 backdrop-blur border-b border-cream-200 dark:border-forest-700"
    aria-label="Shop sections"
  >
    <div class="max-w-7xl mx-auto px-4">
      <div class="flex gap-1 overflow-x-auto scrollbar-hide -mb-px" role="tablist">
        <For each={props.tabs}>
          {(tab) => {
            const isActive = () => props.activeTab === tab.id;
            return (
              <button
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive()}
                aria-controls={`panel-${tab.id}`}
                tabindex={isActive() ? 0 : -1}
                class={`shrink-0 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-forest-500 focus-visible:ring-inset ${
                  isActive()
                    ? "border-forest-600 text-forest-700 dark:border-forest-400 dark:text-forest-300"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 hover:border-cream-300"
                }`}
                onClick={() => props.onTabChange(tab.id)}
                onKeyDown={(e) => {
                  const tabs = props.tabs;
                  const idx = tabs.findIndex((t) => t.id === tab.id);
                  if (e.key === "ArrowRight" && idx < tabs.length - 1) {
                    e.preventDefault();
                    props.onTabChange(tabs[idx + 1].id);
                  }
                  if (e.key === "ArrowLeft" && idx > 0) {
                    e.preventDefault();
                    props.onTabChange(tabs[idx - 1].id);
                  }
                }}
              >
                {tab.label}
              </button>
            );
          }}
        </For>
      </div>
    </div>
  </nav>
);
