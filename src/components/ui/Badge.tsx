import { JSX, splitProps } from "solid-js";

export interface BadgeProps extends JSX.HTMLAttributes<HTMLSpanElement> {
  variant?: "forest" | "sage" | "terracotta" | "cream" | "default";
}

export default function Badge(props: BadgeProps) {
  const [local, others] = splitProps(props, ["variant", "class", "children"]);

  const variant = local.variant || "default";

  // Base styles
  const baseStyles =
    "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium";

  // Variant styles
  const variantStyles = {
    forest:
      "bg-forest-100 text-forest-700 dark:bg-forest-700 dark:text-forest-100",
    sage: "bg-sage-100 text-sage-700 dark:bg-sage-700 dark:text-sage-100",
    terracotta:
      "bg-terracotta-100 text-terracotta-700 dark:bg-terracotta-700 dark:text-terracotta-100",
    cream: "bg-cream-200 text-cream-600 dark:bg-cream-600 dark:text-cream-100",
    default: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100",
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${
    local.class || ""
  }`;

  return (
    <span class={classes} {...others}>
      {local.children}
    </span>
  );
}
