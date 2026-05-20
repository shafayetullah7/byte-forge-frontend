import {
  For,
  Show,
  createSignal,
  createMemo,
  ErrorBoundary,
  Suspense,
} from "solid-js";
import { createAsync, A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { getCart, invalidateAllCart, updateCartItem, removeCartItem } from "~/lib/api/endpoints/buyer/cart.api";
import type { CartItem } from "~/lib/api/types/cart.types";
import { formatPrice } from "../plants/constants";
import { getStockStatusLabel } from "./cart.helpers";
import {
  ExclamationCircleIcon,
  SpinnerIcon,
  LeafIcon,
  TrashIcon,
} from "~/components/icons";
import { CartBreadcrumb, EmptyCart, OrderSummary } from "./components";

function LoadingFallback() {
  const { t } = useI18n();
  return (
    <div class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center">
      <div class="flex flex-col items-center gap-3">
        <SpinnerIcon class="w-10 h-10 text-forest-600 dark:text-forest-400 animate-spin" />
        <p class="text-sm text-gray-500 dark:text-gray-400">
          {t("common.loading")}
        </p>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { t } = useI18n();
  const cart = createAsync(() => getCart());
  const items = createMemo(() => cart()?.items ?? []);
  const [selectedIds, setSelectedIds] = createSignal<Set<string>>(new Set());
  const [updatingId, setUpdatingId] = createSignal<string | null>(null);
  const [removingId, setRemovingId] = createSignal<string | null>(null);

  const selectedItems = createMemo(() =>
    items().filter((item) => selectedIds().has(item.id))
  );

  const toggle = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAll = () => setSelectedIds(new Set(items().map((i) => i.id)));
  const deselectAll = () => setSelectedIds(new Set<string>());

  const allSelected = createMemo(
    () => items().length > 0 && selectedIds().size === items().length
  );

  const updateQuantity = async (id: string, qty: number) => {
    setUpdatingId(id);
    try { await updateCartItem(id, { quantity: qty }); }
    finally { setUpdatingId(null); invalidateAllCart(); }
  };

  const removeItem = async (id: string) => {
    setRemovingId(id);
    try { await removeCartItem(id); }
    finally { setRemovingId(null); invalidateAllCart(); }
  };

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
      <Suspense fallback={<LoadingFallback />}>
        <div class="min-h-screen bg-cream-50 dark:bg-forest-900">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <CartBreadcrumb />

            <div class="flex items-center gap-3 mb-8">
              <div class="w-12 h-12 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
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

            <Show when={items().length > 0} fallback={<EmptyCart />}>
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-3">
                  <div class="flex items-center justify-between px-1">
                    <button
                      onClick={allSelected() ? deselectAll : selectAll}
                      class="text-sm text-forest-600 dark:text-forest-400 hover:underline font-medium"
                    >
                      {allSelected() ? t("cart.deselectAll") : t("cart.selectAll")}
                    </button>
                    <Show when={selectedIds().size > 0 && !allSelected()}>
                      <span class="text-sm text-gray-500 dark:text-gray-400">
                        {selectedIds().size} selected
                      </span>
                    </Show>
                  </div>

                  <div class="space-y-3">
                    <For each={items()}>
                      {(item) => (
                        <div class="flex items-start gap-4 p-4 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700">
                          <input
                            type="checkbox"
                            checked={selectedIds().has(item.id)}
                            onChange={() => toggle(item.id)}
                            class="mt-1 w-5 h-5 rounded border-cream-300 dark:border-forest-600 text-forest-600 dark:text-forest-500 accent-forest-600 dark:accent-forest-500 focus:ring-2 focus:ring-forest-500/30 focus:ring-offset-1 cursor-pointer flex-shrink-0"
                          />

                          <A
                            href={`/plants/${item.productSlug}`}
                            class="w-20 h-20 flex-shrink-0 bg-cream-100 dark:bg-forest-900/50 rounded-lg overflow-hidden"
                          >
                            <Show when={item.thumbnail} fallback={
                              <div class="w-full h-full flex items-center justify-center">
                                <LeafIcon class="w-6 h-6 text-gray-300 dark:text-gray-600" />
                              </div>
                            }>
                              {(thumb) => (
                                <img
                                  src={thumb().url}
                                  alt={item.productName}
                                  class="w-full h-full object-cover"
                                  loading="lazy"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                                />
                              )}
                            </Show>
                          </A>

                          <div class="flex-1 min-w-0">
                            <div class="flex items-start justify-between gap-3 mb-1">
                              <div>
                                <A href={`/plants/${item.productSlug}`} class="font-semibold text-sm text-forest-800 dark:text-cream-50 hover:text-forest-600 dark:hover:text-forest-300 transition-colors block">
                                  {item.productName}
                                </A>
                                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                  {item.variantTitle || item.sku || "Standard"}
                                </p>
                                <Show when={item.sku}>
                                  <p class="text-xs font-mono text-gray-400 dark:text-gray-500">SKU: {item.sku}</p>
                                </Show>
                              </div>
                              <div class="text-right flex-shrink-0">
                                <p class="font-bold text-sm text-forest-800 dark:text-cream-50">
                                  {formatPrice(item.lineTotal)}
                                </p>
                                <p class="text-xs text-gray-400 dark:text-gray-500">
                                  {formatPrice(item.price)} {t("cart.each")}
                                </p>
                              </div>
                            </div>

                            <div class="flex items-center justify-between mt-2">
                              <StockBadge item={item} t={t} />

                              <div class="flex items-center gap-2">
                                <QuantityControls item={item} onUpdate={updateQuantity} updating={updatingId()} />
                                <RemoveButton item={item} onRemove={removeItem} removing={removingId()} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                <div>
                  <OrderSummary items={selectedItems()} />
                </div>
              </div>
            </Show>
          </div>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

function StockBadge(props: { item: CartItem; t: (key: string, params?: Record<string, any>) => string }) {
  const info = getStockStatusLabel(props.item.stockStatus, props.item.availableQuantity, props.t);
  return (
    <span class={`inline-flex items-center gap-1.5 text-xs font-medium ${info.color}`}>
      <span class={`w-1.5 h-1.5 rounded-full ${
        props.item.stockStatus === "in_stock" ? "bg-forest-500"
          : props.item.stockStatus === "low_stock" ? "bg-cream-500"
          : "bg-terracotta-500"
      }`} />
      {info.label}
    </span>
  );
}

function QuantityControls(props: { item: CartItem; onUpdate: (id: string, qty: number) => void; updating: string | null }) {
  return (
    <div class="flex items-center border border-cream-200 dark:border-forest-700 rounded-lg overflow-hidden">
      <button
        onClick={() => props.onUpdate(props.item.id, Math.max(1, props.item.quantity - 1))}
        disabled={props.item.quantity <= 1 || props.updating === props.item.id}
        class="px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease quantity"
      >−</button>
      <span class="px-2.5 py-1 text-xs font-semibold text-forest-800 dark:text-cream-50 min-w-[2rem] text-center border-x border-cream-200 dark:border-forest-700">
        {props.item.quantity}
      </span>
      <button
        onClick={() => props.onUpdate(props.item.id, Math.min(props.item.maxQuantity || 999, props.item.quantity + 1))}
        disabled={props.item.quantity >= (props.item.maxQuantity || 999) || props.updating === props.item.id}
        class="px-2.5 py-1 text-xs text-gray-500 dark:text-gray-400 hover:bg-cream-50 dark:hover:bg-forest-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Increase quantity"
      >+</button>
    </div>
  );
}

function RemoveButton(props: { item: CartItem; onRemove: (id: string) => void; removing: string | null }) {
  const { t } = useI18n();
  return (
    <button
      onClick={() => props.onRemove(props.item.id)}
      disabled={props.removing === props.item.id}
      class="p-1.5 rounded-md text-gray-400 dark:text-gray-500 hover:text-terracotta-600 dark:hover:text-terracotta-400 hover:bg-terracotta-50 dark:hover:bg-terracotta-900/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      aria-label={t("cart.removeItem")}
    >
      {props.removing === props.item.id
        ? <SpinnerIcon class="w-3.5 h-3.5 animate-spin" />
        : <TrashIcon class="w-3.5 h-3.5" />
      }
    </button>
  );
}
