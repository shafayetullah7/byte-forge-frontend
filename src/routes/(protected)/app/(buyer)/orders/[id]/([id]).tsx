import { Component, Show, For, createMemo } from "solid-js";
import { A } from "@solidjs/router";
import { useI18n } from "~/i18n";
import { SafeErrorBoundary, InlineErrorFallback } from "~/components/errors";
import { StatusBadge } from "~/components/ui/StatusBadge";
import type { StatusType } from "~/components/ui/StatusBadge";
import { mapStatus } from "../components/utils";
import { OrderTimeline, type TimelineEvent } from "./components/OrderTimeline";
import type { OrderGroupDetail, OrderDetail, OrderItemDetail, OrderAddressDetail, OrderStatusHistoryDetail } from "~/lib/api/types/order.types";
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
} from "~/components/icons";

// ─── Static Mock Data matching OrderGroupDetail API type ─────────────────────

const MOCK_ORDER_GROUP: OrderGroupDetail = {
  id: "group-001",
  totalAmount: "4850.00",
  createdAt: "2024-03-10T08:30:00Z",
  updatedAt: "2024-03-14T14:20:00Z",
  orders: [
    {
      id: "order-001",
      orderNumber: "ORD-2024-001",
      shopId: "shop-001",
      shopName: "Green Leaf Nursery",
      shopLogo: null,
      status: "SHIPPED",
      paymentStatus: "COMPLETED",
      paymentMethod: "BKASH",
      subtotal: "2200.00",
      shippingCost: "150.00",
      tax: "100.00",
      total: "2450.00",
      notes: "Please handle with care - live plants",
      cancelledAt: null,
      cancelledReason: null,
      createdAt: "2024-03-10T08:30:00Z",
      updatedAt: "2024-03-14T14:20:00Z",
      address: {
        id: "addr-001",
        recipientName: "Rahim Ahmed",
        phone: "+8801712345678",
        addressLine1: "House 42, Road 11",
        addressLine2: "Block E, Banani",
        city: "Dhaka",
        state: null,
        postalCode: "1213",
        country: "Bangladesh",
        companyName: null,
        deliveryInstructions: "Call before delivery",
      },
      items: [
        {
          id: "item-1",
          productName: "Monstera Deliciosa",
          variantTitle: "Large (2ft)",
          sku: "SKU-MON-001",
          unitPrice: "1500.00",
          quantity: 1,
          subtotal: "1500.00",
          thumbnail: { id: "img-1", url: "" },
        },
        {
          id: "item-2",
          productName: "Fiddle Leaf Fig",
          variantTitle: "Medium (1.5ft)",
          sku: "SKU-FDF-002",
          unitPrice: "700.00",
          quantity: 1,
          subtotal: "700.00",
          thumbnail: { id: "img-2", url: "" },
        },
      ],
      statusHistory: [
        { id: "tl-1", fromStatus: null, toStatus: "PENDING_PAYMENT", notes: null, createdAt: "2024-03-10T08:30:00Z" },
        { id: "tl-2", fromStatus: "PENDING_PAYMENT", toStatus: "CONFIRMED", notes: null, createdAt: "2024-03-10T09:15:00Z" },
        { id: "tl-3", fromStatus: "CONFIRMED", toStatus: "PROCESSING", notes: null, createdAt: "2024-03-11T10:00:00Z" },
        { id: "tl-4", fromStatus: "PROCESSING", toStatus: "SHIPPED", notes: "Tracking: STL-123456789", createdAt: "2024-03-14T14:20:00Z" },
      ],
    },
    {
      id: "order-002",
      orderNumber: "ORD-2024-002",
      shopId: "shop-002",
      shopName: "Plant Paradise BD",
      shopLogo: null,
      status: "DELIVERED",
      paymentStatus: "COMPLETED",
      paymentMethod: "NAGAD",
      subtotal: "1600.00",
      shippingCost: "120.00",
      tax: "80.00",
      total: "1800.00",
      notes: null,
      cancelledAt: null,
      cancelledReason: null,
      createdAt: "2024-03-10T08:30:00Z",
      updatedAt: "2024-03-12T16:00:00Z",
      address: {
        id: "addr-002",
        recipientName: "Rahim Ahmed",
        phone: "+8801712345678",
        addressLine1: "House 42, Road 11",
        addressLine2: "Block E, Banani",
        city: "Dhaka",
        state: null,
        postalCode: "1213",
        country: "Bangladesh",
        companyName: null,
        deliveryInstructions: null,
      },
      items: [
        {
          id: "item-3",
          productName: "Snake Plant",
          variantTitle: "Small",
          sku: "SKU-SNP-003",
          unitPrice: "400.00",
          quantity: 2,
          subtotal: "800.00",
          thumbnail: { id: "img-3", url: "" },
        },
        {
          id: "item-4",
          productName: "Peace Lily",
          variantTitle: "Medium",
          sku: "SKU-PEL-004",
          unitPrice: "800.00",
          quantity: 1,
          subtotal: "800.00",
          thumbnail: { id: "img-4", url: "" },
        },
      ],
      statusHistory: [
        { id: "tl-5", fromStatus: null, toStatus: "PENDING_PAYMENT", notes: null, createdAt: "2024-03-10T08:30:00Z" },
        { id: "tl-6", fromStatus: "PENDING_PAYMENT", toStatus: "CONFIRMED", notes: null, createdAt: "2024-03-10T09:00:00Z" },
        { id: "tl-7", fromStatus: "CONFIRMED", toStatus: "PROCESSING", notes: null, createdAt: "2024-03-10T14:00:00Z" },
        { id: "tl-8", fromStatus: "PROCESSING", toStatus: "SHIPPED", notes: "Tracking: Pathao-98765", createdAt: "2024-03-11T10:00:00Z" },
        { id: "tl-9", fromStatus: "SHIPPED", toStatus: "DELIVERED", notes: "Delivered successfully", createdAt: "2024-03-12T16:00:00Z" },
      ],
    },
    {
      id: "order-003",
      orderNumber: "ORD-2024-003",
      shopId: "shop-003",
      shopName: "Urban Garden",
      shopLogo: null,
      status: "CANCELLED",
      paymentStatus: "REFUNDED",
      paymentMethod: "BKASH",
      subtotal: "300.00",
      shippingCost: "100.00",
      tax: "50.00",
      total: "450.00",
      notes: null,
      cancelledAt: "2024-03-10T12:00:00Z",
      cancelledReason: "Customer requested cancellation - changed mind",
      createdAt: "2024-03-10T08:30:00Z",
      updatedAt: "2024-03-10T12:00:00Z",
      address: {
        id: "addr-003",
        recipientName: "Rahim Ahmed",
        phone: "+8801712345678",
        addressLine1: "House 42, Road 11",
        addressLine2: "Block E, Banani",
        city: "Dhaka",
        state: null,
        postalCode: "1213",
        country: "Bangladesh",
        companyName: null,
        deliveryInstructions: null,
      },
      items: [
        {
          id: "item-5",
          productName: "Aloe Vera",
          variantTitle: "Small",
          sku: "SKU-ALV-005",
          unitPrice: "300.00",
          quantity: 1,
          subtotal: "300.00",
          thumbnail: { id: "img-5", url: "" },
        },
      ],
      statusHistory: [
        { id: "tl-10", fromStatus: null, toStatus: "PENDING_PAYMENT", notes: null, createdAt: "2024-03-10T08:30:00Z" },
        { id: "tl-11", fromStatus: "PENDING_PAYMENT", toStatus: "CONFIRMED", notes: null, createdAt: "2024-03-10T09:30:00Z" },
        { id: "tl-12", fromStatus: "CONFIRMED", toStatus: "CANCELLED", notes: "Customer requested cancellation", createdAt: "2024-03-10T12:00:00Z" },
      ],
    },
  ],
};

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

