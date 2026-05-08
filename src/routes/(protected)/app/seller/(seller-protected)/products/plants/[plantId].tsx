import { createSignal, createMemo, Show, Suspense, For, ErrorBoundary } from "solid-js";
import { A, useParams } from "@solidjs/router";
import { useI18n } from "~/i18n";
import Badge from "~/components/ui/Badge";
import Button from "~/components/ui/Button";
import {
  ChevronLeftIcon,
  PencilIcon,
  ArchiveIcon,
  TrashIcon,
  PackageIcon,
  DollarSignIcon,
  CubeIcon,
  ClockIcon,
  CheckCircleIcon,
  FolderIcon,
  TagIcon,
  SunIcon,
  MoonIcon,
  EyeIcon,
  ShoppingBagIcon,
  StarIcon,
  HeartIcon,
  TrendingUpIcon,
  CalendarIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  CheckBadgeIcon,
  ExclamationCircleIcon,
  InfoCircleIcon,
  ChevronRightIcon,
  ArrowPathIcon,
  ShareIcon,
  DotsVerticalIcon,
  MagnifyingGlassIcon,
  FilterIcon,
  XIcon,
  SpinnerIcon,
  GlobeAltIcon,
  ScissorsIcon,
  PlusIcon,
  DropletIcon,
  ThermometerIcon,
} from "~/components/icons";

// ========================
// Mock Data
// ========================

const MOCK_PLANT = {
  id: "plant-001",
  slug: "monstera-deliciosa-albo",
  status: "ACTIVE" as const,
  thumbnail: {
    id: "media-001",
    url: null,
  },
  name: "Monstera Deliciosa Albo",
  shortDescription: "Stunning variegated Monstera with white-marbled leaves. A true collector's piece.",
  description: "The Monstera Deliciosa Albo Variegata is one of the most sought-after houseplants in the world. Each leaf features unique white variegation patterns that make every plant truly one-of-a-kind. This tropical beauty is native to Central American rainforests and can grow up to 30 feet in the wild, though typically stays much smaller as a houseplant.",
  scientificName: "Monstera deliciosa 'Albo Variegata'",
  category: {
    id: "cat-001",
    slug: "indoor-plants",
    name: "Indoor Plants",
  },
  tags: [
    { id: "tag-001", slug: "variegated", name: "Variegated" },
    { id: "tag-002", slug: "rare", name: "Rare" },
    { id: "tag-003", slug: "collector-item", name: "Collector's Item" },
    { id: "tag-004", slug: "indoor", name: "Indoor" },
  ],
  price: "4500.00",
  inventoryCount: 12,
  createdAt: "2025-12-15T10:30:00Z",
  updatedAt: "2026-05-01T14:22:00Z",

  plantDetails: {
    lightRequirement: "BRIGHT_INDIRECT",
    wateringFrequency: "WEEKLY",
    humidityLevel: "HIGH",
    careDifficulty: "INTERMEDIATE",
    growthRate: "MODERATE",
    temperatureRange: "18-27°C",
    matureHeight: "1.5-3m",
    matureSpread: "0.6-1.2m",
    translations: {
      en: {
        commonNames: "Albo Monstera, White Variegated Monstera, Ceriman",
        origin: "Central America (Panama, southern Mexico)",
        soilType: "Well-draining aroid mix (orchid bark, perlite, peat)",
        toxicityInfo: "Toxic to cats and dogs if ingested. Contains calcium oxalate crystals.",
      },
      bn: {
        commonNames: "অ্যালবো মনস্টেরা, সাদা দাগওয়ালা মনস্টেরা",
        origin: "মধ্য আমেরিকা (পানামা, দক্ষিণ মেক্সিকো)",
        soilType: "সু-nিষ্কাশনকারী অরয়েড মিক্স",
        toxicityInfo: "বিড়াল ও কুকুরের জন্য বিষাক্ত।",
      },
    },
  },

  variants: [
    {
      id: "var-001",
      sku: "ALBO-MED-001",
      price: 4500,
      inventoryCount: 8,
      trackInventory: true,
      lowStockThreshold: 3,
      isBase: true,
      isActive: true,
      attributes: {
        growthStage: "MATURE",
        plantForm: "UPRIGHT",
        variegation: "ALBO",
        leafDensity: "DENSE",
        stemCount: 3,
        currentHeight: "45cm",
        currentSpread: "35cm",
        propagationType: "CUTTING",
        containerType: "NURSERY_POT",
        containerSize: "15cm",
      },
      images: [
        { id: "img-001", url: null, alt: "Front view" },
        { id: "img-002", url: null, alt: "Side view" },
        { id: "img-003", url: null, alt: "Leaf detail" },
      ],
    },
    {
      id: "var-002",
      sku: "ALBO-SML-002",
      price: 2800,
      inventoryCount: 4,
      trackInventory: true,
      lowStockThreshold: 2,
      isBase: false,
      isActive: true,
      attributes: {
        growthStage: "JUVENILE",
        plantForm: "UPRIGHT",
        variegation: "ALBO",
        leafDensity: "MODERATE",
        stemCount: 1,
        currentHeight: "25cm",
        currentSpread: "20cm",
        propagationType: "CUTTING",
        containerType: "NURSERY_POT",
        containerSize: "10cm",
      },
      images: [],
    },
  ],

  careGuide: {
    en: {
      lightInstructions: "Provide bright indirect light. Avoid direct sunlight which can scorch the white variegated portions. An east-facing window is ideal.",
      wateringInstructions: "Water when the top 2-3 inches of soil are dry. Typically every 7-10 days. Ensure proper drainage to prevent root rot.",
      humidityInstructions: "Maintain humidity above 60%. Use a humidifier or pebble tray. Mist leaves regularly in dry conditions.",
      fertilizerSchedule: "Feed with balanced liquid fertilizer (20-20-20) diluted to half strength every 2-4 weeks during growing season (spring-summer).",
      repottingFrequency: "Repot every 12-18 months or when roots emerge from drainage holes. Use fresh aroid mix.",
      pruningNotes: "Remove yellow or damaged leaves at the stem base. Prune to control size and encourage bushier growth.",
      commonProblems: "Brown leaf edges (low humidity), yellowing leaves (overwatering), loss of variegation (insufficient light), root rot (poor drainage).",
      seasonalCare: "Reduce watering in winter. Maintain consistent temperature. Avoid cold drafts and heating vents.",
    },
    bn: {
      lightInstructions: "উজ্জ্বল পরোক্ষ আলো দিন। সরাসরি সূর্যের আলো এড়িয়ে চলুন।",
      wateringInstructions: "মাটির উপরের ২-৩ ইঞ্চি শুকিয়ে গেলে পানি দিন। সাধারণত প্রতি ৭-১০ দিনে।",
      humidityInstructions: "আর্দ্রতা ৬০% এর উপরে রাখুন। হিউমিডিফায়ার ব্যবহার করুন।",
      fertilizerSchedule: "বৃদ্ধির মৌসুমে প্রতি ২-৪ সপ্তাহে ভারসাম্যপূর্ণ সার দিন।",
      repottingFrequency: "প্রতি ১২-১৮ মাসে পুনরায় পোট করুন।",
      pruningNotes: "হলুদ বা ক্ষতিগ্রস্ত পাতা কাটুন।",
      commonProblems: "বাদামী পাতার প্রান্ত (কম আর্দ্রতা), হলুদ পাতা (অতিরিক্ত পানি)।",
      seasonalCare: "শীতকালে পানির পরিমাণ কমান।",
    },
  },
};

