import { For } from "solid-js";
import { StarIcon } from "~/components/icons";

export function StarRatingDisplay(props: { rating: number; size?: string }) {
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
