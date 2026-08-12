import { Show } from "solid-js";
import Button from "~/components/ui/Button";
import { SparklesIcon } from "~/components/icons";

export function PlantAiDraftCard(props: {
  canGenerate: boolean;
  isGenerating: boolean;
  photoOnly: boolean;
  onGenerate: () => void;
  t: (key: string) => string;
}) {
  return (
    <div class="rounded-xl border border-forest-200 dark:border-forest-600 bg-gradient-to-br from-forest-50/80 to-cream-50 dark:from-forest-900/40 dark:to-forest-800/60 p-5 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="flex gap-3 min-w-0">
          <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-forest-100 text-forest-700 dark:bg-forest-800 dark:text-forest-200">
            <SparklesIcon class="h-5 w-5" />
          </div>
          <div class="min-w-0">
            <h3 class="text-sm font-semibold text-forest-900 dark:text-cream-50">
              {props.t("seller.products.newPlant.aiDraft.cardTitle")}
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {props.t("seller.products.newPlant.aiDraft.cardSubtitle")}
            </p>
            <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {props.t("seller.products.newPlant.aiDraft.disclaimer")}
            </p>
            <Show when={props.photoOnly}>
              <p class="mt-2 text-xs text-amber-700 dark:text-amber-300">
                {props.t("seller.products.newPlant.aiDraft.photoIdentifyDisclaimer")}
              </p>
            </Show>
          </div>
        </div>

        <div class="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <Button
            type="button"
            variant="secondary"
            loading={props.isGenerating}
            disabled={!props.canGenerate || props.isGenerating}
            onClick={() => props.onGenerate()}
            class="whitespace-nowrap"
          >
            {props.isGenerating
              ? props.t("seller.products.newPlant.aiDraft.generating")
              : props.t("seller.products.newPlant.aiDraft.generateButton")}
          </Button>
          <Show when={!props.canGenerate && !props.isGenerating}>
            <p class="text-xs text-gray-500 dark:text-gray-400 sm:text-right max-w-xs">
              {props.t("seller.products.newPlant.aiDraft.hint")}
            </p>
          </Show>
        </div>
      </div>
    </div>
  );
}