const MOCK_STATS = {
  totalViews: 2847,
  viewsThisMonth: 423,
  totalOrders: 156,
  ordersThisMonth: 23,
  totalRevenue: "702000.00",
  revenueThisMonth: "103500.00",
  avgRating: 4.6,
  totalReviews: 89,
  conversionRate: 5.5,
  stockTurnover: 3.2,
  viewsByPeriod: [
    { period: "7 days", value: 98, change: "+12%" },
    { period: "30 days", value: 423, change: "+8%" },
    { period: "90 days", value: 1247, change: "+23%" },
  ],
  ordersByPeriod: [
    { period: "7 days", value: 5, change: "-2%" },
    { period: "30 days", value: 23, change: "+15%" },
    { period: "90 days", value: 67, change: "+31%" },
  ],
  revenueByPeriod: [
    { period: "7 days", value: "22,500", change: "-2%" },
    { period: "30 days", value: "1,03,500", change: "+15%" },
    { period: "90 days", value: "3,01,500", change: "+31%" },
  ],
};

const MOCK_REVIEWS = [
  {
    id: "rev-001",
    customerName: "Rahima Begum",
    customerAvatar: null,
    rating: 5,
    title: "Absolutely stunning plant!",
    comment: "The variegation on this Monstera is incredible. Each leaf has unique white patterns. It arrived well-packaged and healthy. Already producing new leaves!",
    date: "2026-04-28T10:00:00Z",
    verifiedPurchase: true,
    images: ["img-review-001", "img-review-002"],
    helpful: 12,
  },
  {
    id: "rev-002",
    customerName: "Karim Ahmed",
    customerAvatar: null,
    rating: 4,
    title: "Beautiful but needs care",
    comment: "Great plant overall. The variegation is good though not as white as the photos. It's adapting well to my home. Would recommend for experienced plant parents.",
    date: "2026-04-25T14:30:00Z",
    verifiedPurchase: true,
    images: ["img-review-003"],
    helpful: 8,
  },
  {
    id: "rev-003",
    customerName: "Fatima Khan",
    customerAvatar: null,
    rating: 5,
    title: "Perfect condition, fast delivery",
    comment: "Packaging was excellent. Plant arrived vibrant and healthy. Already has a new leaf unfurling. Very happy with this purchase!",
    date: "2026-04-20T09:15:00Z",
    verifiedPurchase: true,
    images: [],
    helpful: 15,
  },
  {
    id: "rev-004",
    customerName: "Sunny Das",
    customerAvatar: null,
    rating: 3,
    title: "Decent plant, some issues",
    comment: "Plant is okay but had some brown edges on arrival. New growth looks healthy though. Variegation is more cream than pure white.",
    date: "2026-04-15T16:45:00Z",
    verifiedPurchase: true,
    images: ["img-review-004"],
    helpful: 5,
  },
  {
    id: "rev-005",
    customerName: "Nusrat Jahan",
    customerAvatar: null,
    rating: 5,
    title: "Best Albo I've seen locally",
    comment: "I've ordered from multiple sellers and this is by far the best quality Albo Monstera available locally. The variegation is stunning and the plant is very healthy.",
    date: "2026-04-10T11:20:00Z",
    verifiedPurchase: true,
    images: ["img-review-005", "img-review-006", "img-review-007"],
    helpful: 22,
  },
];

const MOCK_REVIEWS_SUMMARY = {
  average: 4.6,
  total: 89,
  distribution: [
    { stars: 5, count: 62, percentage: 69.7 },
    { stars: 4, count: 18, percentage: 20.2 },
    { stars: 3, count: 6, percentage: 6.7 },
    { stars: 2, count: 2, percentage: 2.2 },
    { stars: 1, count: 1, percentage: 1.1 },
  ],
  highlights: [
    { label: "Healthy arrival", count: 45 },
    { label: "Good variegation", count: 38 },
    { label: "Fast delivery", count: 32 },
    { label: "New growth", count: 28 },
    { label: "Great packaging", count: 25 },
  ],
};

