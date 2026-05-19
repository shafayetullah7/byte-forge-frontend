import { For, Show, createSignal, createMemo, type Component } from "solid-js";
import { Button } from "~/components/ui";
import { formatPrice } from "../../constants";
import { BoltIcon, ShoppingBagIcon, PlusIcon } from "~/components/icons";
import SectionHeader from "./SectionHeader";

export interface BundleItem {
  id: string;
  name: string;
  price: string;
}

const FrequentlyBoughtTogether: Component<{
  plantPrice: string;
  bundleItems: BundleItem[];
}> = (props) => {
  const [bundleSelections, setBundleSelections] = createSignal<Set<string>>(
    new Set(props.bundleItems.map((item) => item.id))
  );

  const bundleTotal = createMemo(() => {
    const plantPrice = parseFloat(props.plantPrice) || 0;
    const selected = bundleSelections();
    let extra = 0;
    for (const item of props.bundleItems) {
      if (selected.has(item.id)) {
        extra += parseFloat(item.price) || 0;
      }
    }
    return plantPrice + extra;
  });

  const toggleBundle = (id: string) => {
    const current = new Set(bundleSelections());
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    setBundleSelections(current);
  };

  return (
    <div class="mt-12 mb-12">
      <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6">
        <SectionHeader
          icon={BoltIcon}
          title="Frequently Bought Together"
          subtitle="Complete your plant care kit"
        />
        <div class="flex flex-col sm:flex-row items-center gap-4">
          <div class="flex items-center gap-3 flex-1">
            <For each={props.bundleItems}>
              {(item, index) => (
                <>
                  <button
                    onClick={() => toggleBundle(item.id)}
                    class={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center p-2 transition-all ${
                      bundleSelections().has(item.id)
                        ? "border-forest-500 dark:border-forest-400 bg-forest-50 dark:bg-forest-900/30"
                        : "border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 hover:border-forest-300"
                    }`}
                  >
                    <ShoppingBagIcon class={`w-5 h-5 mb-1 ${
                      bundleSelections().has(item.id)
                        ? "text-forest-600 dark:text-forest-400"
                        : "text-gray-400 dark:text-gray-500"
                    }`} />
                    <span class="text-[10px] text-center text-gray-600 dark:text-gray-400 leading-tight line-clamp-2">
                      {item.name}
                    </span>
                    <span class="text-xs font-semibold text-forest-800 dark:text-cream-50 mt-1">
                      {formatPrice(item.price)}
                    </span>
                  </button>
                  <Show when={index() < props.bundleItems.length - 1}>
                    <PlusIcon class="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0 hidden sm:block" />
                  </Show>
                </>
              )}
            </For>
          </div>
          <div class="flex items-center gap-4 sm:border-l border-cream-200 dark:border-forest-700 sm:pl-6">
            <div>
              <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
              <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                {formatPrice(bundleTotal())}
              </p>
            </div>
            <Button variant="primary" size="lg">
              Add All to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
