import { For, Show, type JSX } from "solid-js";
import { useI18n } from "~/i18n";
import type { SearchSuggestItem } from "~/lib/api/types/public/search.types";
import type { NavbarSearchSuggestStatus } from "~/lib/hooks/useNavbarSearchSuggest";
import { ShopIcon, SproutIcon } from "~/components/icons";

export interface NavbarSearchSuggestPanelProps {
  id: string;
  open: boolean;
  status: NavbarSearchSuggestStatus;
  items: SearchSuggestItem[];
  activeIndex: number;
  onPick: (item: SearchSuggestItem) => void;
  onHighlight: (index: number) => void;
  class?: string;
  style?: JSX.CSSProperties;
}

function TypePill(props: { type: SearchSuggestItem["type"] }) {
  const { t } = useI18n();
  const label = () =>
    props.type === "plant"
      ? t("landing.nav.searchTypePlant")
      : t("landing.nav.searchTypeNursery");

  return (
    <span
      class="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-cream-100 text-forest-700 dark:bg-forest-700 dark:text-cream-100"
    >
      {label()}
    </span>
  );
}

function SuggestRow(props: {
  item: SearchSuggestItem;
  index: number;
  active: boolean;
  onPick: (item: SearchSuggestItem) => void;
  onHighlight: (index: number) => void;
}) {
  return (
    <li role="presentation">
      <button
        type="button"
        role="option"
        id={`${props.item.type}-${props.item.slug}-suggest`}
        aria-selected={props.active}
        class={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-standard ${
          props.active
            ? "bg-forest-50 dark:bg-forest-700/60"
            : "hover:bg-cream-50 dark:hover:bg-forest-800"
        }`}
        onMouseDown={(e) => e.preventDefault()}
        onMouseEnter={() => props.onHighlight(props.index)}
        onClick={() => props.onPick(props.item)}
      >
        <div
          class="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-cream-100 dark:bg-forest-700"
          aria-hidden="true"
        >
          <Show
            when={props.item.image?.url}
            fallback={
              props.item.type === "plant" ? (
                <SproutIcon class="h-5 w-5 text-forest-500 dark:text-sage-400" />
              ) : (
                <ShopIcon class="h-5 w-5 text-forest-500 dark:text-sage-400" />
              )
            }
          >
            <img
              src={props.item.image!.url}
              alt=""
              class="h-full w-full object-cover"
              loading="lazy"
            />
          </Show>
        </div>
        <div class="min-w-0 flex-1">
          <p class="body-small font-semibold text-forest-900 dark:text-cream-50 truncate">
            {props.item.name}
          </p>
          <Show when={props.item.subtitle}>
            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
              {props.item.subtitle}
            </p>
          </Show>
        </div>
        <TypePill type={props.item.type} />
      </button>
    </li>
  );
}

export function NavbarSearchSuggestPanel(props: NavbarSearchSuggestPanelProps) {
  const { t } = useI18n();

  return (
    <Show when={props.open}>
      <div
        id={props.id}
        role="listbox"
        aria-label={t("landing.nav.searchSuggestListboxLabel")}
        class={`overflow-hidden rounded-xl border border-cream-200 bg-white shadow-lg dark:border-forest-700 dark:bg-forest-900 ${props.class ?? ""}`}
        style={props.style}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Show when={props.status === "loading"}>
          <p class="px-3 py-3 body-small text-gray-500 dark:text-gray-400">
            {t("landing.nav.searchLoading")}
          </p>
        </Show>

        <Show when={props.status === "error"}>
          <p class="px-3 py-3 body-small text-gray-500 dark:text-gray-400">
            {t("landing.nav.searchSuggestError")}
          </p>
        </Show>

        <Show
          when={
            props.status === "ready" &&
            props.items.length === 0
          }
        >
          <p class="px-3 py-3 body-small text-gray-500 dark:text-gray-400">
            {t("landing.nav.searchNoResults")}
          </p>
        </Show>

        <Show when={props.status === "ready" && props.items.length > 0}>
          <ul class="max-h-72 overflow-y-auto py-1">
            <For each={props.items}>
              {(item, index) => (
                <SuggestRow
                  item={item}
                  index={index()}
                  active={props.activeIndex === index()}
                  onPick={props.onPick}
                  onHighlight={props.onHighlight}
                />
              )}
            </For>
          </ul>
        </Show>
      </div>
    </Show>
  );
}
