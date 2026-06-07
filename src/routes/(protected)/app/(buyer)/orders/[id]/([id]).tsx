import { Component, Show, For, createMemo, Suspense } from "solid-js";
import { createAsync, useParams, A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { StatusBadge } from "~/components/ui/StatusBadge";
import type { StatusType } from "~/components/ui/StatusBadge";
import { mapStatus } from "../components/utils";
import { OrderTimeline, type TimelineEvent } from "./components/OrderTimeline";
import { getOrderGroup } from "~/lib/api/endpoints/buyer/orders.api";
import type { OrderDetail, OrderItemDetail, OrderAddressDetail, OrderStatusHistoryDetail } from "~/lib/api/types/order.types";
import {
  ChevronLeftIcon,
  PackageIcon,
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  PrinterIcon,
  FlagIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ShoppingBagIcon,
  ArrowTopRightOnSquareIcon,
} from "~/components/icons";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCurrency(amount: string): string {
  return `\u09f3${parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function buildTimelineFromHistory(
  history: OrderStatusHistoryDetail[],
): TimelineEvent[] {
  if (history.length === 0) return [];

  return history.map((h, i) => ({
    id: h.id,
    status: h.toStatus,
    title: h.toStatus.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: h.notes ?? `Order status changed to ${h.toStatus.replace(/_/g, " ").toLowerCase()}`,
    timestamp: h.createdAt,
    isCompleted: i < history.length - 1,
    isCurrent: i === history.length - 1,
  }));
}

// ─── Sub-Components ──────────────────────────────────────────────────────────

function OrderItemsSection(props: { items: OrderItemDetail[] }) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm overflow-hidden">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.items")} ({props.items.length})
        </h3>
      </div>

      <div class="divide-y divide-gray-100 dark:divide-forest-700">
        <For each={props.items}>
          {(item) => (
            <div class="px-5 py-3 flex items-center gap-3">
              <div class="w-14 h-14 bg-gray-100 dark:bg-forest-700 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.thumbnail?.url ? (
                  <img
                    src={item.thumbnail.url}
                    alt={item.productName}
                    class="w-full h-full object-cover"
                  />
                ) : (
                  <PackageIcon class="w-5 h-5 text-gray-400 dark:text-gray-500" />
                )}
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {item.productName}
                </h4>
                <Show when={item.variantTitle}>
                  {(variant) => (
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                      {variant()}
                    </p>
                  )}
                </Show>
                <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {t("buyer.orders.details.qty")} × {item.quantity}
                </p>
              </div>
              <div class="text-right flex-shrink-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {formatCurrency(item.subtotal)}
                </p>
                <p class="text-xs text-gray-400 dark:text-gray-500">
                  {formatCurrency(item.unitPrice)} each
                </p>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}

function OrderSummaryWithPayment(props: {
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
  paymentMethod: string | null;
  paymentStatus: string;
}) {
  const { t } = useI18n();

  const paymentStatusClass = createMemo(() => {
    const s = props.paymentStatus;
    if (s === "COMPLETED") return "bg-sage-100 text-sage-700 dark:bg-sage-900/40 dark:text-sage-300";
    if (s === "REFUNDED") return "bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300";
    if (s === "FAILED") return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
    return "bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300";
  });

  const paymentStatusIcon = createMemo(() => {
    const s = props.paymentStatus;
    if (s === "COMPLETED") return <CheckCircleIcon class="w-3 h-3" />;
    if (s === "REFUNDED") return <ArrowPathIcon class="w-3 h-3" />;
    if (s === "FAILED") return <XCircleIcon class="w-3 h-3" />;
    return null;
  });

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.summary")}
        </h3>
      </div>
      <div class="p-5 space-y-2.5">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            {t("buyer.orders.details.subtotal")}
          </span>
          <span class="font-medium text-gray-900 dark:text-white">
            {formatCurrency(props.subtotal)}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
            <TruckIcon class="w-3.5 h-3.5" />
            {t("buyer.orders.details.shipping")}
          </span>
          <span class="font-medium text-gray-900 dark:text-white">
            {formatCurrency(props.shippingCost)}
          </span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">
            {t("buyer.orders.details.tax")}
          </span>
          <span class="font-medium text-gray-900 dark:text-white">
            {formatCurrency(props.tax)}
          </span>
        </div>
        <div class="pt-2.5 border-t border-gray-200 dark:border-forest-700 flex justify-between">
          <span class="text-sm font-bold text-gray-900 dark:text-white">
            {t("buyer.orders.details.total")}
          </span>
          <span class="text-base font-bold text-forest-600 dark:text-forest-400">
            {formatCurrency(props.total)}
          </span>
        </div>

        <div class="pt-3 border-t border-gray-100 dark:border-forest-700 space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <CreditCardIcon class="w-3.5 h-3.5" />
              {t("buyer.orders.details.method")}
            </span>
            <span class="font-medium text-gray-900 dark:text-white">
              {props.paymentMethod?.replace(/_/g, " ") ?? "—"}
            </span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-gray-500 dark:text-gray-400">
              {t("buyer.orders.details.paymentStatus")}
            </span>
            <span class={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${paymentStatusClass()}`}>
              {paymentStatusIcon()}
              {props.paymentStatus.replace(/_/g, " ")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShopInfoCard(props: { shopName: string; shopLogo: string | null; shopId: string }) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.seller")}
        </h3>
      </div>
      <div class="p-5">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-forest-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {props.shopLogo ? (
              <img src={props.shopLogo} alt={props.shopName} class="w-full h-full object-cover" />
            ) : (
              <span class="text-sm font-bold text-gray-500 dark:text-gray-400">
                {(props.shopName || '?').charAt(0)}
              </span>
            )}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {props.shopName || 'Unknown Shop'}
            </p>
            <A
              href={`/app/shops/${props.shopId}`}
              class="text-xs text-forest-600 dark:text-forest-400 hover:underline flex items-center gap-0.5"
            >
              {t("buyer.orders.details.viewShop")}
              <ArrowTopRightOnSquareIcon class="w-3 h-3" />
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShippingAddressCompact(props: { address: OrderAddressDetail }) {
  const { t } = useI18n();

  const addr = props.address;

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-5 py-3 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPinIcon class="w-4 h-4 text-gray-400" />
          {t("buyer.orders.details.shippingAddress")}
        </h3>
      </div>
      <div class="p-5 space-y-3">
        {/* Recipient & Phone */}
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 dark:text-white">
              {addr.recipientName}
            </p>
            {addr.companyName && (
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {addr.companyName}
              </p>
            )}
          </div>
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            {addr.phone}
          </span>
        </div>

        {/* Divider */}
        <div class="h-px bg-gray-100 dark:bg-forest-700" />

        {/* Address Lines */}
        <div class="space-y-1">
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {addr.addressLine1}
          </p>
          {addr.addressLine2 && (
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {addr.addressLine2}
            </p>
          )}
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {addr.city}
            {addr.state ? `, ${addr.state}` : ""}
            {addr.postalCode ? ` - ${addr.postalCode}` : ""}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {addr.country}
          </p>
        </div>

        {/* Delivery Instructions */}
        <Show when={addr.deliveryInstructions}>
          {(instructions) => (
            <div class="flex items-start gap-2 bg-cream-50 dark:bg-cream-900/20 rounded-lg p-3">
              <PackageIcon class="w-3.5 h-3.5 text-cream-600 dark:text-cream-400 flex-shrink-0 mt-0.5" />
              <p class="text-xs text-cream-700 dark:text-cream-300">
                {instructions()}
              </p>
            </div>
          )}
        </Show>
      </div>
    </div>
  );
}

function OrderCard(props: { order: OrderDetail }) {
  const { t } = useI18n();
  const order = props.order;

  const statusType = createMemo((): StatusType => mapStatus(order.status));
  const canCancel = order.status === "PENDING_PAYMENT" || order.status === "CONFIRMED" || order.status === "PROCESSING";
  const isCancelled = order.status === "CANCELLED" || order.status === "EXPIRED";
  const isDelivered = order.status === "DELIVERED";

  const timelineEvents = createMemo(() => buildTimelineFromHistory(order.statusHistory));

  return (
    <div class="space-y-5">
      {/* Order Header */}
      <div class="flex items-center gap-3 flex-wrap">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">
          {order.orderNumber}
        </h2>
        <StatusBadge status={statusType()} class="text-sm px-3 py-1" />
      </div>

      {/* Notes */}
      <Show when={order.notes}>
        {(notes) => (
          <div class="bg-cream-50 dark:bg-cream-900/20 border border-cream-200 dark:border-cream-800 rounded-xl p-4">
            <div class="flex items-start gap-3">
              <PackageIcon class="w-4 h-4 text-cream-600 dark:text-cream-400 flex-shrink-0 mt-0.5" />
              <p class="text-sm text-cream-700 dark:text-cream-300">
                {notes()}
              </p>
            </div>
          </div>
        )}
      </Show>

      {/* Cancellation Banner */}
      <Show when={isCancelled}>
        <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div class="flex items-start gap-3">
            <XCircleIcon class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-red-800 dark:text-red-300">
                {t("buyer.orders.details.orderCancelled")}
              </p>
              <Show when={order.cancelledReason}>
                {(reason) => (
                  <p class="text-sm text-red-600 dark:text-red-400 mt-1">
                    {reason()}
                  </p>
                )}
              </Show>
              <Show when={order.cancelledAt}>
                {(date) => (
                  <p class="text-xs text-red-500 dark:text-red-400 mt-1">
                    {t("buyer.orders.details.cancelledOn")} {formatFullDate(date())}
                  </p>
                )}
              </Show>
            </div>
          </div>
        </div>
      </Show>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div class="lg:col-span-2 space-y-6">
          <OrderItemsSection items={order.items} />
          <OrderTimeline events={timelineEvents()} currentStatus={order.status} />
        </div>

        {/* Right Column — sticky, 2-col grid for compact cards */}
        <div class="lg:col-span-1">
          <div class="sticky top-4 space-y-6">
            {/* Summary + Payment merged */}
            <OrderSummaryWithPayment
              subtotal={order.subtotal}
              shippingCost={order.shippingCost}
              tax={order.tax}
              total={order.total}
              paymentMethod={order.paymentMethod}
              paymentStatus={order.paymentStatus}
            />

            {/* Shop Info */}
            <ShopInfoCard shopName={order.shopName} shopLogo={order.shopLogo} shopId={order.shopId} />

            {/* Address — compact */}
            <Show when={order.address}>
              {(addr) => <ShippingAddressCompact address={addr()} />}
            </Show>

            {/* Action Buttons */}
            <div class="space-y-2.5">
              <Show when={canCancel}>
                <button
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                >
                  <XCircleIcon class="w-4 h-4" />
                  {t("buyer.orders.details.cancelOrder")}
                </button>
              </Show>

              <Show when={isDelivered}>
                <button
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
                >
                  <FlagIcon class="w-4 h-4" />
                  {t("buyer.orders.details.writeReview")}
                </button>
              </Show>

              <A
                href="/app/products"
                class="block w-full text-center px-4 py-2.5 border border-gray-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-700 rounded-xl font-semibold text-sm transition-colors"
              >
                {t("buyer.orders.details.continueShopping")}
              </A>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const OrderDetails: Component = () => {
  const params = useParams<{ id: string }>();
  const { t } = useI18n();
  const group = createAsync(() => getOrderGroup(params.id).then((res) => res.data));

  const groupItemCount = createMemo(() =>
    group()?.orders.reduce((sum, o) => sum + o.items.length, 0) ?? 0
  );

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    window.history.back();
  };

  return (
    <SafeErrorBoundary
      fallback={(error, reset) => (
        <InlineErrorFallback error={error} reset={reset} label={t("buyer.orders.details.title")} />
      )}
    >
      <Suspense
        fallback={
          <div class="flex items-center justify-center py-12">
            <div class="animate-spin w-8 h-8 border-4 border-forest-600 border-t-transparent rounded-full" />
            <span class="ml-3 text-gray-500 dark:text-gray-400">
              {t("buyer.orders.details.loading")}
            </span>
          </div>
        }
      >
        <Show when={group()}>
          {(g) => (
            <div class="mx-auto max-w-[1400px]">
              {/* Header */}
              <div class="mb-8">
                <div class="flex items-center gap-3 mb-4">
                  <button
                    onClick={handleBack}
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
                    aria-label={t("common.back")}
                  >
                    <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 flex-wrap">
                      <div class="w-10 h-10 rounded-xl bg-forest-600 flex items-center justify-center shadow-sm">
                        <ShoppingBagIcon class="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                          {t("buyer.orders.details.title")}
                        </h1>
                        <p class="text-base text-gray-500 dark:text-gray-400">
                          {t("buyer.orders.details.placedOn")} {formatFullDate(g().createdAt)} {t("common.at")} {formatTime(g().createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handlePrint}
                    class="p-2.5 rounded-lg border border-gray-200 dark:border-forest-700 hover:bg-gray-50 dark:hover:bg-forest-700 transition-colors"
                    aria-label={t("buyer.orders.details.print")}
                  >
                    <PrinterIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Group Summary Bar */}
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm p-4">
                  <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-6">
                      <div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {t("buyer.orders.details.orders")}
                        </p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{g().orders.length}</p>
                      </div>
                      <div>
                        <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {t("buyer.orders.details.items")}
                        </p>
                        <p class="text-lg font-bold text-gray-900 dark:text-white">{groupItemCount()}</p>
                      </div>
                    </div>
                    <div class="text-right">
                      <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                        {t("buyer.orders.details.groupTotal")}
                      </p>
                      <p class="text-lg font-bold text-forest-600 dark:text-forest-400">
                        {formatCurrency(g().totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders */}
              <For each={g().orders}>
                {(order, i) => (
                  <div class={`mb-8 last:mb-0 ${i() > 0 ? "pt-6 border-t border-gray-200 dark:border-forest-700" : ""}`}>
                    <OrderCard order={order} />
                  </div>
                )}
              </For>
            </div>
          )}
        </Show>
      </Suspense>
    </SafeErrorBoundary>
  );
};

export default OrderDetails;
