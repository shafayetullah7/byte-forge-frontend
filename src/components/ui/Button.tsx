import { JSX, splitProps } from "solid-js";

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
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

  // Base styles
  const baseStyles =
    "font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Variant styles
  const variantStyles = {
    primary:
      "bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm focus:ring-terracotta-300 dark:bg-terracotta-600 dark:hover:bg-terracotta-700",
    secondary:
      "bg-forest-600 hover:bg-forest-700 text-white shadow-sm focus:ring-forest-300 dark:bg-forest-700 dark:hover:bg-forest-800",
    outline:
      "bg-transparent border-2 border-forest-600 text-forest-600 hover:bg-forest-50 focus:ring-forest-300 dark:border-sage-400 dark:text-sage-400 dark:hover:bg-forest-800",
    ghost:
      "bg-sage-100 hover:bg-sage-200 text-sage-700 focus:ring-sage-300 dark:bg-sage-800 dark:hover:bg-sage-700 dark:text-sage-300",
  };

  const classes = `${baseStyles} ${sizeStyles[size]} ${
    variantStyles[variant]
  } ${local.class || ""}`;

  return (
    <button class={classes} {...others}>
      {local.children}
    </button>
  );
}
