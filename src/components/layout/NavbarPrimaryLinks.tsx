import { A } from "@solidjs/router";
import { For, Show, createMemo } from "solid-js";
import { useI18n } from "~/i18n";
import { config } from "~/lib/config";
import {
  NAV_PRIMARY_LINKS,
  NAV_MOBILE_ONLY_LINKS,
  NAV_DESKTOP_ACTIVE_CLASS,
  NAV_DESKTOP_LINK_CLASS,
  NAV_MOBILE_ACTIVE_CLASS,
  NAV_MOBILE_LINK_CLASS,
} from "./navPrimaryLinks";

export interface NavbarPrimaryLinksProps {
  variant: "desktop" | "mobile";
  onLinkClick?: () => void;
}

export function NavbarPrimaryLinks(props: NavbarPrimaryLinksProps) {
  const { t } = useI18n();
  const isDesktop = () => props.variant === "desktop";

  const primaryLinks = createMemo(() =>
    NAV_PRIMARY_LINKS.filter(
      (link) => !link.requiresCampaigns || config.campaignsEnabled,
    ),
  );

  const mobileLink = (link: { href: string; end?: boolean }, labelKey: string) => (
    <A
      href={link.href}
      class={NAV_MOBILE_LINK_CLASS}
      activeClass={NAV_MOBILE_ACTIVE_CLASS}
      onClick={props.onLinkClick}
      end={link.end}
    >
      {t(labelKey)}
    </A>
  );

  return (
    <>
      <Show when={!isDesktop()}>
        <For each={NAV_MOBILE_ONLY_LINKS}>
          {(link) => mobileLink(link, link.labelKey)}
        </For>
      </Show>
      <For each={primaryLinks()}>
        {(link) => (
          <A
            href={link.href}
            class={isDesktop() ? NAV_DESKTOP_LINK_CLASS : NAV_MOBILE_LINK_CLASS}
            activeClass={
              isDesktop() ? NAV_DESKTOP_ACTIVE_CLASS : NAV_MOBILE_ACTIVE_CLASS
            }
            onClick={isDesktop() ? undefined : props.onLinkClick}
          >
            {t(link.labelKey)}
          </A>
        )}
      </For>
    </>
  );
}
