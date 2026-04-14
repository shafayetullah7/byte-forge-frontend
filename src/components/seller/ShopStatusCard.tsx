import Badge from "~/components/ui/Badge";

interface StatusConfig {
  color: "default" | "forest" | "sage" | "terracotta" | "cream";
  label: string;
  description: string;
}

interface ShopStatusCardProps {
  shopName: string;
  bengaliName: string;
  status: string;
  slug: string;
  statusConfig: StatusConfig;
}

export default function ShopStatusCard(props: ShopStatusCardProps) {
  const statusColors: Record<string, string> = {
    default: "from-gray-400 to-gray-500",
    forest: "from-forest-500 to-forest-600",
    sage: "from-sage-400 to-sage-500",
    terracotta: "from-terracotta-500 to-terracotta-600",
    cream: "from-cream-300 to-cream-400",
  };

  const bgColors: Record<string, string> = {
    default: "bg-gray-50 dark:bg-gray-900/50",
    forest: "bg-forest-50 dark:bg-forest-900/30",
    sage: "bg-sage-50 dark:bg-sage-900/30",
    terracotta: "bg-terracotta-50 dark:bg-terracotta-900/30",
    cream: "bg-cream-50 dark:bg-cream-900/30",
  };

  const gradientColor = statusColors[props.statusConfig.color] || statusColors.default;
  const bgColor = bgColors[props.statusConfig.color] || bgColors.default;

  return (
    <div class={`${bgColor} rounded-2xl p-6 sm:p-8 mb-8 border border-gray-200 dark:border-gray-700`}>
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div class="flex-1">
          {/* Shop Names */}
          <div class="mb-4">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {props.shopName || "Unnamed Shop"}
            </h2>
            {props.bengaliName && (
              <p class="text-xl text-gray-600 dark:text-gray-400" dir="auto">
                {props.bengaliName}
              </p>
            )}
          </div>

          {/* Shop URL */}
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-forest-900 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span class="font-mono text-sm text-gray-600 dark:text-gray-300">
              byteforge.com/shop/{props.slug}
            </span>
            <button class="hover:text-terracotta-500 transition-colors" title="Copy URL">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Status Badge - Large & Prominent */}
        <div class="flex flex-col items-start lg:items-end gap-3">
          <div class={`inline-flex items-center gap-3 px-5 py-3 rounded-xl bg-gradient-to-r ${gradientColor} text-white shadow-lg`}>
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-lg font-bold">{props.statusConfig.label}</span>
          </div>
          <p class="text-sm text-gray-600 dark:text-gray-400 text-right max-w-xs">
            {props.statusConfig.description}
          </p>
        </div>
      </div>
    </div>
  );
}
