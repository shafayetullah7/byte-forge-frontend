import { For, Show } from "solid-js";
import {
  Squares2x2Icon,
  CheckCircleIcon,
  FolderIcon,
  ArchiveIcon,
  PackageIcon,
} from "~/components/icons";

function StatsCard(props: {
  label: string;
  value: number;
  icon: any;
  valueColor: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl p-5 border border-cream-200 dark:border-forest-700 shadow-sm">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm text-gray-500 dark:text-gray-400">{props.label}</p>
          <p class="text-2xl font-bold mt-1" classList={{
            "text-forest-800 dark:text-cream-50": props.valueColor === "default",
            "text-forest-600 dark:text-forest-400": props.valueColor === "forest",
            "text-cream-600 dark:text-cream-400": props.valueColor === "cream",
            "text-terracotta-600 dark:text-terracotta-400": props.valueColor === "terracotta",
          }}>
            {props.value}
          </p>
        </div>
        <div class={`w-10 h-10 rounded-lg ${props.iconBg} flex items-center justify-center`}>
          <props.icon class={`w-5 h-5 ${props.iconColor}`} />
        </div>
      </div>
    </div>
  );
}

export function StatsLoading() {
  return (
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <For each={Array.from({ length: 4 })}>
        {() => (
          <div class="h-24 bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 animate-pulse" />
        )}
      </For>
    </div>
  );
}

export function TableLoading() {
  return (
    <div class="hidden lg:block bg-white dark:bg-forest-800 rounded-xl border border-cream-200 dark:border-forest-700 shadow-sm overflow-hidden">
      <div class="p-12 text-center">
        <PackageIcon class="w-10 h-10 text-gray-400 dark:text-gray-500 mx-auto mb-4 animate-pulse" />
        <p class="text-gray-500 dark:text-gray-400">Loading products...</p>
      </div>
    </div>
  );
}

const STAT_CARDS = [
  { labelKey: "seller.products.stats.totalProducts", icon: Squares2x2Icon, valueColor: "default", iconBg: "bg-cream-100 dark:bg-cream-900/40", iconColor: "text-cream-600 dark:text-cream-400" },
  { labelKey: "seller.products.stats.active", icon: CheckCircleIcon, valueColor: "forest", iconBg: "bg-forest-100 dark:bg-forest-900/40", iconColor: "text-forest-600 dark:text-forest-400" },
  { labelKey: "seller.products.stats.draft", icon: FolderIcon, valueColor: "cream", iconBg: "bg-cream-100 dark:bg-cream-900/40", iconColor: "text-cream-600 dark:text-cream-400" },
  { labelKey: "seller.products.stats.archived", icon: ArchiveIcon, valueColor: "terracotta", iconBg: "bg-terracotta-100 dark:bg-terracotta-900/40", iconColor: "text-terracotta-600 dark:text-terracotta-400" },
];

export function OverallStatsCard(props: {
  label: string;
  value: number;
  icon: any;
  valueColor: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <StatsCard
      label={props.label}
      value={props.value}
      icon={props.icon}
      valueColor={props.valueColor}
      iconBg={props.iconBg}
      iconColor={props.iconColor}
    />
  );
}

export default StatsCard;
