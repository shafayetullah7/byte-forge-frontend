import { JSX, splitProps } from "solid-js";
import {
  buttonBase,
  buttonSizes,
  buttonVariants,
  type ButtonVariant,
  type ButtonSize,
} from "./button-styles";

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export default function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, [
    "variant",
    "size",
    "class",
    "children",
  ]);

  const variant = local.variant || "primary";
  const size = local.size || "md";

  const classes = `${buttonBase} ${buttonSizes[size]} ${buttonVariants[variant]} ${local.class || ""
    }`;

  return (
    <button class={classes} {...others}>
      {local.children}
    </button>
  );
}
