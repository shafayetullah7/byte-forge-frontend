import { For, Show, type Component, type JSX } from "solid-js";
import { Title, Meta, Link } from "@solidjs/meta";
import { A } from "@solidjs/router";
import HreflangLinks from "~/components/seo/HreflangLinks";
import { formatPageTitle, absoluteUrl } from "~/lib/seo/meta";

export interface ContentSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

const StaticContentPage: Component<{
  path: string;
  title: string;
  description: string;
  sections: ContentSection[];
  relatedLinks?: Array<{ href: string; label: string }>;
  children?: JSX.Element;
}> = (props) => (
  <main class="min-h-screen bg-cream-50 dark:bg-forest-900 py-12">
    <Title>{formatPageTitle(props.title)}</Title>
    <Meta name="description" content={props.description} />
    <Meta property="og:title" content={formatPageTitle(props.title)} />
    <Meta property="og:description" content={props.description} />
    <Link rel="canonical" href={absoluteUrl(props.path)} />
    <HreflangLinks path={props.path} />

    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-forest-800 dark:text-cream-50 mb-2">{props.title}</h1>
      <p class="text-gray-600 dark:text-gray-300 mb-8">{props.description}</p>

      <div class="bg-white dark:bg-forest-800 rounded-2xl border border-cream-200 dark:border-forest-700 p-6 sm:p-8 space-y-8 shadow-sm">
        <For each={props.sections}>
          {(section) => (
            <section>
              <h2 class="text-xl font-semibold text-forest-700 dark:text-forest-300 mb-3">
                {section.title}
              </h2>
              <For each={section.paragraphs ?? []}>
                {(paragraph) => (
                  <p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-3 last:mb-0">
                    {paragraph}
                  </p>
                )}
              </For>
              <Show when={(section.bullets?.length ?? 0) > 0}>
                <ul class="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                  <For each={section.bullets ?? []}>{(item) => <li>{item}</li>}</For>
                </ul>
              </Show>
            </section>
          )}
        </For>
        {props.children}
      </div>

      <Show when={(props.relatedLinks?.length ?? 0) > 0}>
        <div class="mt-8 flex flex-wrap gap-4">
          <For each={props.relatedLinks ?? []}>
            {(link) => (
              <A
                href={link.href}
                class="text-sm font-medium text-forest-600 dark:text-forest-400 hover:underline"
              >
                {link.label}
              </A>
            )}
          </For>
        </div>
      </Show>
    </div>
  </main>
);

export default StaticContentPage;
