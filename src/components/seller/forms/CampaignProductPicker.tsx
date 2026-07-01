import { createMemo, createSignal, For, Show } from "solid-js";
import { useI18n } from "~/i18n";
import type { ProductListItem } from "~/lib/api/types/seller.types";

export function CampaignProductPicker(props: {
  products: ProductListItem[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  label: string;
  hint?: string;
  maxItems?: number;
  disabled?: boolean;
}) {
  const { t } = useI18n();
  const [search, setSearch] = createSignal("");
  const maxItems = () => props.maxItems ?? 50;

  const filtered = createMemo(() => {
    const q = search().trim().toLowerCase();
    if (!q) return props.products;
    return props.products.filter(
      (p) =>
        (p.name?.toLowerCase().includes(q) ?? false) ||
        p.slug.toLowerCase().includes(q),
    );
  });

  const toggle = (id: string) => {
    if (props.disabled) return;
    const current = props.selectedIds;
    if (current.includes(id)) {
      props.onChange(current.filter((x) => x !== id));
      return;
    }
    if (current.length >= maxItems()) return;
    props.onChange([...current, id]);
  };

  return (
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">{props.label}</label>
      <Show when={props.hint}>
        <p class="text-xs text-gray-500 dark:text-gray-400 -mt-1 mb-2">{props.hint}</p>
      </Show>
      <input
        type="search"
        value={search()}
        disabled={props.disabled}
        onInput={(e) => setSearch(e.currentTarget.value)}
        placeholder={t("seller.campaigns.fields.products.searchPlaceholder")}
        class="w-full px-3 py-2 rounded-lg border-2 border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-900/30 text-sm"
      />
      <p class="text-xs text-gray-500 dark:text-gray-400">
        {t("seller.campaigns.fields.products.selectedCount").replace(
          "{n}",
          String(props.selectedIds.length),
        )}
      </p>
      <div class="max-h-48 overflow-y-auto rounded-lg border border-cream-200 dark:border-forest-700 divide-y divide-cream-100 dark:divide-forest-700">
        <Show
          when={filtered().length > 0}
          fallback={
            <p class="p-3 text-sm text-gray-500 dark:text-gray-400">
              {t("seller.campaigns.fields.products.empty")}
            </p>
          }
        >
          <For each={filtered()}>
            {(product) => {
              const checked = () => props.selectedIds.includes(product.id);
              const disabled = () =>
                props.disabled ||
                (!checked() && props.selectedIds.length >= maxItems());
              return (
                <label
                  class={`flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-cream-50 dark:hover:bg-forest-800/50 ${
                    disabled() ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked()}
                    disabled={disabled()}
                    onChange={() => toggle(product.id)}
                    class="rounded border-gray-300 text-forest-600 focus:ring-forest-500"
                  />
                  <span class="text-sm text-gray-800 dark:text-gray-200 truncate">
                    {product.name ?? product.slug}
                  </span>
                </label>
              );
            }}
          </For>
        </Show>
      </div>
    </div>
  );
}
