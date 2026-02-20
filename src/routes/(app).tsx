import { RouteSectionProps, useLocation } from "@solidjs/router";
import { Navbar } from "~/components/layout/Navbar";

export default function AppLayout(props: RouteSectionProps) {
  const location = useLocation();
  const isHome = () => location.pathname === "/";

  return (
    <div class="relative min-h-screen overflow-x-hidden">
      {/* Floating Layout Layer (z-50) */}
      <div class="absolute inset-0 z-50 pointer-events-none">
        <Navbar />
      </div>

      {/* Content Layer (z-0) */}
      <main classList={{ "pt-16": !isHome() }}>
        {props.children}
      </main>
    </div>
  );
}