const MOCK_ORDERS = [
  {
    id: "ord-2026-0451",
    orderDate: "2026-05-07T14:30:00Z",
    customerName: "Rahima Begum",
    customerEmail: "rahima@email.com",
    quantity: 1,
    variantSku: "ALBO-MED-001",
    variantName: "Mature Albo (15cm)",
    unitPrice: 4500,
    totalAmount: 4500,
    status: "DELIVERED",
    rating: 5,
  },
  {
    id: "ord-2026-0448",
    orderDate: "2026-05-06T10:15:00Z",
    customerName: "Karim Ahmed",
    customerEmail: "karim@email.com",
    quantity: 2,
    variantSku: "ALBO-MED-001",
    variantName: "Mature Albo (15cm)",
    unitPrice: 4500,
    totalAmount: 9000,
    status: "SHIPPED",
    rating: null,
  },
  {
    id: "ord-2026-0439",
    orderDate: "2026-05-04T16:45:00Z",
    customerName: "Fatima Khan",
    customerEmail: "fatima@email.com",
    quantity: 1,
    variantSku: "ALBO-SML-002",
    variantName: "Juvenile Albo (10cm)",
    unitPrice: 2800,
    totalAmount: 2800,
    status: "DELIVERED",
    rating: 5,
  },
  {
    id: "ord-2026-0432",
    orderDate: "2026-05-02T09:20:00Z",
    customerName: "Sunny Das",
    customerEmail: "sunny@email.com",
    quantity: 1,
    variantSku: "ALBO-MED-001",
    variantName: "Mature Albo (15cm)",
    unitPrice: 4500,
    totalAmount: 4500,
    status: "DELIVERED",
    rating: 3,
  },
  {
    id: "ord-2026-0428",
    orderDate: "2026-05-01T11:00:00Z",
    customerName: "Nusrat Jahan",
    customerEmail: "nusrat@email.com",
    quantity: 1,
    variantSku: "ALBO-MED-001",
    variantName: "Mature Albo (15cm)",
    unitPrice: 4500,
    totalAmount: 4500,
    status: "DELIVERED",
    rating: 5,
  },
  {
    id: "ord-2026-0415",
    orderDate: "2026-04-28T13:30:00Z",
    customerName: "Tanvir Rahman",
    customerEmail: "tanvir@email.com",
    quantity: 3,
    variantSku: "ALBO-SML-002",
    variantName: "Juvenile Albo (10cm)",
    unitPrice: 2800,
    totalAmount: 8400,
    status: "CANCELLED",
    rating: null,
  },
  {
    id: "ord-2026-0408",
    orderDate: "2026-04-25T15:10:00Z",
    customerName: "Priya Sharma",
    customerEmail: "priya@email.com",
    quantity: 1,
    variantSku: "ALBO-MED-001",
    variantName: "Mature Albo (15cm)",
    unitPrice: 4500,
    totalAmount: 4500,
    status: "DELIVERED",
    rating: 4,
  },
];

const MOCK_ACTIVITY = [
  {
    id: "act-001",
    type: "ORDER",
    description: "New order #ord-2026-0451 placed by Rahima Begum",
    timestamp: "2026-05-07T14:30:00Z",
    icon: "shopping-bag",
  },
  {
    id: "act-002",
    type: "REVIEW",
    description: "New 5-star review from Rahima Begum",
    timestamp: "2026-04-28T10:00:00Z",
    icon: "star",
  },
  {
    id: "act-003",
    type: "STOCK",
    description: "Stock updated: 12 units (was 14)",
    timestamp: "2026-04-25T09:00:00Z",
    icon: "cube",
  },
  {
    id: "act-004",
    type: "EDIT",
    description: "Price updated: ৳4,200 → ৳4,500",
    timestamp: "2026-04-20T14:15:00Z",
    icon: "pencil",
  },
  {
    id: "act-005",
    type: "STATUS",
    description: "Status changed from DRAFT to ACTIVE",
    timestamp: "2026-04-15T11:30:00Z",
    icon: "check-circle",
  },
  {
    id: "act-006",
    type: "IMAGE",
    description: "New images added to variant ALBO-MED-001",
    timestamp: "2026-04-12T16:45:00Z",
    icon: "image",
  },
  {
    id: "act-007",
    type: "EDIT",
    description: "Description updated",
    timestamp: "2026-04-10T10:00:00Z",
    icon: "pencil",
  },
  {
    id: "act-008",
    type: "CREATED",
    description: "Plant created",
    timestamp: "2025-12-15T10:30:00Z",
    icon: "plus",
  },
];

// ========================
// Helpers
// ========================

function getStatusVariant(status: string): "forest" | "sage" | "cream" | "terracotta" | "default" {
  switch (status) {
    case "ACTIVE": return "forest";
    case "DRAFT": return "cream";
    case "ARCHIVED": return "terracotta";
    default: return "default";
  }
}

function getInventoryStatus(count: number): { label: string; variant: "forest" | "cream" | "terracotta" } {
  if (count === 0) return { label: "Out of Stock", variant: "terracotta" };
  if (count <= 5) return { label: "Low Stock", variant: "cream" };
  return { label: `${count} in stock`, variant: "forest" };
}

