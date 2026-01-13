import { RouteSectionProps } from "@solidjs/router";
import SocialLogin from "~/components/auth/SocialLogin";

export default function AccessLayout(props: RouteSectionProps) {
  return (
    <>
      {props.children}
      <SocialLogin />
    </>
  );
}
