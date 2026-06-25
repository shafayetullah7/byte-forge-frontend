import { For, type Component } from "solid-js";
import { Link } from "@solidjs/meta";
import { hreflangAlternates } from "~/lib/seo/meta";

const HreflangLinks: Component<{ path: string }> = (props) => (
  <For each={hreflangAlternates(props.path)}>
    {(alt) => <Link rel="alternate" hreflang={alt.lang} href={alt.href} />}
  </For>
);

export default HreflangLinks;