function formatPrice(price: string | number | null | undefined): string {
  if (!price) return "—";
  const num = typeof price === "string" ? parseFloat(price) : price;
  return `৳${num.toLocaleString("en-BD", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(dateStr: string): string {
  const now = new Date("2026-05-08T00:00:00Z");
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function getOrderStatusVariant(status: string): "forest" | "sage" | "cream" | "terracotta" | "default" {
  switch (status) {
    case "DELIVERED": return "forest";
    case "SHIPPED": return "sage";
    case "PROCESSING": return "cream";
    case "CANCELLED": return "terracotta";
    default: return "default";
  }
}

function getStarRating(rating: number): string {
  return "★".repeat(rating) + "☆".repeat(5 - rating);
}

function getLightLabel(value: string): string {
  const labels: Record<string, string> = {
    LOW: "Low Light",
    MEDIUM: "Medium Light",
    BRIGHT_INDIRECT: "Bright Indirect",
    DIRECT: "Direct Sunlight",
  };
  return labels[value] || value;
}

function getWateringLabel(value: string): string {
  const labels: Record<string, string> = {
    DAILY: "Daily",
    WEEKLY: "Weekly",
    BI_WEEKLY: "Bi-weekly",
    MONTHLY: "Monthly",
  };
  return labels[value] || value;
}

function getHumidityLabel(value: string): string {
  const labels: Record<string, string> = {
    LOW: "Low (30-40%)",
    MEDIUM: "Medium (40-60%)",
    HIGH: "High (60%+)",
  };
  return labels[value] || value;
}

function getDifficultyLabel(value: string): string {
  const labels: Record<string, string> = {
    BEGINNER: "Beginner",
    INTERMEDIATE: "Intermediate",
    EXPERT: "Expert",
  };
  return labels[value] || value;
}

function getGrowthRateLabel(value: string): string {
  const labels: Record<string, string> = {
    SLOW: "Slow",
    MODERATE: "Moderate",
    FAST: "Fast",
  };
  return labels[value] || value;
}

function getGrowthStageLabel(value: string): string {
  const labels: Record<string, string> = {
    SEEDLING: "Seedling",
    JUVENILE: "Juvenile",
    MATURE: "Mature",
    CUTTING: "Cutting",
  };
  return labels[value] || value;
}

function getPlantFormLabel(value: string): string {
  const labels: Record<string, string> = {
    UPRIGHT: "Upright",
    TRAILING: "Trailing",
    BUSHY: "Bushy",
    CLIMBING: "Climbing",
    ROSETTE: "Rosette",
  };
  return labels[value] || value;
}

function getVariegationLabel(value: string): string {
  const labels: Record<string, string> = {
    NONE: "None",
    VARIEGATED: "Variegated",
    SEMI_VARIEGATED: "Semi-Variegated",
    ALBO: "Albo (White)",
    AUREO: "Aureo (Yellow)",
  };
  return labels[value] || value;
}

function getLeafDensityLabel(value: string): string {
  const labels: Record<string, string> = {
    SPARSE: "Sparse",
    MODERATE: "Moderate",
    DENSE: "Dense",
  };
  return labels[value] || value;
}

function getPropagationLabel(value: string): string {
  const labels: Record<string, string> = {
    CUTTING: "Cutting",
    SEED: "Seed",
    TISSUE_CULTURE: "Tissue Culture",
    AIR_LAYER: "Air Layer",
    DIVISION: "Division",
  };
  return labels[value] || value;
}

function getContainerTypeLabel(value: string): string {
  const labels: Record<string, string> = {
    NURSERY_POT: "Nursery Pot",
    DECORATIVE_POT: "Decorative Pot",
    HANGING_BASKET: "Hanging Basket",
    TERRARIUM: "Terrarium",
    GROW_BAG: "Grow Bag",
  };
  return labels[value] || value;
}

// ========================
// Sub-Components
// ========================

function StatCard(props: {
  icon: any;
  label: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  color: "forest" | "cream" | "terracotta" | "sage";
}) {
  const colorMap = {
    forest: { bg: "bg-forest-100 dark:bg-forest-900/40", text: "text-forest-600 dark:text-forest-400" },
    cream: { bg: "bg-cream-100 dark:bg-cream-900/40", text: "text-cream-600 dark:text-cream-400" },
    terracotta: { bg: "bg-terracotta-100 dark:bg-terracotta-900/40", text: "text-terracotta-600 dark:text-terracotta-400" },
    sage: { bg: "bg-sage-100 dark:bg-sage-900/40", text: "text-sage-600 dark:text-sage-400" },
  };

  const colors = colorMap[props.color];

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl p-5 sm:p-6 border border-cream-200 dark:border-forest-700 shadow-sm">
      <div class="flex items-start justify-between">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{props.label}</p>
          <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">{props.value}</p>
          {props.change && (
            <p class={`text-xs mt-1 font-medium ${
              props.changeType === "positive"
                ? "text-forest-600 dark:text-forest-400"
                : props.changeType === "negative"
                ? "text-terracotta-600 dark:text-terracotta-400"
                : "text-gray-500 dark:text-gray-400"
            }`}>
              {props.change} vs last period
            </p>
          )}
        </div>
        <div class={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
          {props.icon}
        </div>
      </div>
    </div>
  );
}

function SectionCard(props: {
  title: string;
  icon?: any;
  action?: any;
  children: any;
}) {
  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
      <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
        <div class="flex items-center gap-2">
          {props.icon}
          <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">{props.title}</h3>
        </div>
        {props.action}
      </div>
      <div class="p-6">
        {props.children}
      </div>
    </div>
  );
}

function DetailRow(props: { label: string; value: string | number | any; icon?: any }) {
  return (
    <div class="flex items-start gap-3 py-3 border-b border-cream-100 dark:border-forest-700/50 last:border-b-0">
      {props.icon && <div class="mt-0.5 text-gray-400 dark:text-gray-500 flex-shrink-0">{props.icon}</div>}
      <div class="flex-1 min-w-0">
        <p class="text-sm text-gray-500 dark:text-gray-400">{props.label}</p>
        <p class="text-sm font-medium text-forest-800 dark:text-cream-50 mt-0.5">
          {typeof props.value === "string" || typeof props.value === "number" ? props.value : props.value}
        </p>
      </div>
    </div>
  );
}

function StarRatingDisplay(props: { rating: number; size?: string }) {
  const size = props.size || "w-4 h-4";
  return (
    <div class="flex items-center gap-0.5">
      <For each={Array.from({ length: 5 }, (_, i) => i + 1)}>
        {(star) => (
          <StarIcon
            class={`${size} ${
              star <= Math.round(props.rating)
                ? "text-cream-500"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        )}
      </For>
    </div>
  );
}

// ========================
// Main Page
// ========================

