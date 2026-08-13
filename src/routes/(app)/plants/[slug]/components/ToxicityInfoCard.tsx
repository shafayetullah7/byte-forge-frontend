import { Show } from "solid-js";
import { CheckCircleIcon, ExclamationCircleIcon, ShieldCheckIcon } from "~/components/icons";
import { getToxicityTone } from "~/lib/plants/toxicity-tone";

const TONE_STYLES = {
  warning: {
    box: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    icon: "text-red-600 dark:text-red-400",
    title: "text-red-900 dark:text-red-300",
    body: "text-red-700 dark:text-red-400",
  },
  safe: {
    box: "bg-forest-50 dark:bg-forest-900/25 border-forest-200 dark:border-forest-700",
    icon: "text-forest-600 dark:text-forest-400",
    title: "text-forest-900 dark:text-forest-200",
    body: "text-forest-800 dark:text-forest-300",
  },
  info: {
    box: "bg-cream-50 dark:bg-forest-800/50 border-cream-200 dark:border-forest-700",
    icon: "text-forest-700 dark:text-forest-300",
    title: "text-forest-900 dark:text-cream-50",
    body: "text-gray-700 dark:text-gray-300",
  },
} as const;

export default function ToxicityInfoCard(props: {
  toxicityInfo: string;
  t: (key: string) => string;
}) {
  const tone = () => getToxicityTone(props.toxicityInfo);
  const styles = () => TONE_STYLES[tone()];

  const titleKey = () => {
    switch (tone()) {
      case "safe":
        return "public.plants.detail.toxicitySafe";
      case "warning":
        return "public.plants.detail.toxicityWarning";
      default:
        return "public.plants.detail.toxicityInfo";
    }
  };

  return (
    <div class={`rounded-2xl border p-6 ${styles().box}`}>
      <div class="flex items-start gap-3">
        <Show
          when={tone() === "safe"}
          fallback={
            <Show
              when={tone() === "warning"}
              fallback={<ShieldCheckIcon class={`w-6 h-6 flex-shrink-0 mt-0.5 ${styles().icon}`} />}
            >
              <ExclamationCircleIcon class={`w-6 h-6 flex-shrink-0 mt-0.5 ${styles().icon}`} />
            </Show>
          }
        >
          <CheckCircleIcon class={`w-6 h-6 flex-shrink-0 mt-0.5 ${styles().icon}`} />
        </Show>
        <div>
          <h3 class={`text-sm font-semibold mb-2 ${styles().title}`}>
            {props.t(titleKey())}
          </h3>
          <p class={`text-xs leading-relaxed ${styles().body}`}>
            {props.toxicityInfo}
          </p>
        </div>
      </div>
    </div>
  );
}
