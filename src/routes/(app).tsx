import { RouteSectionProps } from "@solidjs/router";
import { Suspense } from "solid-js";
import { Navbar } from "~/components/layout/Navbar";

export default function AppLayout(props: RouteSectionProps) {
  return (
    <div class="relative min-h-screen overflow-x-hidden bg-cream-50 dark:bg-forest-900">
      <Navbar />
      <main>
        <Suspense>{props.children}</Suspense>
      </main>
    </div>
  );
}
