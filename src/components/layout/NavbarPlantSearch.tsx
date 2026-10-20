import {
  createEffect,
  createSignal,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import { Portal } from "solid-js/web";
import { useLocation, useNavigate } from "@solidjs/router";
import { MagnifyingGlassIcon } from "../icons";
import { useI18n } from "~/i18n";
import {
  buildPlantsSearchHref,
  readPlantsSearchFromSearchString,
} from "~/lib/plants/plants-search-param";
import {
  searchSuggestItemHref,
  useNavbarSearchSuggest,
} from "~/lib/hooks/useNavbarSearchSuggest";
import type { SearchSuggestItem } from "~/lib/api/types/public/search.types";
import { NavbarSearchSuggestPanel } from "./NavbarSearchSuggestPanel";

export type NavbarPlantSearchVariant = "desktop" | "mobile";

export interface NavbarPlantSearchProps {
  variant?: NavbarPlantSearchVariant;
  onAfterSubmit?: () => void;
}

const INPUT_ID: Record<NavbarPlantSearchVariant, string> = {
  desktop: "navbar-plant-search",
  mobile: "mobile-menu-plant-search",
};

const LISTBOX_ID: Record<NavbarPlantSearchVariant, string> = {
  desktop: "navbar-search-suggest-listbox",
  mobile: "mobile-search-suggest-listbox",
};

const FORM_CLASS: Record<NavbarPlantSearchVariant, string> = {
  desktop: "hidden md:flex flex-1 max-w-2xl min-w-0 mx-4 lg:mx-6",
  mobile: "flex w-full px-4 pb-3",
};

export function NavbarPlantSearch(props: NavbarPlantSearchProps) {
  const variant = () => props.variant ?? "desktop";
  const { t } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = createSignal("");
  const [suggestDismissed, setSuggestDismissed] = createSignal(false);
  const [anchorEl, setAnchorEl] = createSignal<HTMLDivElement | undefined>();
  const [panelRect, setPanelRect] = createSignal<DOMRect | null>(null);

  const {
    items,
    status,
    activeIndex,
    setActiveIndex,
    panelOpen,
    moveActiveIndex,
  } = useNavbarSearchSuggest(query);

  const showPanel = () => panelOpen() && !suggestDismissed();

  const updatePanelRect = () => {
    const el = anchorEl();
    if (el) setPanelRect(el.getBoundingClientRect());
  };

  createEffect(() => {
    if (showPanel() && variant() === "mobile") {
      updatePanelRect();
      const onLayout = () => updatePanelRect();
      window.addEventListener("scroll", onLayout, true);
      window.addEventListener("resize", onLayout);
      onCleanup(() => {
        window.removeEventListener("scroll", onLayout, true);
        window.removeEventListener("resize", onLayout);
      });
    }
  });

  onMount(() => {
    const onPointerDown = (event: PointerEvent) => {
      const root = anchorEl();
      if (!root) return;
      if (!root.contains(event.target as Node)) {
        setSuggestDismissed(true);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    onCleanup(() => document.removeEventListener("pointerdown", onPointerDown));
  });

  const navigateToCatalog = () => {
    const trimmed = query().trim();
    const onPlantsWithSameSearch =
      location.pathname === "/plants" &&
      readPlantsSearchFromSearchString(location.search) === trimmed;

    if (!onPlantsWithSameSearch) {
      navigate(buildPlantsSearchHref(trimmed));
    }
    props.onAfterSubmit?.();
  };

  const pickItem = (item: SearchSuggestItem) => {
    setSuggestDismissed(true);
    navigate(searchSuggestItemHref(item));
    props.onAfterSubmit?.();
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const list = items();
    const index = activeIndex();
    if (showPanel() && index >= 0 && index < list.length) {
      pickItem(list[index]);
      return;
    }
    setSuggestDismissed(true);
    navigateToCatalog();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSuggestDismissed(true);
      return;
    }

    if (!showPanel()) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      moveActiveIndex(1);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      moveActiveIndex(-1);
      return;
    }
  };

  const inputId = () => INPUT_ID[variant()];
  const listboxId = () => LISTBOX_ID[variant()];

  const activeDescendantId = () => {
    const index = activeIndex();
    const list = items();
    if (index < 0 || index >= list.length) return undefined;
    const item = list[index];
    return `${item.type}-${item.slug}-suggest`;
  };

  const panelProps = () => ({
    id: listboxId(),
    open: showPanel(),
    status: status(),
    items: items(),
    activeIndex: activeIndex(),
    onPick: pickItem,
    onHighlight: setActiveIndex,
  });

  const mobilePanelStyle = (): Record<string, string> | undefined => {
    const rect = panelRect();
    if (!rect) return undefined;
    const margin = 16;
    const width = Math.max(rect.width, window.innerWidth - margin * 2);
    const left = Math.min(
      Math.max(margin, rect.left),
      window.innerWidth - width - margin,
    );
    return {
      position: "fixed",
      top: `${rect.bottom + 4}px`,
      left: `${left}px`,
      width: `${width}px`,
      "z-index": "60",
    };
  };

  return (
    <form
      role="search"
      class={FORM_CLASS[variant()]}
      onSubmit={handleSubmit}
    >
      <label class="sr-only" for={inputId()}>
        {t("landing.nav.searchAriaLabel")}
      </label>
      <div ref={setAnchorEl} class="relative w-full">
        <MagnifyingGlassIcon
          class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none"
          aria-hidden="true"
        />
        <input
          id={inputId()}
          type="search"
          name="search"
          value={query()}
          onInput={(e) => {
            setSuggestDismissed(false);
            setQuery(e.currentTarget.value);
          }}
          onFocus={() => setSuggestDismissed(false)}
          onBlur={() => setSuggestDismissed(true)}
          onKeyDown={handleKeyDown}
          placeholder={t("landing.nav.searchPlaceholder")}
          class="w-full pl-11 pr-4 py-2.5 rounded-full bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-700 body-small text-forest-800 dark:text-cream-50 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:border-forest-500 dark:focus:border-forest-500 focus:ring-2 focus:ring-forest-500/20 transition-standard"
          autocomplete="off"
          aria-expanded={showPanel()}
          aria-controls={listboxId()}
          aria-autocomplete="list"
          aria-activedescendant={activeDescendantId()}
        />

        <Show when={variant() === "desktop"}>
          <NavbarSearchSuggestPanel
            {...panelProps()}
            class="absolute left-0 right-0 top-full z-50 mt-1"
          />
        </Show>

        <Show when={variant() === "mobile"}>
          <Portal>
            <NavbarSearchSuggestPanel
              {...panelProps()}
              style={mobilePanelStyle()}
            />
          </Portal>
        </Show>
      </div>
    </form>
  );
}
