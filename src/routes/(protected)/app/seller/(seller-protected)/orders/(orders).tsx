import { createSignal, createMemo, For, Show } from "solid-js";
import { ErrorBoundary } from "solid-js";
import Badge from "~/components/ui/Badge";
import Button from "~/components/ui/Button";
import { FilterSelect } from "~/components/ui/FilterSelect";
import { SectionErrorFallback } from "~/components/seller/SectionErrorFallback";
import { MagnifyingGlassIcon, EyeIcon, PackageIcon, CheckCircleIcon, ClockIcon, XCircleIcon, TruckIcon } from "~/components/icons";

type OrderStatus = "PENDING_PAYMENT" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "EXPIRED";
type PaymentStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "REFUNDED" | "PARTIALLY_REFUNDED";

interface OrderItem {
  id: string;
  productName: string;
  variantTitle: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  imageUrl: string | null;
}

interface OrderAddress {
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
}

interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: OrderAddress;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancelledReason?: string;
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ord-001",
    orderNumber: "BF-2026-00142",
    items: [
      {
        id: "item-001",
        productName: "Monstera Deliciosa Albo",
        variantTitle: "Mature Albo (15cm)",
        sku: "ALBO-MED-001",
        quantity: 1,
        unitPrice: 4500,
        subtotal: 4500,
        imageUrl: "https://images.unsplash.com/photo-1614594975545-a93436b82922?w=100&h=100&fit=crop",
      },
      {
        id: "item-002",
        productName: "Organic Plant Fertilizer",
        variantTitle: "500g Pack",
        sku: "FERT-ORG-500",
        quantity: 2,
        unitPrice: 350,
        subtotal: 700,
        imageUrl: null,
      },
    ],
    customerName: "Rahima Begum",
    customerEmail: "rahima@email.com",
    customerPhone: "+8801712345678",
    address: {
      recipientName: "Rahima Begum",
      phone: "+8801712345678",
      addressLine1: "House 42, Road 7",
      addressLine2: "Block E, Banani",
      city: "Dhaka",
      state: "Dhaka Division",
      postalCode: "1213",
      country: "Bangladesh",
    },
    subtotal: 5200,
    shippingCost: 120,
    tax: 260,
    total: 5580,
    status: "DELIVERED",
    paymentStatus: "COMPLETED",
    paymentMethod: "CARD",
    notes: "Please handle with care - live plant",
    createdAt: "2026-05-20T10:30:00Z",
    updatedAt: "2026-05-25T14:00:00Z",
  },
  {
    id: "ord-002",
    orderNumber: "BF-2026-00141",
    items: [
      {
        id: "item-003",
        productName: "Fiddle Leaf Fig",
        variantTitle: "Large (30cm)",
        sku: "FLF-LRG-030",
        quantity: 1,
        unitPrice: 3200,
        subtotal: 3200,
        imageUrl: "https://images.unsplash.com/photo-1597054377850-6931d3657333?w=100&h=100&fit=crop",
      },
    ],
    customerName: "Karim Ahmed",
    customerEmail: "karim@email.com",
    customerPhone: "+8801812345678",
    address: {
      recipientName: "Karim Ahmed",
      phone: "+8801812345678",
      addressLine1: "Flat 5B, Sunflower Apartments",
      city: "Chittagong",
      state: "Chittagong Division",
      postalCode: "4212",
      country: "Bangladesh",
    },
    subtotal: 3200,
    shippingCost: 150,
    tax: 160,
    total: 3510,
    status: "SHIPPED",
    paymentStatus: "COMPLETED",
    paymentMethod: "BKASH",
    createdAt: "2026-05-19T14:15:00Z",
    updatedAt: "2026-05-22T09:30:00Z",
  },
  {
    id: "ord-003",
    orderNumber: "BF-2026-00140",
    items: [
      {
        id: "item-004",
        productName: "Snake Plant Laurentii",
        variantTitle: "Medium (25cm)",
        sku: "SNK-MED-025",
        quantity: 2,
        unitPrice: 1800,
        subtotal: 3600,
        imageUrl: "https://images.unsplash.com/photo-1596547609652-9cf5d6d163d1?w=100&h=100&fit=crop",
      },
      {
        id: "item-005",
        productName: "Ceramic Pot - White",
        variantTitle: "6 inch",
        sku: "POT-CER-WHT-6",
        quantity: 2,
        unitPrice: 450,
        subtotal: 900,
        imageUrl: null,
      },
    ],
    customerName: "Fatima Khan",
    customerEmail: "fatima@email.com",
    customerPhone: "+8801912345678",
    address: {
      recipientName: "Fatima Khan",
      phone: "+8801912345678",
      addressLine1: "House 12, Lane 3",
      addressLine2: "Mirpur DOHS",
      city: "Dhaka",
      state: "Dhaka Division",
      postalCode: "1216",
      country: "Bangladesh",
    },
    subtotal: 4500,
    shippingCost: 120,
    tax: 225,
    total: 4845,
    status: "PROCESSING",
    paymentStatus: "COMPLETED",
    paymentMethod: "NAGAD",
    notes: "Gift wrap requested",
    createdAt: "2026-05-18T09:20:00Z",
    updatedAt: "2026-05-18T16:45:00Z",
  },
  {
    id: "ord-004",
    orderNumber: "BF-2026-00139",
    items: [
      {
        id: "item-006",
        productName: "Pothos Golden",
        variantTitle: "Trailing (40cm)",
        sku: "POT-GOLD-40",
        quantity: 3,
        unitPrice: 650,
        subtotal: 1950,
        imageUrl: "https://images.unsplash.com/photo-1598556776374-2a40b4a3c447?w=100&h=100&fit=crop",
      },
    ],
    customerName: "Sunny Das",
    customerEmail: "sunny@email.com",
    customerPhone: "+8801612345678",
    address: {
      recipientName: "Sunny Das",
      phone: "+8801612345678",
      addressLine1: "Plot 8, Sector 4",
      city: "Uttara",
      state: "Dhaka Division",
      postalCode: "1230",
      country: "Bangladesh",
    },
    subtotal: 1950,
    shippingCost: 80,
    tax: 97.5,
    total: 2127.5,
    status: "CONFIRMED",
    paymentStatus: "COMPLETED",
    paymentMethod: "COD",
    createdAt: "2026-05-17T16:45:00Z",
    updatedAt: "2026-05-17T18:00:00Z",
  },
  {
    id: "ord-005",
    orderNumber: "BF-2026-00138",
    items: [
      {
        id: "item-007",
        productName: "Monstera Deliciosa Albo",
        variantTitle: "Juvenile Albo (10cm)",
        sku: "ALBO-SML-002",
        quantity: 1,
        unitPrice: 2800,
        subtotal: 2800,
        imageUrl: "https://images.unsplash.com/photo-1614594975545-a93436b82922?w=100&h=100&fit=crop",
      },
      {
        id: "item-008",
        productName: "Monstera Deliciosa Albo",
        variantTitle: "Large Albo (20cm)",
        sku: "ALBO-LRG-003",
        quantity: 1,
        unitPrice: 7500,
        subtotal: 7500,
        imageUrl: "https://images.unsplash.com/photo-1614594975545-a93436b82922?w=100&h=100&fit=crop",
      },
    ],
    customerName: "Nusrat Jahan",
    customerEmail: "nusrat@email.com",
    customerPhone: "+8801512345678",
    address: {
      recipientName: "Nusrat Jahan",
      phone: "+8801512345678",
      addressLine1: "House 78, Road 11",
      addressLine2: "Gulshan 2",
      city: "Dhaka",
      state: "Dhaka Division",
      postalCode: "1212",
      country: "Bangladesh",
    },
    subtotal: 10300,
    shippingCost: 150,
    tax: 515,
    total: 10965,
    status: "PENDING_PAYMENT",
    paymentStatus: "PENDING",
    createdAt: "2026-05-17T11:00:00Z",
    updatedAt: "2026-05-17T11:00:00Z",
  },
  {
    id: "ord-006",
    orderNumber: "BF-2026-00137",
    items: [
      {
        id: "item-009",
        productName: "Rubber Plant Tineke",
        variantTitle: "Medium (35cm)",
        sku: "RUB-TIN-035",
        quantity: 1,
        unitPrice: 2200,
        subtotal: 2200,
        imageUrl: "https://images.unsplash.com/photo-1617173944883-66a1a4a4769d?w=100&h=100&fit=crop",
      },
    ],
    customerName: "Tanvir Rahman",
    customerEmail: "tanvir@email.com",
    customerPhone: "+8801412345678",
    address: {
      recipientName: "Tanvir Rahman",
      phone: "+8801412345678",
      addressLine1: "Flat 3A, Green View Tower",
      addressLine2: "Dhanmondi 27",
      city: "Dhaka",
      state: "Dhaka Division",
      postalCode: "1205",
      country: "Bangladesh",
    },
    subtotal: 2200,
    shippingCost: 100,
    tax: 110,
    total: 2410,
    status: "CANCELLED",
    paymentStatus: "REFUNDED",
    cancelledAt: "2026-05-16T13:30:00Z",
    cancelledReason: "Customer requested cancellation - changed mind",
    createdAt: "2026-05-15T08:10:00Z",
    updatedAt: "2026-05-16T13:30:00Z",
  },
  {
    id: "ord-007",
    orderNumber: "BF-2026-00136",
    items: [
      {
        id: "item-010",
        productName: "Peace Lily",
        variantTitle: "Large (45cm)",
        sku: "PEACE-LRG-45",
        quantity: 1,
        unitPrice: 1500,
        subtotal: 1500,
        imageUrl: "https://images.unsplash.com/photo-1612363228924-325d7df7d9a3?w=100&h=100&fit=crop",
      },
      {
        id: "item-011",
        productName: "Self-Watering Pot",
        variantTitle: "8 inch - Gray",
        sku: "POT-SW-GRY-8",
        quantity: 1,
        unitPrice: 800,
        subtotal: 800,
        imageUrl: null,
      },
    ],
    customerName: "Priya Sharma",
    customerEmail: "priya@email.com",
    customerPhone: "+8801312345678",
    address: {
      recipientName: "Priya Sharma",
      phone: "+8801312345678",
      addressLine1: "House 5, Road 1",
      city: "Sylhet",
      state: "Sylhet Division",
      postalCode: "3100",
      country: "Bangladesh",
    },
    subtotal: 2300,
    shippingCost: 130,
    tax: 115,
    total: 2545,
    status: "DELIVERED",
    paymentStatus: "COMPLETED",
    paymentMethod: "CARD",
    createdAt: "2026-05-12T15:10:00Z",
    updatedAt: "2026-05-16T11:00:00Z",
  },
  {
    id: "ord-008",
    orderNumber: "BF-2026-00135",
    items: [
      {
        id: "item-012",
        productName: "Alocasia Polly",
        variantTitle: "Medium (20cm)",
        sku: "ALP-MED-020",
        quantity: 2,
        unitPrice: 1200,
        subtotal: 2400,
        imageUrl: "https://images.unsplash.com/photo-1617173944883-66a1a4a4769d?w=100&h=100&fit=crop",
      },
    ],
    customerName: "Arif Hossain",
    customerEmail: "arif@email.com",
    customerPhone: "+8801212345678",
    address: {
      recipientName: "Arif Hossain",
      phone: "+8801212345678",
      addressLine1: "Flat 7C, River View Apartment",
      addressLine2: "Motijheel C/A",
      city: "Dhaka",
      state: "Dhaka Division",
      postalCode: "1000",
      country: "Bangladesh",
    },
    subtotal: 2400,
    shippingCost: 120,
    tax: 120,
    total: 2640,
    status: "EXPIRED",
    paymentStatus: "FAILED",
    createdAt: "2026-05-10T12:00:00Z",
    updatedAt: "2026-05-12T12:00:00Z",
  },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return "\u2014";
  return `\u09f3${price.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  return `${month} ${day}, ${year}`;
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const month = MONTHS[date.getUTCMonth()];
  const day = date.getUTCDate();
  const year = date.getUTCFullYear();
  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minStr = minutes.toString().padStart(2, "0");
  return `${month} ${day}, ${year}, ${hours}:${minStr} ${ampm}`;
}

function getOrderStatusConfig(status: OrderStatus) {
  const configs: Record<OrderStatus, { label: string; variant: "forest" | "sage" | "cream" | "terracotta" | "default"; icon: string }> = {
    PENDING_PAYMENT: { label: "Pending Payment", variant: "cream", icon: "clock" },
    CONFIRMED: { label: "Confirmed", variant: "sage", icon: "check" },
    PROCESSING: { label: "Processing", variant: "cream", icon: "package" },
    SHIPPED: { label: "Shipped", variant: "forest", icon: "truck" },
    DELIVERED: { label: "Delivered", variant: "forest", icon: "check" },
    CANCELLED: { label: "Cancelled", variant: "terracotta", icon: "x" },
    EXPIRED: { label: "Expired", variant: "terracotta", icon: "x" },
  };
  return configs[status];
}

function getPaymentStatusConfig(status: PaymentStatus) {
  const configs: Record<PaymentStatus, { label: string; variant: "forest" | "sage" | "cream" | "terracotta" | "default" }> = {
    PENDING: { label: "Pending", variant: "cream" },
    PROCESSING: { label: "Processing", variant: "sage" },
    COMPLETED: { label: "Completed", variant: "forest" },
    FAILED: { label: "Failed", variant: "terracotta" },
    REFUNDED: { label: "Refunded", variant: "sage" },
    PARTIALLY_REFUNDED: { label: "Partially Refunded", variant: "sage" },
  };
  return configs[status];
}

function getPaymentMethodLabel(method?: string): string {
  const labels: Record<string, string> = {
    COD: "Cash on Delivery",
    CARD: "Credit/Debit Card",
    BKASH: "bKash",
    NAGAD: "Nagad",
    SSLCOMMERCE: "SSLCommerz",
  };
  return method ? (labels[method] || method) : "\u2014";
}

const ORDER_STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "PENDING_PAYMENT", label: "Pending Payment", dotColor: "bg-cream-400" },
  { value: "CONFIRMED", label: "Confirmed", dotColor: "bg-sage-400" },
  { value: "PROCESSING", label: "Processing", dotColor: "bg-cream-400" },
  { value: "SHIPPED", label: "Shipped", dotColor: "bg-forest-400" },
  { value: "DELIVERED", label: "Delivered", dotColor: "bg-forest-500" },
  { value: "CANCELLED", label: "Cancelled", dotColor: "bg-terracotta-400" },
  { value: "EXPIRED", label: "Expired", dotColor: "bg-terracotta-400" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "", label: "All Payments" },
  { value: "PENDING", label: "Pending", dotColor: "bg-cream-400" },
  { value: "PROCESSING", label: "Processing", dotColor: "bg-sage-400" },
  { value: "COMPLETED", label: "Completed", dotColor: "bg-forest-500" },
  { value: "FAILED", label: "Failed", dotColor: "bg-terracotta-400" },
  { value: "REFUNDED", label: "Refunded", dotColor: "bg-sage-400" },
];

export default function SellerOrdersRoute() {
  const [searchQuery, setSearchQuery] = createSignal("");
  const [statusFilter, setStatusFilter] = createSignal("");
  const [paymentFilter, setPaymentFilter] = createSignal("");
  const [dateFrom, setDateFrom] = createSignal("");
  const [dateTo, setDateTo] = createSignal("");
  const [selectedOrder, setSelectedOrder] = createSignal<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = createSignal(false);

  const clearDateFilter = () => {
    setDateFrom("");
    setDateTo("");
  };

  const stats = createMemo(() => {
    const all = MOCK_ORDERS;
    return {
      total: all.length,
      pendingPayment: all.filter((o) => o.status === "PENDING_PAYMENT").length,
      confirmed: all.filter((o) => o.status === "CONFIRMED").length,
      processing: all.filter((o) => o.status === "PROCESSING").length,
      shipped: all.filter((o) => o.status === "SHIPPED").length,
      delivered: all.filter((o) => o.status === "DELIVERED").length,
      cancelled: all.filter((o) => o.status === "CANCELLED").length,
      totalRevenue: all.filter((o) => o.status === "DELIVERED").reduce((sum, o) => sum + o.total, 0),
      pendingAmount: all.filter((o) => o.status === "PENDING_PAYMENT").reduce((sum, o) => sum + o.total, 0),
    };
  });

  const filteredOrders = createMemo(() => {
    let result = MOCK_ORDERS;
    if (statusFilter()) result = result.filter((o) => o.status === statusFilter());
    if (paymentFilter()) result = result.filter((o) => o.paymentStatus === paymentFilter());
    const fromVal = dateFrom();
    const toVal = dateTo();
    if (fromVal) {
      const from = new Date(fromVal + "T00:00:00Z");
      result = result.filter((o) => new Date(o.createdAt) >= from);
    }
    if (toVal) {
      const to = new Date(toVal + "T23:59:59.999Z");
      result = result.filter((o) => new Date(o.createdAt) <= to);
    }
    if (searchQuery()) {
      const q = searchQuery().toLowerCase();
      result = result.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q) ||
          o.items.some((item) => item.productName.toLowerCase().includes(q))
      );
    }
    return result;
  });

  const openOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setTimeout(() => setSelectedOrder(null), 200);
  };

  return (
    <ErrorBoundary fallback={(error) => <SectionErrorFallback error={error} title="orders" />}>
      <div class="space-y-6">
        {/* Page Header */}
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage and track all customer orders
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => { setStatusFilter(""); setPaymentFilter(""); clearDateFilter(); }}
            class={`bg-white dark:bg-forest-800 rounded-xl border-2 p-4 shadow-sm text-left transition-all hover:shadow-md ${
              !statusFilter() && !paymentFilter() && !dateFrom() && !dateTo()
                ? "border-forest-500 dark:border-forest-400 ring-2 ring-forest-500/20"
                : "border-gray-200 dark:border-forest-700 hover:border-forest-300 dark:hover:border-forest-600"
            }`}
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Orders</p>
                <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats().total}</p>
              </div>
              <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-sm">
                <PackageIcon class="w-5 h-5 text-white" />
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("PROCESSING")}
            class={`bg-white dark:bg-forest-800 rounded-xl border-2 p-4 shadow-sm text-left transition-all hover:shadow-md ${
              statusFilter() === "PROCESSING"
                ? "border-cream-500 dark:border-cream-400 ring-2 ring-cream-500/20"
                : "border-gray-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600"
            }`}
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Processing</p>
                <p class="text-2xl font-bold text-cream-600 dark:text-cream-400 mt-1">
                  {stats().pendingPayment + stats().confirmed + stats().processing}
                </p>
              </div>
              <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-cream-400 to-cream-500 flex items-center justify-center shadow-sm">
                <ClockIcon class="w-5 h-5 text-white" />
              </div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("SHIPPED")}
            class={`bg-white dark:bg-forest-800 rounded-xl border-2 p-4 shadow-sm text-left transition-all hover:shadow-md ${
              statusFilter() === "SHIPPED"
                ? "border-sage-500 dark:border-sage-400 ring-2 ring-sage-500/20"
                : "border-gray-200 dark:border-forest-700 hover:border-sage-300 dark:hover:border-forest-600"
            }`}
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Shipped</p>
                <p class="text-2xl font-bold text-sage-600 dark:text-sage-400 mt-1">{stats().shipped}</p>
              </div>
              <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-sage-500 to-sage-600 flex items-center justify-center shadow-sm">
                <TruckIcon class="w-5 h-5 text-white" />
              </div>
            </div>
          </button>
          <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Revenue</p>
                <p class="text-lg font-bold text-forest-600 dark:text-forest-400 mt-1">{formatPrice(stats().totalRevenue)}</p>
              </div>
              <div class="w-11 h-11 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-sm">
                <CheckCircleIcon class="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
          <div class="px-5 py-4 border-b border-gray-200 dark:border-forest-700">
            <div class="flex flex-col gap-3">
              {/* Row 1: Search + Status + Payment */}
              <div class="flex flex-col lg:flex-row gap-3">
                {/* Search */}
                <div class="flex-1 relative">
                  <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by order number, customer, or product..."
                    value={searchQuery()}
                    onInput={(e) => setSearchQuery(e.currentTarget.value)}
                    class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-forest-700 focus:border-forest-500 dark:focus:border-forest-400 bg-white dark:bg-forest-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-standard focus-ring-flat text-sm"
                  />
                </div>
                {/* Status Filter */}
                <FilterSelect
                  options={ORDER_STATUS_OPTIONS}
                  value={statusFilter()}
                  onChange={setStatusFilter}
                  placeholder="All Statuses"
                  class="w-full lg:w-52"
                />
                {/* Payment Filter */}
                <FilterSelect
                  options={PAYMENT_STATUS_OPTIONS}
                  value={paymentFilter()}
                  onChange={setPaymentFilter}
                  placeholder="All Payments"
                  class="w-full lg:w-52"
                />
              </div>

              {/* Row 2: Date Range (From → To) */}
              <div class="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div class="flex items-center gap-2">
                  <div>
                    <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">From</label>
                    <input
                      type="date"
                      value={dateFrom()}
                      onChange={(e) => setDateFrom(e.currentTarget.value)}
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-gray-900 dark:text-white text-sm focus:border-forest-500 dark:focus:border-forest-400 focus-ring-flat"
                    />
                  </div>
                  <div>
                    <label class="block text-xs text-gray-500 dark:text-gray-400 mb-1">To</label>
                    <input
                      type="date"
                      value={dateTo()}
                      onChange={(e) => setDateTo(e.currentTarget.value)}
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-forest-700 bg-white dark:bg-forest-800 text-gray-900 dark:text-white text-sm focus:border-forest-500 dark:focus:border-forest-400 focus-ring-flat"
                    />
                  </div>
                </div>

                {/* Active filter indicators + Clear */}
                <div class="flex items-center gap-2 flex-wrap">
                  <Show when={statusFilter() || paymentFilter() || dateFrom() || dateTo() || searchQuery()}>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("");
                        setPaymentFilter("");
                        clearDateFilter();
                      }}
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-forest-700 hover:bg-gray-200 dark:hover:bg-forest-600 transition-colors"
                    >
                      <XCircleIcon class="w-3.5 h-3.5" />
                      Clear All
                    </button>
                  </Show>
                  <Show when={statusFilter()}>
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300">
                      {getOrderStatusConfig(statusFilter() as OrderStatus)?.label || statusFilter()}
                      <button onClick={() => setStatusFilter("")} class="ml-0.5 hover:text-forest-900 dark:hover:text-forest-100">
                        <XCircleIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                  <Show when={paymentFilter()}>
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-sage-100 text-sage-700 dark:bg-sage-900/40 dark:text-sage-300">
                      {getPaymentStatusConfig(paymentFilter() as PaymentStatus)?.label || paymentFilter()}
                      <button onClick={() => setPaymentFilter("")} class="ml-0.5 hover:text-sage-900 dark:hover:text-sage-100">
                        <XCircleIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                  <Show when={dateFrom() || dateTo()}>
                    <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300">
                      {dateFrom() ? formatDate(new Date(dateFrom() + "T00:00:00Z").toISOString()) : "Beginning"}
                      {" → "}
                      {dateTo() ? formatDate(new Date(dateTo() + "T00:00:00Z").toISOString()) : "Now"}
                      <button onClick={clearDateFilter} class="ml-0.5 hover:text-cream-900 dark:hover:text-cream-100">
                        <XCircleIcon class="w-3 h-3" />
                      </button>
                    </span>
                  </Show>
                </div>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-forest-700 bg-gray-50 dark:bg-forest-900/50">
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Order</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Items</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Total</th>
                  <th class="text-left px-5 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th class="text-right px-5 py-3 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                <Show when={filteredOrders().length > 0} fallback={
                  <tr>
                    <td colspan="6" class="px-5 py-16 text-center">
                      <div class="flex flex-col items-center">
                        <div class="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-forest-700 flex items-center justify-center mb-4">
                          <PackageIcon class="w-8 h-8 text-gray-300 dark:text-gray-500" />
                        </div>
                        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">No orders found</p>
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                }>
                  <For each={filteredOrders()}>
                    {(order) => {
                      const orderStatusConfig = getOrderStatusConfig(order.status);
                      const paymentStatusConfig = getPaymentStatusConfig(order.paymentStatus);
                      const statusBorderColor: Record<string, string> = {
                        PENDING_PAYMENT: "border-l-cream-400",
                        CONFIRMED: "border-l-sage-400",
                        PROCESSING: "border-l-cream-400",
                        SHIPPED: "border-l-forest-400",
                        DELIVERED: "border-l-forest-500",
                        CANCELLED: "border-l-terracotta-400",
                        EXPIRED: "border-l-terracotta-400",
                      };
                      return (
                        <tr
                          class={`border-b border-gray-100 dark:border-forest-700/50 hover:bg-gray-50 dark:hover:bg-forest-900/30 transition-colors border-l-4 ${statusBorderColor[order.status] || "border-l-gray-300"}`}
                        >
                          {/* Order Number + Date */}
                          <td class="px-5 py-4">
                            <div>
                              <p class="text-sm font-semibold text-gray-900 dark:text-white font-mono">
                                {order.orderNumber}
                              </p>
                              <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                          </td>
                          {/* Customer */}
                          <td class="px-5 py-4">
                            <div>
                              <p class="text-sm font-medium text-gray-900 dark:text-white">{order.customerName}</p>
                              <p class="text-xs text-gray-400 dark:text-gray-500">{order.customerEmail}</p>
                            </div>
                          </td>
                          {/* Items Preview */}
                          <td class="px-5 py-4">
                            <div class="space-y-2.5">
                              <For each={order.items}>
                                {(item) => (
                                  <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-forest-700 flex-shrink-0 flex items-center justify-center border border-gray-200 dark:border-forest-600">
                                      {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.productName} class="w-full h-full object-cover" />
                                      ) : (
                                        <PackageIcon class="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                      )}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                      <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {item.productName}
                                      </p>
                                      <p class="text-xs text-gray-400 dark:text-gray-500 truncate">
                                        {item.variantTitle}
                                      </p>
                                    </div>
                                    <span class="text-xs font-medium text-gray-500 dark:text-gray-400 flex-shrink-0">
                                      ×{item.quantity}
                                    </span>
                                  </div>
                                )}
                              </For>
                            </div>
                          </td>
                          {/* Total */}
                          <td class="px-5 py-4">
                            <p class="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(order.total)}</p>
                          </td>
                          {/* Status */}
                          <td class="px-5 py-4">
                            <div class="flex flex-col gap-1.5">
                              <Badge variant={orderStatusConfig.variant}>
                                {orderStatusConfig.label}
                              </Badge>
                              <Badge variant={paymentStatusConfig.variant}>
                                {paymentStatusConfig.label}
                              </Badge>
                            </div>
                          </td>
                          {/* Action */}
                          <td class="px-5 py-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openOrderDetail(order)}
                              class="inline-flex items-center gap-1.5"
                            >
                              <EyeIcon class="w-4 h-4" />
                              View
                            </Button>
                          </td>
                        </tr>
                      );
                    }}
                  </For>
                </Show>
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div class="px-5 py-4 border-t border-gray-200 dark:border-forest-700 flex items-center justify-between">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Showing <span class="font-medium">{filteredOrders().length}</span> of{" "}
              <span class="font-medium">{MOCK_ORDERS.length}</span> orders
            </p>
            <Show when={filteredOrders().length > 0}>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Total: <span class="text-forest-600 dark:text-forest-400">{formatPrice(filteredOrders().reduce((sum, o) => sum + o.total, 0))}</span>
              </p>
            </Show>
          </div>
        </div>

        {/* Order Detail Modal */}
        <Show when={showDetailModal() && selectedOrder()}>
          {(order) => (
            <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Backdrop */}
              <div
                class="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeDetailModal}
              />
              {/* Modal */}
              <div class="relative bg-white dark:bg-forest-800 rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-forest-700">
                {/* Modal Header */}
                <div class="sticky top-0 bg-white dark:bg-forest-800 border-b border-gray-200 dark:border-forest-700 px-6 py-5 flex items-start justify-between z-10">
                  <div class="flex items-center gap-4">
                    <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-forest-500 to-forest-600 flex items-center justify-center shadow-sm">
                      <PackageIcon class="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 class="text-lg font-bold text-gray-900 dark:text-white">
                        {order().orderNumber}
                      </h2>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        Placed on {formatDateTime(order().createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeDetailModal}
                    class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-forest-700 transition-colors"
                  >
                    <XCircleIcon class="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div class="p-6 space-y-5">
                  {/* Status Badges */}
                  <div class="flex flex-wrap gap-2">
                    <Badge variant={getOrderStatusConfig(order().status).variant}>
                      {getOrderStatusConfig(order().status).label}
                    </Badge>
                    <Badge variant={getPaymentStatusConfig(order().paymentStatus).variant}>
                      {getPaymentStatusConfig(order().paymentStatus).label}
                    </Badge>
                    <Show when={order().paymentMethod}>
                      <Badge variant="default">
                        {getPaymentMethodLabel(order().paymentMethod)}
                      </Badge>
                    </Show>
                  </div>

                  {/* Customer + Shipping Grid */}
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Customer Info */}
                    <div class="bg-gray-50 dark:bg-forest-900/30 rounded-xl p-4 space-y-2.5">
                      <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Customer
                      </h3>
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{order().customerName}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-300">{order().customerEmail}</p>
                      <p class="text-sm text-gray-600 dark:text-gray-300">{order().customerPhone}</p>
                    </div>

                    {/* Shipping Address */}
                    <div class="bg-gray-50 dark:bg-forest-900/30 rounded-xl p-4 space-y-2.5">
                      <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Shipping Address
                      </h3>
                      <p class="text-sm text-gray-700 dark:text-gray-300">
                        {order().address.recipientName}
                      </p>
                      <p class="text-sm text-gray-700 dark:text-gray-300">
                        {order().address.addressLine1}
                      </p>
                      {order().address.addressLine2 && (
                        <p class="text-sm text-gray-700 dark:text-gray-300">
                          {order().address.addressLine2}
                        </p>
                      )}
                      <p class="text-sm text-gray-700 dark:text-gray-300">
                        {order().address.city}{order().address.state ? `, ${order().address.state}` : ""} {order().address.postalCode}
                      </p>
                      <p class="text-sm text-gray-700 dark:text-gray-300">{order().address.country}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                      Order Items ({order().items.length})
                    </h3>
                    <div class="space-y-3">
                      <For each={order().items}>
                        {(item) => (
                          <div class="flex flex-col rounded-xl border border-gray-200 dark:border-forest-700 overflow-hidden bg-white dark:bg-forest-800">
                            {/* Thumbnail */}
                            <div class="relative w-full h-32 bg-gray-100 dark:bg-forest-700">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.productName} class="w-full h-full object-cover" />
                              ) : (
                                <div class="w-full h-full flex items-center justify-center">
                                  <PackageIcon class="w-10 h-10 text-gray-300 dark:text-gray-500" />
                                </div>
                              )}
                              {/* Quantity Badge */}
                              <div class="absolute top-2 right-2 bg-white dark:bg-forest-800 rounded-lg px-2.5 py-1 shadow-sm border border-gray-200 dark:border-forest-700">
                                <span class="text-xs font-semibold text-gray-900 dark:text-white">×{item.quantity}</span>
                              </div>
                            </div>
                            {/* Details */}
                            <div class="p-4">
                              <div class="flex items-start justify-between gap-3">
                                <div class="min-w-0 flex-1">
                                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{item.productName}</p>
                                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.variantTitle}</p>
                                  <p class="text-xs font-mono text-gray-400 dark:text-gray-500 mt-1">{item.sku}</p>
                                </div>
                                <div class="text-right flex-shrink-0">
                                  <p class="text-xs text-gray-400 dark:text-gray-500">Unit</p>
                                  <p class="text-sm font-semibold text-gray-900 dark:text-white">{formatPrice(item.unitPrice)}</p>
                                </div>
                              </div>
                              {/* Subtotal */}
                              <div class="mt-3 pt-3 border-t border-gray-100 dark:border-forest-700/50 flex items-center justify-between">
                                <span class="text-xs font-medium text-gray-500 dark:text-gray-400">Subtotal</span>
                                <span class="text-base font-bold text-gray-900 dark:text-white">{formatPrice(item.subtotal)}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>

                  {/* Price Summary */}
                  <div class="bg-gray-50 dark:bg-forest-900/30 rounded-xl p-4 space-y-2">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span class="text-gray-900 dark:text-white font-medium">{formatPrice(order().subtotal)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Shipping</span>
                      <span class="text-gray-900 dark:text-white font-medium">{formatPrice(order().shippingCost)}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-500 dark:text-gray-400">Tax</span>
                      <span class="text-gray-900 dark:text-white font-medium">{formatPrice(order().tax)}</span>
                    </div>
                    <div class="border-t border-gray-200 dark:border-forest-700 pt-3 mt-3">
                      <div class="flex justify-between">
                        <span class="text-base font-bold text-gray-900 dark:text-white">Total</span>
                        <span class="text-xl font-bold text-forest-600 dark:text-forest-400">{formatPrice(order().total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <Show when={order().notes}>
                    <div class="bg-cream-50 dark:bg-cream-900/20 rounded-xl p-4 border border-cream-200 dark:border-cream-800">
                      <h3 class="text-xs font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-2">
                        Customer Notes
                      </h3>
                      <p class="text-sm text-gray-700 dark:text-gray-300">{order().notes}</p>
                    </div>
                  </Show>

                  {/* Cancellation Info */}
                  <Show when={order().status === "CANCELLED" && order().cancelledReason}>
                    <div class="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
                      <h3 class="text-xs font-semibold text-red-900 dark:text-red-300 uppercase tracking-wider mb-2">
                        Cancellation Details
                      </h3>
                      <p class="text-sm text-red-700 dark:text-red-300">{order().cancelledReason}</p>
                      {order().cancelledAt && (
                        <p class="text-xs text-red-500 dark:text-red-400 mt-2">
                          Cancelled on {formatDateTime(order().cancelledAt!)}
                        </p>
                      )}
                    </div>
                  </Show>

                  {/* Order Meta */}
                  <div class="text-xs text-gray-400 dark:text-gray-500 space-y-0.5 pt-2 border-t border-gray-200 dark:border-forest-700">
                    <p>Created: {formatDateTime(order().createdAt)}</p>
                    <p>Last Updated: {formatDateTime(order().updatedAt)}</p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div class="sticky bottom-0 bg-white dark:bg-forest-800 border-t border-gray-200 dark:border-forest-700 px-6 py-4 flex justify-end">
                  <Button variant="outline" onClick={closeDetailModal}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Show>
      </div>
    </ErrorBoundary>
  );
}