function buildAddressString(addr: OrderAddressDetail): string {
  const parts = [
    addr.recipientName,
    addr.addressLine1,
    addr.addressLine2,
    `${addr.city}${addr.state ? `, ${addr.state}` : ""} ${addr.postalCode ?? ""}`,
    addr.country,
  ];
  return parts.filter(Boolean).join(", ");
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
      <div class="px-6 py-4 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.items")} ({props.items.length})
        </h3>
      </div>

      <div class="divide-y divide-gray-100 dark:divide-forest-700">
        <For each={props.items}>
          {(item) => (
            <div class="px-6 py-4 flex items-center gap-4">
              <div class="w-16 h-16 bg-gray-100 dark:bg-forest-700 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                {item.thumbnail?.url ? (
                  <img
                    src={item.thumbnail.url}
                    alt={item.productName}
                    class="w-full h-full object-cover"
                  />
                ) : (
                  <PackageIcon class="w-6 h-6 text-gray-400 dark:text-gray-500" />
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

function OrderSummarySection(props: {
  subtotal: string;
  shippingCost: string;
  tax: string;
  total: string;
}) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.summary")}
        </h3>
      </div>
      <div class="p-6 space-y-3">
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
        <div class="pt-3 border-t border-gray-200 dark:border-forest-700 flex justify-between">
          <span class="text-base font-bold text-gray-900 dark:text-white">
            {t("buyer.orders.details.total")}
          </span>
          <span class="text-lg font-bold text-forest-600 dark:text-forest-400">
            {formatCurrency(props.total)}
          </span>
        </div>
      </div>
    </div>
  );
}

