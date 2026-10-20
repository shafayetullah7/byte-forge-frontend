import { onMount, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";
import { dispatchHomeAnalytics } from "~/lib/analytics/home-analytics";

const IMPRESSION_THRESHOLD = 0.25;
const HOME_ANALYTICS_ROOT_ID = "home-analytics-root";

function isHomePath(pathname: string): boolean {
  return pathname === "/" || pathname === "";
}

export function HomeSectionAnalytics() {
  onMount(() => {
    if (isServer) return;

    const root = document.getElementById(HOME_ANALYTICS_ROOT_ID);
    if (!root) return;

    const seenSections = new Set<string>();
    const observedElements = new WeakSet<Element>();

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const section = (entry.target as HTMLElement).getAttribute(
            "data-analytics-section",
          );
          if (!section || seenSections.has(section)) continue;
          seenSections.add(section);
          dispatchHomeAnalytics({ type: "section_impression", section });
        }
      },
      { threshold: IMPRESSION_THRESHOLD },
    );

    const observeSections = () => {
      root.querySelectorAll("[data-analytics-section]").forEach((el) => {
        if (observedElements.has(el)) return;
        observedElements.add(el);
        intersectionObserver.observe(el);
      });
    };

    observeSections();

    const mutationObserver = new MutationObserver(() => observeSections());
    mutationObserver.observe(root, { childList: true, subtree: true });

    const onClick = (event: MouseEvent) => {
      if (!isHomePath(window.location.pathname)) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const clickEl = target.closest("[data-analytics-click]");
      if (!clickEl) return;
      const clickId = clickEl.getAttribute("data-analytics-click");
      if (!clickId) return;
      const section = clickEl
        .closest("[data-analytics-section]")
        ?.getAttribute("data-analytics-section");
      dispatchHomeAnalytics({
        type: "section_click",
        clickId,
        section: section ?? undefined,
      });
    };

    document.addEventListener("click", onClick, true);

    onCleanup(() => {
      intersectionObserver.disconnect();
      mutationObserver.disconnect();
      document.removeEventListener("click", onClick, true);
    });
  });

  return null;
}