export default function PlantDetailPage() {
  const { t } = useI18n();
  const params = useParams();

  const [activeTab, setActiveTab] = createSignal("overview");
  const [orderSearchQuery, setOrderSearchQuery] = createSignal("");
  const [orderStatusFilter, setOrderStatusFilter] = createSignal("");
  const [reviewFilter, setReviewFilter] = createSignal<number | null>(null);

  const plant = MOCK_PLANT;
  const stats = MOCK_STATS;
  const reviews = MOCK_REVIEWS;
  const reviewsSummary = MOCK_REVIEWS_SUMMARY;
  const orders = MOCK_ORDERS;
  const activity = MOCK_ACTIVITY;

  const inventory = getInventoryStatus(plant.inventoryCount);

  const filteredOrders = createMemo(() => {
    let result = orders;
    if (orderStatusFilter()) {
      result = result.filter((o) => o.status === orderStatusFilter());
    }
    if (orderSearchQuery()) {
      const q = orderSearchQuery().toLowerCase();
      result = result.filter(
        (o) =>
          o.id.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.customerEmail.toLowerCase().includes(q)
      );
    }
    return result;
  });

  const filteredReviews = createMemo(() => {
    if (reviewFilter() === null) return reviews;
    return reviews.filter((r) => r.rating === reviewFilter());
  });

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "variants", label: "Variants" },
    { id: "care", label: "Care Guide" },
    { id: "orders", label: `Orders (${orders.length})` },
    { id: "reviews", label: `Reviews (${reviewsSummary.total})` },
    { id: "activity", label: "Activity" },
  ];

  return (
    <div class="px-6 py-8 mx-auto max-w-[1400px]">
      {/* Error Boundary for entire page */}
      <ErrorBoundary
        fallback={(error) => (
          <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 max-w-md mx-auto">
            <div class="flex items-center gap-3 mb-4">
              <ExclamationCircleIcon class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" />
              <h2 class="text-lg font-semibold text-red-900 dark:text-red-200">Failed to Load Plant Details</h2>
            </div>
            <p class="text-sm text-red-700 dark:text-red-300 mb-4">{error.message}</p>
            <div class="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                class="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
              <A
                href="/app/seller/products/plants"
                class="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg text-sm font-medium hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
              >
                Back to Plants
              </A>
            </div>
          </div>
        )}
      >
        {/* Breadcrumb & Header */}
        <div class="mb-6">
          <nav class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <A href="/app/seller" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
              Dashboard
            </A>
            <ChevronRightIcon class="w-4 h-4" />
            <A href="/app/seller/products/plants" class="hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
              Plants
            </A>
            <ChevronRightIcon class="w-4 h-4" />
            <span class="text-forest-800 dark:text-cream-50 font-medium truncate">{plant.name}</span>
          </nav>

          <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div class="flex items-start gap-4">
              <A
                href="/app/seller/products/plants"
                class="p-2 rounded-lg hover:bg-cream-100 dark:hover:bg-forest-700 transition-colors flex-shrink-0 mt-1"
              >
                <ChevronLeftIcon class="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </A>
              <div>
                <div class="flex items-center gap-3 flex-wrap">
                  <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50">
                    {plant.name}
                  </h1>
                  <Badge variant={getStatusVariant(plant.status)}>
                    {plant.status === "ACTIVE" ? "Active" : plant.status === "DRAFT" ? "Draft" : "Archived"}
                  </Badge>
                </div>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {plant.scientificName}
                </p>
                <p class="text-sm text-gray-400 dark:text-gray-500 mt-1">
                  Slug: <span class="font-mono text-xs">{plant.slug}</span>
                </p>
              </div>
            </div>

            <div class="flex items-center gap-2 flex-shrink-0">
              <A
                href={`/app/seller/products/plants/${plant.id}/edit`}
                class="inline-flex items-center gap-2 px-4 py-2.5 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-semibold shadow-sm hover:shadow-md transition-colors"
              >
                <PencilIcon class="w-4 h-4" />
                Edit Plant
              </A>
              <button
                class="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors"
                title="Share"
              >
                <ShareIcon class="w-4 h-4" />
              </button>
              <button
                class="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-cream-200 dark:border-forest-700 text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors"
                title="More actions"
              >
                <DotsVerticalIcon class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <ErrorBoundary
          fallback={(error) => (
            <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
              <p class="text-sm text-amber-700 dark:text-amber-300">Failed to load stats: {error.message}</p>
            </div>
          )}
        >
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={<EyeIcon class={`w-5 h-5 ${"text-forest-600 dark:text-forest-400"}`} />}
              label="Total Views"
              value={stats.totalViews.toLocaleString()}
              change={"+8%"}
              changeType="positive"
              color="forest"
            />
            <StatCard
              icon={<ShoppingBagIcon class="w-5 h-5 text-cream-600 dark:text-cream-400" />}
              label="Total Orders"
              value={stats.totalOrders}
              change={"+15%"}
              changeType="positive"
              color="cream"
            />
            <StatCard
              icon={<DollarSignIcon class="w-5 h-5 text-terracotta-600 dark:text-terracotta-400" />}
              label="Total Revenue"
              value={formatPrice(stats.totalRevenue)}
              change={"+31%"}
              changeType="positive"
              color="terracotta"
            />
            <StatCard
              icon={<StarIcon class="w-5 h-5 text-cream-500" />}
              label="Avg. Rating"
              value={`${stats.avgRating} (${stats.totalReviews} reviews)`}
              color="sage"
            />
          </div>
        </ErrorBoundary>

        {/* Tabs */}
        <div class="mb-6">
          <div class="border-b border-cream-200 dark:border-forest-700">
            <nav class="flex gap-0 -mb-px overflow-x-auto">
              <For each={tabs}>
                {(tab) => (
                  <button
                    onClick={() => setActiveTab(tab.id)}
                    class={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab() === tab.id
                        ? "border-forest-600 text-forest-600 dark:border-forest-400 dark:text-forest-400"
                        : "border-transparent text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 hover:border-forest-300 dark:hover:border-forest-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                )}
              </For>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <Show when={activeTab() === "overview"}>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Plant Info */}
            <div class="lg:col-span-2 space-y-6">
              {/* Description */}
              <SectionCard
                title="Description"
                icon={<PackageIcon class="w-4 h-4 text-gray-400" />}
              >
                <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {plant.description}
                </p>
              </SectionCard>

              {/* Classification */}
              <SectionCard
                title="Classification & Details"
                icon={<FolderIcon class="w-4 h-4 text-gray-400" />}
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                  <DetailRow
                    label="Category"
                    value={plant.category.name}
                    icon={<FolderIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Scientific Name"
                    value={plant.scientificName}
                    icon={<InfoCircleIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Common Names (EN)"
                    value={plant.plantDetails.translations.en.commonNames}
                    icon={<ChatBubbleLeftRightIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Common Names (BN)"
                    value={plant.plantDetails.translations.bn.commonNames}
                    icon={<ChatBubbleLeftRightIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Origin"
                    value={plant.plantDetails.translations.en.origin}
                    icon={<GlobeAltIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Soil Type"
                    value={plant.plantDetails.translations.en.soilType}
                    icon={<CubeIcon class="w-4 h-4" />}
                  />
                  <DetailRow
                    label="Toxicity"
                    value={plant.plantDetails.translations.en.toxicityInfo}
                    icon={<ExclamationCircleIcon class="w-4 h-4" />}
                  />
                </div>

                {/* Tags */}
                <div class="mt-4 pt-4 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</p>
                  <div class="flex flex-wrap gap-2">
                    <For each={plant.tags}>
                      {(tag) => (
                        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cream-200 text-cream-800 dark:bg-cream-900/40 dark:text-cream-300">
                          {tag.name}
                        </span>
                      )}
                    </For>
                  </div>
                </div>
              </SectionCard>

              {/* Pricing & Inventory */}
              <SectionCard
                title="Pricing & Inventory"
                icon={<DollarSignIcon class="w-4 h-4 text-gray-400" />}
              >
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Base Price</p>
                    <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
                      {formatPrice(plant.price)}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Total Inventory</p>
                    <div class="flex items-center gap-2 mt-1">
                      <p class="text-2xl font-bold text-forest-800 dark:text-cream-50">
                        {plant.inventoryCount}
                      </p>
                      <Badge variant={inventory.variant} class="text-xs">
                        {inventory.label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Variants</p>
                    <p class="text-2xl font-bold text-forest-800 dark:text-cream-50 mt-1">
                      {plant.variants.length}
                    </p>
                  </div>
                </div>
              </SectionCard>
            </div>

            {/* Right Column - Care Profile & Quick Info */}
            <div class="space-y-6">
              {/* Care Profile */}
              <SectionCard
                title="Care Profile"
                icon={<SunIcon class="w-4 h-4 text-gray-400" />}
              >
                <DetailRow
                  label="Light"
                  value={getLightLabel(plant.plantDetails.lightRequirement)}
                  icon={<SunIcon class="w-4 h-4" />}
                />
                <DetailRow
                  label="Watering"
                  value={getWateringLabel(plant.plantDetails.wateringFrequency)}
                  icon={<DropletIcon class="w-4 h-4" />}
                />
                <DetailRow
                  label="Humidity"
                  value={getHumidityLabel(plant.plantDetails.humidityLevel)}
                  icon={<MoonIcon class="w-4 h-4" />}
                />
                <DetailRow
                  label="Difficulty"
                  value={getDifficultyLabel(plant.plantDetails.careDifficulty)}
                  icon={<TrendingUpIcon class="w-4 h-4" />}
                />
                <DetailRow
                  label="Growth Rate"
                  value={getGrowthRateLabel(plant.plantDetails.growthRate!)}
                  icon={<TrendingUpIcon class="w-4 h-4" />}
                />
                <DetailRow
                  label="Temperature"
                  value={plant.plantDetails.temperatureRange!}
                  icon={<ThermometerIcon class="w-4 h-4" />}
                />
                <DetailRow
                  label="Mature Height"
                  value={plant.plantDetails.matureHeight!}
                  icon={<TrendingUpIcon class="w-4 h-4" />}
                />
                <DetailRow
                  label="Mature Spread"
                  value={plant.plantDetails.matureSpread!}
                  icon={<TrendingUpIcon class="w-4 h-4" />}
                />
              </SectionCard>

              {/* Timestamps */}
              <SectionCard
                title="Details"
                icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
              >
                <DetailRow
                  label="Created"
                  value={formatDateTime(plant.createdAt)}
                  icon={<CalendarIcon class="w-4 h-4" />}
                />
                <DetailRow
                  label="Last Updated"
                  value={formatDateTime(plant.updatedAt)}
                  icon={<ClockIcon class="w-4 h-4" />}
                />
                <DetailRow
                  label="Plant ID"
                  value={plant.id}
                  icon={<CheckBadgeIcon class="w-4 h-4" />}
                />
              </SectionCard>

              {/* Quick Actions */}
              <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                <h3 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-3">Quick Actions</h3>
                <div class="space-y-2">
                  <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
                    <PencilIcon class="w-4 h-4" />
                    Edit Plant
                  </button>
                  <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
                    <ArchiveIcon class="w-4 h-4" />
                    Archive Plant
                  </button>
                  <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors text-gray-700 dark:text-gray-300">
                    <ArrowPathIcon class="w-4 h-4" />
                    Duplicate Plant
                  </button>
                  <button class="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-terracotta-600 dark:text-terracotta-400">
                    <TrashIcon class="w-4 h-4" />
                    Delete Plant
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Show>

        {/* Variants Tab */}
        <Show when={activeTab() === "variants"}>
          <div class="space-y-6">
            <For each={plant.variants}>
              {(variant, index) => (
                <ErrorBoundary
                  fallback={(error) => (
                    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                      <p class="text-sm text-amber-700 dark:text-amber-300">
                        Failed to load variant {index() + 1}: {error.message}
                      </p>
                    </div>
                  )}
                >
                  <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
                    <div class="px-6 py-4 border-b border-cream-200 dark:border-forest-700 flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <h3 class="text-base font-semibold text-forest-800 dark:text-cream-50">
                          Variant {index() + 1}
                        </h3>
                        {variant.isBase && (
                          <Badge variant="forest" class="text-xs">Base</Badge>
                        )}
                        <Badge variant={variant.isActive ? "forest" : "cream"} class="text-xs">
                          {variant.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <button class="inline-flex items-center gap-1.5 text-sm text-forest-600 dark:text-forest-400 hover:underline font-medium">
                        <PencilIcon class="w-3.5 h-3.5" />
                        Edit
                      </button>
                    </div>
                    <div class="p-6">
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* SKU & Pricing */}
                        <div>
                          <DetailRow label="SKU" value={variant.sku || "—"} />
                          <DetailRow label="Price" value={formatPrice(variant.price)} />
                        </div>

                        {/* Inventory */}
                        <div>
                          <DetailRow
                            label="Stock"
                            value={
                              <div class="flex items-center gap-2">
                                <span>{variant.inventoryCount}</span>
                                <Badge
                                  variant={variant.inventoryCount === 0 ? "terracotta" : variant.inventoryCount <= (variant.lowStockThreshold || 3) ? "cream" : "forest"}
                                  class="text-xs"
                                >
                                  {variant.inventoryCount === 0 ? "Out of Stock" : variant.inventoryCount <= (variant.lowStockThreshold || 3) ? "Low" : "In Stock"}
                                </Badge>
                              </div>
                            }
                          />
                          <DetailRow label="Track Inventory" value={variant.trackInventory ? "Yes" : "No"} />
                          <DetailRow label="Low Stock Alert" value={variant.lowStockThreshold || "—"} />
                        </div>

                        {/* Growth Attributes */}
                        <div>
                          <DetailRow label="Growth Stage" value={getGrowthStageLabel(variant.attributes.growthStage)} />
                          <DetailRow label="Plant Form" value={getPlantFormLabel(variant.attributes.plantForm)} />
                          <DetailRow label="Variegation" value={getVariegationLabel(variant.attributes.variegation)} />
                          <DetailRow label="Leaf Density" value={getLeafDensityLabel(variant.attributes.leafDensity)} />
                        </div>

                        {/* Physical Attributes */}
                        <div>
                          <DetailRow label="Stem Count" value={variant.attributes.stemCount} />
                          <DetailRow label="Current Height" value={variant.attributes.currentHeight} />
                          <DetailRow label="Current Spread" value={variant.attributes.currentSpread} />
                          <DetailRow label="Propagation" value={getPropagationLabel(variant.attributes.propagationType)} />
                          <DetailRow label="Container" value={`${getContainerTypeLabel(variant.attributes.containerType)} (${variant.attributes.containerSize})`} />
                        </div>
                      </div>

                      {/* Images */}
                      <div class="mt-6 pt-4 border-t border-cream-100 dark:border-forest-700/50">
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                          Images ({variant.images.length})
                        </p>
                        <Show
                          when={variant.images.length > 0}
                          fallback={
                            <p class="text-sm text-gray-400 dark:text-gray-500">No images uploaded for this variant.</p>
                          }
                        >
                          <div class="flex gap-3">
                            <For each={variant.images}>
                              {(img) => (
                                <div class="w-20 h-20 rounded-lg bg-cream-100 dark:bg-forest-700 border border-cream-200 dark:border-forest-600 flex items-center justify-center">
                                  <PackageIcon class="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </For>
                          </div>
                        </Show>
                      </div>
                    </div>
                  </div>
                </ErrorBoundary>
              )}
            </For>
          </div>
        </Show>

        {/* Care Guide Tab */}
        <Show when={activeTab() === "care"}>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* English Care Guide */}
            <SectionCard
              title="Care Guide (English)"
              icon={<SunIcon class="w-4 h-4 text-gray-400" />}
            >
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <SunIcon class="w-4 h-4 text-gray-400" />
                    Light Instructions
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.en.lightInstructions}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <DropletIcon class="w-4 h-4 text-gray-400" />
                    Watering Instructions
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.en.wateringInstructions}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MoonIcon class="w-4 h-4 text-gray-400" />
                    Humidity Instructions
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.en.humidityInstructions}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <TrendingUpIcon class="w-4 h-4 text-gray-400" />
                    Fertilizer Schedule
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.en.fertilizerSchedule}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <CubeIcon class="w-4 h-4 text-gray-400" />
                    Repotting Frequency
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.en.repottingFrequency}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ScissorsIcon class="w-4 h-4 text-gray-400" />
                    Pruning Notes
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.en.pruningNotes}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ExclamationCircleIcon class="w-4 h-4 text-gray-400" />
                    Common Problems
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.en.commonProblems}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <CalendarIcon class="w-4 h-4 text-gray-400" />
                    Seasonal Care
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.en.seasonalCare}
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* Bengali Care Guide */}
            <SectionCard
              title="যত্নের নির্দেশিকা (বাংলা)"
              icon={<SunIcon class="w-4 h-4 text-gray-400" />}
            >
              <div class="space-y-4">
                <div>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <SunIcon class="w-4 h-4 text-gray-400" />
                    আলোর নির্দেশনা
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.bn.lightInstructions}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <DropletIcon class="w-4 h-4 text-gray-400" />
                    পানির নির্দেশনা
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.bn.wateringInstructions}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MoonIcon class="w-4 h-4 text-gray-400" />
                    আর্দ্রতার নির্দেশনা
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.bn.humidityInstructions}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <TrendingUpIcon class="w-4 h-4 text-gray-400" />
                    সারের সময়সূচী
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.bn.fertilizerSchedule}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <CubeIcon class="w-4 h-4 text-gray-400" />
                    পুনরায় পোট করার সময়সূচী
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.bn.repottingFrequency}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ScissorsIcon class="w-4 h-4 text-gray-400" />
                    ছাঁটাইয়ের নোট
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.bn.pruningNotes}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <ExclamationCircleIcon class="w-4 h-4 text-gray-400" />
                    সাধারণ সমস্যা
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.bn.commonProblems}
                  </p>
                </div>
                <div class="pt-3 border-t border-cream-100 dark:border-forest-700/50">
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <CalendarIcon class="w-4 h-4 text-gray-400" />
                    মৌসুমি যত্ন
                  </p>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    {plant.careGuide.bn.seasonalCare}
                  </p>
                </div>
              </div>
            </SectionCard>
          </div>
        </Show>

        {/* Orders Tab */}
        <Show when={activeTab() === "orders"}>
          <ErrorBoundary
            fallback={(error) => (
              <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                <p class="text-sm text-amber-700 dark:text-amber-300">Failed to load orders: {error.message}</p>
              </div>
            )}
          >
            <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm">
              {/* Orders Header */}
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

              {/* Orders Table */}
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
                            <span class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                              {formatPrice(order.totalAmount)}
                            </span>
                          </td>
                          <td class="px-4 py-3">
                            <Badge variant={getOrderStatusVariant(order.status)}>
                              {order.status === "DELIVERED" ? "Delivered" : order.status === "SHIPPED" ? "Shipped" : order.status === "PROCESSING" ? "Processing" : "Cancelled"}
                            </Badge>
                          </td>
                          <td class="px-4 py-3">
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                              {formatDate(order.orderDate)}
                            </span>
                          </td>
                          <td class="px-4 py-3">
                            <Show
                              when={order.rating !== null}
                              fallback={<span class="text-xs text-gray-400">—</span>}
                            >
                              <StarRatingDisplay rating={order.rating!} size="w-3.5 h-3.5" />
                            </Show>
                          </td>
                        </tr>
                      )}
                    </For>
                  </tbody>
                </table>
              </div>

              {/* Orders Footer */}
              <div class="px-6 py-4 border-t border-cream-200 dark:border-forest-700">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Showing {filteredOrders().length} of {orders.length} orders
                </p>
              </div>
            </div>
          </ErrorBoundary>
        </Show>

        {/* Reviews Tab */}
        <Show when={activeTab() === "reviews"}>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Reviews Summary */}
            <div class="space-y-6">
              {/* Rating Overview */}
              <SectionCard title="Rating Summary">
                <div class="text-center mb-4">
                  <p class="text-5xl font-bold text-forest-800 dark:text-cream-50">{reviewsSummary.average}</p>
                  <div class="flex justify-center mt-2">
                    <StarRatingDisplay rating={reviewsSummary.average} size="w-5 h-5" />
                  </div>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {reviewsSummary.total} reviews
                  </p>
                </div>

                {/* Rating Distribution */}
                <div class="space-y-2">
                  <For each={reviewsSummary.distribution}>
                    {(dist) => (
                      <div class="flex items-center gap-3">
                        <span class="text-sm text-gray-600 dark:text-gray-400 w-6">{dist.stars} ★</span>
                        <div class="flex-1 h-2.5 bg-cream-100 dark:bg-forest-700 rounded-full overflow-hidden">
                          <div
                            class="h-full bg-cream-500 rounded-full transition-all"
                            style={{ width: `${dist.percentage}%` }}
                          />
                        </div>
                        <span class="text-sm text-gray-500 dark:text-gray-400 w-12 text-right">
                          {dist.count}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </SectionCard>

              {/* Review Filters */}
              <SectionCard title="Filter Reviews">
                <div class="space-y-2">
                  <button
                    onClick={() => setReviewFilter(null)}
                    class={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      reviewFilter() === null
                        ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
                    }`}
                  >
                    <span>All Reviews ({reviews.length})</span>
                  </button>
                  <For each={[5, 4, 3, 2, 1]}>
                    {(stars) => {
                      const count = reviewsSummary.distribution.find((d) => d.stars === stars)?.count || 0;
                      return (
                        <button
                          onClick={() => setReviewFilter(reviewFilter() === stars ? null : stars)}
                          class={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            reviewFilter() === stars
                              ? "bg-forest-100 text-forest-800 dark:bg-forest-900/40 dark:text-forest-300 font-medium"
                              : "text-gray-700 dark:text-gray-300 hover:bg-cream-50 dark:hover:bg-forest-700"
                          }`}
                        >
                          <span class="flex items-center gap-1">
                            {stars} <StarIcon class="w-3.5 h-3.5 text-cream-500" />
                          </span>
                          <span class="text-gray-500 dark:text-gray-400">{count}</span>
                        </button>
                      );
                    }}
                  </For>
                </div>
              </SectionCard>

              {/* Review Highlights */}
              <SectionCard title="Customer Highlights">
                <div class="space-y-3">
                  <For each={reviewsSummary.highlights}>
                    {(highlight) => (
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-700 dark:text-gray-300">{highlight.label}</span>
                        <span class="text-xs font-medium text-forest-600 dark:text-forest-400 bg-forest-100 dark:bg-forest-900/40 px-2 py-0.5 rounded-full">
                          {highlight.count}
                        </span>
                      </div>
                    )}
                  </For>
                </div>
              </SectionCard>
            </div>

            {/* Reviews List */}
            <div class="lg:col-span-2 space-y-4">
              <For each={filteredReviews()}>
                {(review) => (
                  <ErrorBoundary
                    fallback={(error) => (
                      <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <p class="text-sm text-amber-700 dark:text-amber-300">Failed to load review: {error.message}</p>
                      </div>
                    )}
                  >
                    <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm p-5">
                      <div class="flex items-start justify-between mb-3">
                        <div class="flex items-center gap-3">
                          <div class="w-10 h-10 rounded-full bg-forest-100 dark:bg-forest-700 flex items-center justify-center">
                            <UserIcon class="w-5 h-5 text-forest-600 dark:text-forest-400" />
                          </div>
                          <div>
                            <div class="flex items-center gap-2">
                              <p class="text-sm font-semibold text-forest-800 dark:text-cream-50">
                                {review.customerName}
                              </p>
                              {review.verifiedPurchase && (
                                <CheckBadgeIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />
                              )}
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(review.date)} · {timeAgo(review.date)}
                            </p>
                          </div>
                        </div>
                        <StarRatingDisplay rating={review.rating} size="w-4 h-4" />
                      </div>

                      <h4 class="text-sm font-semibold text-forest-800 dark:text-cream-50 mb-1">
                        {review.title}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                        {review.comment}
                      </p>

                      {/* Review Images */}
                      <Show when={review.images.length > 0}>
                        <div class="flex gap-2 mb-3">
                          <For each={review.images}>
                            {(img) => (
                              <div class="w-16 h-16 rounded-lg bg-cream-100 dark:bg-forest-700 border border-cream-200 dark:border-forest-600 flex items-center justify-center">
                                <PackageIcon class="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                          </For>
                        </div>
                      </Show>

                      {/* Helpful Button */}
                      <div class="flex items-center gap-4 pt-3 border-t border-cream-100 dark:border-forest-700/50">
                        <button class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-400 transition-colors">
                          <HeartIcon class="w-3.5 h-3.5" />
                          Helpful ({review.helpful})
                        </button>
                      </div>
                    </div>
                  </ErrorBoundary>
                )}
              </For>

              <Show when={filteredReviews().length === 0}>
                <div class="bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 py-12 px-4 text-center">
                  <ChatBubbleLeftRightIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <h3 class="text-lg font-semibold text-forest-800 dark:text-cream-50 mb-2">
                    No reviews found
                  </h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    No reviews match the selected filter.
                  </p>
                </div>
              </Show>
            </div>
          </div>
        </Show>

        {/* Activity Tab */}
        <Show when={activeTab() === "activity"}>
          <SectionCard
            title="Activity History"
            icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
          >
            <div class="relative">
              {/* Timeline line */}
              <div class="absolute left-5 top-0 bottom-0 w-px bg-cream-200 dark:bg-forest-700" />

              <div class="space-y-0">
                <For each={activity}>
                  {(item, index) => {
                    const iconMap: Record<string, any> = {
                      "shopping-bag": <ShoppingBagIcon class="w-4 h-4 text-cream-600 dark:text-cream-400" />,
                      "star": <StarIcon class="w-4 h-4 text-cream-500" />,
                      "cube": <CubeIcon class="w-4 h-4 text-gray-500 dark:text-gray-400" />,
                      "pencil": <PencilIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />,
                      "check-circle": <CheckCircleIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />,
                      "image": <PackageIcon class="w-4 h-4 text-sage-600 dark:text-sage-400" />,
                      "plus": <PlusIcon class="w-4 h-4 text-forest-600 dark:text-forest-400" />,
                    };

                    return (
                      <div class="relative flex items-start gap-4 pb-6 last:pb-0">
                        {/* Timeline dot */}
                        <div class="relative z-10 w-10 h-10 rounded-full bg-white dark:bg-forest-800 border-2 border-cream-200 dark:border-forest-700 flex items-center justify-center flex-shrink-0">
                          {iconMap[item.icon] || <ClockIcon class="w-4 h-4 text-gray-400" />}
                        </div>

                        {/* Content */}
                        <div class="flex-1 pt-0.5">
                          <p class="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {formatDateTime(item.timestamp)} · {timeAgo(item.timestamp)}
                          </p>
                        </div>
                      </div>
                    );
                  }}
                </For>
              </div>
            </div>
          </SectionCard>
        </Show>
      </ErrorBoundary>
    </div>
  );
}