function ShopInfoSection(props: { shopName: string; shopLogo: string | null; shopId: string }) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.seller")}
        </h3>
      </div>
      <div class="p-6">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-lg bg-gray-100 dark:bg-forest-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {props.shopLogo ? (
              <img src={props.shopLogo} alt={props.shopName} class="w-full h-full object-cover" />
            ) : (
              <span class="text-sm font-bold text-gray-500 dark:text-gray-400">
                {props.shopName.charAt(0)}
              </span>
            )}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
              {props.shopName}
            </p>
            <A
              href={`/app/shops/${props.shopId}`}
              class="text-xs text-forest-600 dark:text-forest-400 hover:underline"
            >
              {t("buyer.orders.details.viewShop")}
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShippingAddressSection(props: { address: OrderAddressDetail }) {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <MapPinIcon class="w-4 h-4 text-gray-400" />
          {t("buyer.orders.details.shippingAddress")}
        </h3>
      </div>
      <div class="p-6">
        <p class="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {buildAddressString(props.address)}
        </p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {props.address.phone}
        </p>
        <Show when={props.address.deliveryInstructions}>
          {(instructions) => (
            <p class="text-xs text-gray-400 dark:text-gray-500 mt-2 italic">
              {t("buyer.orders.details.deliveryInstructions")}: {instructions()}
            </p>
          )}
        </Show>
      </div>
    </div>
  );
}

function PaymentInfoSection(props: {
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
      <div class="px-6 py-4 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <CreditCardIcon class="w-4 h-4 text-gray-400" />
          {t("buyer.orders.details.payment")}
        </h3>
      </div>
      <div class="p-6 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500 dark:text-gray-400">
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
    <div class="space-y-6">
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

        {/* Right Column */}
        <div class="space-y-6">
          <OrderSummarySection
            subtotal={order.subtotal}
            shippingCost={order.shippingCost}
            tax={order.tax}
            total={order.total}
          />
          <ShopInfoSection shopName={order.shopName} shopLogo={order.shopLogo} shopId={order.shopId} />

          <Show when={order.address}>
            {(addr) => <ShippingAddressSection address={addr()} />}
          </Show>

          <PaymentInfoSection paymentMethod={order.paymentMethod} paymentStatus={order.paymentStatus} />

          {/* Action Buttons */}
          <div class="space-y-3">
            <Show when={canCancel}>
              <button
                class="w-full flex items-center justify-center gap-2 px-5 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
              >
                <XCircleIcon class="w-4 h-4" />
                {t("buyer.orders.details.cancelOrder")}
              </button>
            </Show>

            <Show when={isDelivered}>
              <button
                class="w-full flex items-center justify-center gap-2 px-5 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-sm"
              >
                <FlagIcon class="w-4 h-4" />
                {t("buyer.orders.details.writeReview")}
              </button>
            </Show>

            <A
              href="/app/products"
              class="block w-full text-center px-5 py-3 border border-gray-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-forest-700 rounded-xl font-semibold text-sm transition-colors"
            >
              {t("buyer.orders.details.continueShopping")}
            </A>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

const OrderDetails: Component = () => {
  const { t } = useI18n();
  const group = MOCK_ORDER_GROUP;

  const groupItemCount = createMemo(() =>
    group.orders.reduce((sum, o) => sum + o.items.length, 0)
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
                    {t("buyer.orders.details.placedOn")} {formatFullDate(group.createdAt)} {t("common.at")} {formatTime(group.createdAt)}
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
                  <p class="text-lg font-bold text-gray-900 dark:text-white">{group.orders.length}</p>
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
                  {formatCurrency(group.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <For each={group.orders}>
          {(order, i) => (
            <div class={`mb-8 last:mb-0 ${i() > 0 ? "pt-6 border-t border-gray-200 dark:border-forest-700" : ""}`}>
              <OrderCard order={order} />
            </div>
          )}
        </For>
      </div>
    </SafeErrorBoundary>
  );
};

export default OrderDetails;
