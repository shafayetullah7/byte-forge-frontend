import { RouteSectionProps } from "@solidjs/router";
import { Meta } from "@solidjs/meta";
import SocialLogin from "~/components/auth/SocialLogin";

export default function AccessLayout(props: RouteSectionProps) {
  return (
    <>
      <Meta name="robots" content="noindex, nofollow" />
      {props.children}
      <SocialLogin />
    </>
  );
}
