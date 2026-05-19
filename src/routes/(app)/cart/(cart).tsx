import {
  For,
  Show,
  createSignal,
  createMemo,
  ErrorBoundary,
} from "solid-js";
import { useI18n } from "~/i18n";
import type { CartItem } from "~/lib/api/types/cart.types";
import { ExclamationCircleIcon } from "~/components/icons";
import { MOCK_CART_ITEMS } from "./cart-data";
import { CartBreadcrumb, EmptyCart, OrderSummary, ProductGroup } from "./components";

function groupItemsByProduct(items: CartItem[]): Map<string, CartItem[]> {
  const groups = new Map<string, CartItem[]>();
  for (const item of items) {
    const existing = groups.get(item.productSlug) || [];
    existing.push(item);
    groups.set(item.productSlug, existing);
  }
  return groups;
}

export default function CartPage() {
  const { t } = useI18n();
  const [items, setItems] = createSignal<CartItem[]>(MOCK_CART_ITEMS);
  const [selectedIds, setSelectedIds] = createSignal<Set<string>>(
    new Set(MOCK_CART_ITEMS.map((i) => i.id))
  );

  const selectedItems = createMemo(() =>
    items().filter((item) => selectedIds().has(item.id))
  );

  const groupedItems = createMemo(() => groupItemsByProduct(items()));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAll = () => {
    setSelectedIds(new Set(items().map((i) => i.id)));
  };

  const deselectAll = () => {
    setSelectedIds(new Set<string>());
  };

  const selectAllVariants = (slug: string) => {
    const variants = groupedItems().get(slug) || [];
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const v of variants) {
        next.add(v.id);
      }
      return next;
    });
  };

  const deselectAllVariants = (slug: string) => {
    const variants = groupedItems().get(slug) || [];
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const v of variants) {
        next.delete(v.id);
      }
      return next;
    });
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: qty,
              lineTotal: (parseFloat(item.price) * qty).toString(),
            }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const allSelected = createMemo(() =>
    items().length > 0 && selectedIds().size === items().length
  );

  const someSelected = createMemo(() =>
    selectedIds().size > 0 && selectedIds().size < items().length
  );

  const totalVariants = createMemo(() => {
    let count = 0;
    groupedItems().forEach(() => count++);
    return count;
  });

  return (
    <ErrorBoundary
      fallback={(error) => (
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center p-6">
          <div class="bg-white dark:bg-forest-800 rounded-2xl border border-red-200 dark:border-red-800 p-8 max-w-md w-full">
            <div class="flex items-center gap-3 mb-4">
              <ExclamationCircleIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
              <h2 class="text-lg font-semibold text-red-900 dark:text-red-300">
                {t("cart.loadError")}
              </h2>
            </div>
            <p class="text-sm text-red-700 dark:text-red-400 mb-4">
              {error.message}
            </p>
            <button
              onClick={() => window.location.reload()}
              class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {t("common.retry")}
            </button>
          </div>
        </div>
      )}
    >
      <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CartBreadcrumb />

          <div class="flex items-center gap-3 mb-8">
            <div class="w-12 h-12 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
              <svg
                class="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                {t("cart.title")}
              </h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {t("cart.itemCount", { count: items().length })}
              </p>
            </div>
          </div>

          <Show
            when={items().length > 0}
            fallback={<EmptyCart />}
          >
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Cart Items */}
              <div class="lg:col-span-2 space-y-4">
                {/* Selection Bar */}
                <div class="flex items-center justify-between px-1">
                  <Show
                    when={allSelected()}
                    fallback={
                      <button
                        onClick={selectAll}
                        class="text-sm text-forest-600 dark:text-forest-400 hover:underline font-medium"
                      >
                        {t("cart.selectAll")}
                      </button>
                    }
                  >
                    <button
                      onClick={deselectAll}
                      class="text-sm text-forest-600 dark:text-forest-400 hover:underline font-medium"
                    >
                      {t("cart.deselectAll")}
                    </button>
                  </Show>
                  <Show when={someSelected()}>
                    <span class="text-sm text-gray-500 dark:text-gray-400">
                      {t("cart.selectedCount", { count: selectedIds().size })}
                    </span>
                  </Show>
                </div>

                {/* Product Groups */}
                <div class="space-y-4">
                  <For each={Array.from(groupedItems().entries())}>
                    {([slug, variants]) => (
                      <ProductGroup
                        slug={slug}
                        name={variants[0].productName}
                        thumbnail={variants[0].thumbnail}
                        variants={variants}
                        selectedIds={selectedIds()}
                        onToggle={toggleSelect}
                        onSelectAll={selectAllVariants}
                        onDeselectAll={deselectAllVariants}
                        onUpdateQuantity={updateQuantity}
                        onRemove={removeItem}
                      />
                    )}
                  </For>
                </div>
              </div>

              {/* Right: Order Summary */}
              <div>
                <OrderSummary items={selectedItems()} />
              </div>
            </div>
          </Show>
        </div>
      </div>
    </ErrorBoundary>
  );
}
