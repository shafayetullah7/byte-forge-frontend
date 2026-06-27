import { For, Show } from "solid-js";
import { A } from "@solidjs/router";
import { ClockIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { CARE_INSTRUCTION_ITEMS } from "../care-instruction-config";
import type { CareInstructionContent } from "../../hooks/usePlantOverviewData";
import { InstructionRow } from "../InstructionRow";
import { SectionCard } from "~/routes/(protected)/app/seller/(seller-protected)/products/components/shared/SectionCard";

const PREVIEW_LIMIT = 2;

export function CareInstructionsPreview(props: {
  plantId: string;
  careEn: () => CareInstructionContent | null;
  careBn: () => CareInstructionContent | null;
}) {
  const { t } = useI18n();

  const previewItems = () =>
    CARE_INSTRUCTION_ITEMS.filter((item) => {
      const en = props.careEn()?.[item.field];
      const bn = props.careBn()?.[item.field];
      return Boolean(en || bn);
    }).slice(0, PREVIEW_LIMIT);

  return (
    <Show when={props.careEn()}>
      <SectionCard
        title={t("seller.products.plantOverview.careInstructions")}
        icon={<ClockIcon class="w-4 h-4 text-gray-400" />}
        action={
          <A
            href={`/app/seller/products/plants/${props.plantId}/care`}
            class="text-xs text-forest-600 dark:text-forest-400 hover:underline"
          >
            {t("seller.products.plantOverview.viewCareGuide")} →
          </A>
        }
      >
        <div class="space-y-4">
          <For each={previewItems()}>
            {(item) => (
              <InstructionRow
                icon={item.icon}
                iconColor={item.iconColor}
                bgColor={item.bgColor}
                titleEn={t(item.titleEnKey)}
                titleBn={t(item.titleBnKey)}
                descEn={props.careEn()?.[item.field] ?? null}
                descBn={props.careBn()?.[item.field] ?? null}
              />
            )}
          </For>
        </div>
      </SectionCard>
    </Show>
  );
}
