export function StatCard(props: {
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
