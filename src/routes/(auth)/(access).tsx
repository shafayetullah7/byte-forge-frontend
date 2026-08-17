import { RouteSectionProps } from "@solidjs/router";
import { Meta } from "@solidjs/meta";

export default function AccessLayout(props: RouteSectionProps) {
  return (
    <>
      <Meta name="robots" content="noindex, nofollow" />
      {props.children}
    </>
  );
}
