import { createSignal, createMemo, For } from "solid-js";
import { ErrorBoundary } from "solid-js";
import Badge from "~/components/ui/Badge";
import { SectionErrorFallback } from "~/components/seller/SectionErrorFallback";
import { MagnifyingGlassIcon } from "~/components/icons";
import { getOrderStatusVariant, getOrderStatusLabel, formatPrice, formatDate } from "../helpers";
import { StarRatingDisplay } from "../components/StarRatingDisplay";
import { MOCK_ORDERS } from "../mock-data";

export default function ProductOrdersRoute() {
  const [orderSearchQuery, setOrderSearchQuery] = createSignal("");
  const [orderStatusFilter, setOrderStatusFilter] = createSignal("");

  const filteredOrders = createMemo(() => {
    let result = MOCK_ORDERS;
    if (orderStatusFilter()) result = result.filter((o) => o.status === orderStatusFilter());
    if (orderSearchQuery()) {
      const q = orderSearchQuery().toLowerCase();
      result = result.filter((o) => o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q));
    }
    return result;
  });

  return (
    <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="orders" />}>
      <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
        <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700">
          <div class="flex flex-col sm:flex-row gap-3">
            <div class="flex-1 relative">
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={orderSearchQuery()}
                onInput={(e) => setOrderSearchQuery(e.currentTarget.value)}
                class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 placeholder-gray-400 dark:placeholder-gray-500 transition-standard focus-ring-flat"
              />
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <select
              value={orderStatusFilter()}
              onChange={(e) => setOrderStatusFilter(e.currentTarget.value)}
              class="px-4 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-50 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="DELIVERED">Delivered</option>
              <option value="SHIPPED">Shipped</option>
              <option value="PROCESSING">Processing</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-cream-200 dark:border-forest-700 bg-cream-50 dark:bg-forest-900/50">
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Order</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Customer</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Variant</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Qty</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Date</th>
                <th class="text-left px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Rating</th>
              </tr>
            </thead>
            <tbody>
              <For each={filteredOrders()}>
                {(order) => (
                  <tr class="border-b border-cream-100 dark:border-forest-700/50 hover:bg-cream-50 dark:hover:bg-forest-900/30 transition-colors">
                    <td class="px-4 py-3">
                      <span class="font-mono text-sm text-forest-800 dark:text-cream-50">{order.id}</span>
                    </td>
                    <td class="px-4 py-3">
                      <div>
                        <p class="text-sm font-medium text-forest-800 dark:text-cream-50">{order.customerName}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{order.customerEmail}</p>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <div>
                        <p class="text-sm text-forest-800 dark:text-cream-50">{order.variantName}</p>
                        <p class="text-xs font-mono text-gray-500 dark:text-gray-400">{order.variantSku}</p>
                      </div>
                    </td>
                    <td class="px-4 py-3">
                      <span class="text-sm text-gray-700 dark:text-gray-300">{order.quantity}</span>
                    </td>
                    <td class="px-4 py-3">
                      <span class="text-sm font-semibold text-forest-800 dark:text-cream-50">{formatPrice(order.totalAmount)}</span>
                    </td>
                    <td class="px-4 py-3">
                      <Badge variant={getOrderStatusVariant(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </td>
                    <td class="px-4 py-3">
                      <span class="text-sm text-gray-500 dark:text-gray-400">{formatDate(order.orderDate)}</span>
                    </td>
                    <td class="px-4 py-3">
                      {order.rating !== null ? (
                        <StarRatingDisplay rating={order.rating!} size="w-3.5 h-3.5" />
                      ) : (
                        <span class="text-xs text-gray-400">\u2014</span>
                      )}
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-4 border-t border-cream-200 dark:border-forest-700">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            Showing {filteredOrders().length} of {MOCK_ORDERS.length} orders
          </p>
        </div>
      </div>
    </ErrorBoundary>
  );
}
