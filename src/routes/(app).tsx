import { RouteSectionProps, useLocation } from "@solidjs/router";
import { Navbar } from "~/components/layout/Navbar";

export default function AppLayout(props: RouteSectionProps) {
  const location = useLocation();
  const isHome = () => location.pathname === "/";

  return (
    <>
      <Navbar />
      <main
        class="min-h-screen"
        classList={{
          "pt-0": isHome(),
          "pt-[120px]": !isHome()
        }}
      >
        {props.children}
      </main>
    </>
  );
}
