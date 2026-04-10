import { JSX, splitProps } from "solid-js";
import { A, type AnchorProps } from "@solidjs/router";
import {
    buttonBase,
    buttonSizes,
    buttonVariants,
    type ButtonVariant,
    type ButtonSize,
} from "./button-styles";

export interface LinkButtonProps extends AnchorProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    class?: string;
    children?: JSX.Element;
}

export default function LinkButton(props: LinkButtonProps) {
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
        <A class={classes} {...others}>
            {local.children}
        </A>
    );
}
