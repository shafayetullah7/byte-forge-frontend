import { JSX, splitProps } from "solid-js";

export interface ButtonProps
  extends JSX.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost";
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
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Variant styles
  const variantStyles = {
    primary:
      "bg-forest-600 hover:bg-forest-700 text-white shadow-sm focus:ring-forest-500 dark:bg-sage-500 dark:hover:bg-sage-600",
    secondary:
      "bg-forest-50 hover:bg-forest-100 text-forest-700 focus:ring-forest-500 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
    accent:
      "bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm focus:ring-terracotta-500",
    outline:
      "bg-transparent border border-forest-200 text-forest-700 hover:bg-forest-50 focus:ring-forest-500 dark:border-gray-600 dark:text-gray-300",
    ghost:
      "bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-forest-500 dark:text-gray-300 dark:hover:bg-gray-800",
  };

  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]
    } ${local.class || ""}`;

  return (
    <button class={classes} {...others}>
      {local.children}
    </button>
  );
}
