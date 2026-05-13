import { For } from "solid-js";
import { ClockIcon } from "~/components/icons";
import { SectionCard } from "../components/SectionCard";
import { formatDateTime } from "../helpers";
import { ACTIVITY_ICON_MAP, MOCK_ACTIVITY } from "../mock-data";

export default function ProductActivityRoute() {
  return (
    <SectionCard title="Activity History" icon={<ClockIcon class="w-4 h-4 text-gray-400" />}>
      <div class="relative">
        <div class="absolute left-5 top-0 bottom-0 w-px bg-cream-200 dark:bg-forest-700" />
        <div class="space-y-0">
          <For each={MOCK_ACTIVITY}>
            {(item) => (
              <div class="relative flex items-start gap-4 pb-6 last:pb-0">
                <div class="relative z-10 w-10 h-10 rounded-full bg-white dark:bg-forest-800 border-2 border-cream-200 dark:border-forest-700 flex items-center justify-center flex-shrink-0">
                  {(() => {
                    const IconComponent = ACTIVITY_ICON_MAP[item.icon] || ClockIcon;
                    return <IconComponent class="w-4 h-4 text-gray-400" />;
                  })()}
                </div>
                <div class="flex-1 pt-0.5">
                  <p class="text-sm text-gray-700 dark:text-gray-300">{item.description}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatDateTime(item.timestamp)} \u00b7 {item.timeAgo}
                  </p>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </SectionCard>
  );
}
