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
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  // Size styles
  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2.5 text-sm sm:text-base",
    lg: "px-6 py-3 text-base",
  };

  // Variant styles
  const variantStyles = {
    primary:
      "bg-forest-600 hover:bg-forest-700 text-white shadow-sm focus:ring-forest-500/30 dark:bg-forest-500 dark:hover:bg-forest-400",
    secondary:
      "bg-forest-50 hover:bg-forest-100 text-forest-700 focus:ring-forest-500/30 dark:bg-white/10 dark:text-white dark:hover:bg-white/20",
    accent:
      "bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm focus:ring-terracotta-500/30",
    outline:
      "bg-transparent border border-cream-300 text-forest-700 hover:bg-forest-50 focus:ring-forest-500/30 dark:border-forest-700 dark:text-gray-300",
    ghost:
      "bg-transparent hover:bg-forest-50 text-forest-700 focus:ring-forest-500/30 dark:text-gray-300 dark:hover:bg-forest-700",
  };

  const classes = `${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]
    } ${local.class || ""}`;

  return (
    <button class={classes} {...others}>
      {local.children}
    </button>
  );
}
