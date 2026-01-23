import { RouteSectionProps } from "@solidjs/router";
import { Navbar } from "~/components/layout/Navbar";

export default function AppLayout(props: RouteSectionProps) {
  return (
    <>
      <Navbar />
      {props.children}
    </>
  );
}
