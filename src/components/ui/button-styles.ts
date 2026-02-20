export const buttonBase =
  "inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

export const buttonSizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-2.5 text-sm sm:text-base",
  lg: "px-6 py-3 text-base",
};

export const buttonVariants = {
  primary:
    "bg-forest-600 hover:bg-forest-700 text-white shadow-sm focus:ring-forest-500/30 dark:bg-forest-500 dark:hover:bg-forest-400",
  secondary:
    "bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm focus:ring-terracotta-500/30 dark:bg-terracotta-500 dark:text-white dark:hover:bg-terracotta-400",
  accent:
    "bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm focus:ring-terracotta-500/30",
  outline:
    "bg-transparent border border-cream-300 text-forest-700 hover:bg-forest-50 focus:ring-forest-500/30 dark:border-forest-700 dark:text-gray-300",
  ghost:
    "bg-transparent hover:bg-forest-50 text-forest-700 focus:ring-forest-500/30 dark:text-gray-300 dark:hover:bg-forest-700",
};

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;
