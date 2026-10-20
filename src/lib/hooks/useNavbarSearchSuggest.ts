import { createEffect, createSignal, onCleanup } from "solid-js";
import { getSearchSuggest } from "~/lib/api/endpoints/public/search.api";
import type { SearchSuggestItem } from "~/lib/api/types/public/search.types";

const DEBOUNCE_MS = 300;
const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;

export type NavbarSearchSuggestStatus = "idle" | "loading" | "ready" | "error";

export function useNavbarSearchSuggest(query: () => string) {
  const [items, setItems] = createSignal<SearchSuggestItem[]>([]);
  const [status, setStatus] = createSignal<NavbarSearchSuggestStatus>("idle");
  const [activeIndex, setActiveIndex] = createSignal(-1);

  createEffect(() => {
    const trimmed = query().trim().slice(0, MAX_QUERY_LENGTH);

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setItems([]);
      setStatus("idle");
      setActiveIndex(-1);
      return;
    }

    setStatus("loading");
    const controller = new AbortController();

    const timer = setTimeout(() => {
      void getSearchSuggest(trimmed, { signal: controller.signal })
        .then((data) => {
          setItems(data.items ?? []);
          setStatus("ready");
          setActiveIndex(-1);
        })
        .catch((error: unknown) => {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }
          if (error instanceof Error && error.name === "AbortError") {
            return;
          }
          setItems([]);
          setStatus("error");
          setActiveIndex(-1);
        });
    }, DEBOUNCE_MS);

    onCleanup(() => {
      clearTimeout(timer);
      controller.abort();
    });
  });

  const panelOpen = () => {
    const trimmed = query().trim();
    if (trimmed.length < MIN_QUERY_LENGTH) return false;
    const current = status();
    return current === "loading" || current === "ready" || current === "error";
  };

  const moveActiveIndex = (delta: number) => {
    const list = items();
    if (list.length === 0) return;
    setActiveIndex((prev) => {
      const next = prev + delta;
      if (next < 0) return list.length - 1;
      if (next >= list.length) return 0;
      return next;
    });
  };

  return {
    items,
    status,
    activeIndex,
    setActiveIndex,
    panelOpen,
    moveActiveIndex,
  };
}

export function searchSuggestItemHref(item: SearchSuggestItem): string {
  return item.type === "plant" ? `/plants/${item.slug}` : `/shops/${item.slug}`;
}
