import { For, Show } from "solid-js";
import Input from "~/components/ui/Input";
import Button from "~/components/ui/Button";
import { useI18n } from "~/i18n";
import type { StorefrontListItem } from "~/lib/shop/storefront.types";

export type PairedListRow = {
  id?: string;
  en: string;
  bn: string;
};

export function toPairedRows(items: StorefrontListItem[]): PairedListRow[] {
  return items.map((item) => ({
    id: item.id,
    en: item.translations.en.text,
    bn: item.translations.bn.text,
  }));
}

export function fromPairedRows(rows: PairedListRow[]) {
  return {
    items: rows
      .map((row) => ({
        id: row.id,
        translations: {
          en: { text: row.en.trim() },
          bn: { text: row.bn.trim() },
        },
      }))
      .filter((row) => row.translations.en.text || row.translations.bn.text),
  };
}

export function PairedListEditor(props: {
  rows: PairedListRow[];
  onChange: (rows: PairedListRow[]) => void;
  maxItems?: number;
}) {
  const { t } = useI18n();
  const maxItems = () => props.maxItems ?? 10;

  const addRow = () => {
    if (props.rows.length >= maxItems()) return;
    props.onChange([...props.rows, { en: "", bn: "" }]);
  };

  const removeRow = (index: number) => {
    props.onChange(props.rows.filter((_, i) => i !== index));
  };

  const updateRow = (index: number, field: "en" | "bn", value: string) => {
    props.onChange(
      props.rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)),
    );
  };

  return (
    <div class="space-y-3">
      <Show
        when={props.rows.length > 0}
        fallback={
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {t("seller.shop.storefront.emptyList")}
          </p>
        }
      >
        <For each={props.rows}>
          {(row, index) => (
            <div class="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 items-start p-3 rounded-xl border border-gray-200 dark:border-gray-700">
              <Input
                label={t("seller.shop.myShop.shopInfo.english")}
                value={row.en}
                onInput={(e) => updateRow(index(), "en", e.currentTarget.value)}
              />
              <Input
                label={t("seller.shop.myShop.shopInfo.bengali")}
                value={row.bn}
                onInput={(e) => updateRow(index(), "bn", e.currentTarget.value)}
              />
              <Button
                variant="outline"
                size="sm"
                type="button"
                class="mt-6"
                onClick={() => removeRow(index())}
              >
                {t("common.remove")}
              </Button>
            </div>
          )}
        </For>
      </Show>
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={addRow}
        disabled={props.rows.length >= maxItems()}
      >
        {t("seller.shop.storefront.addItem")}
      </Button>
    </div>
  );
}
