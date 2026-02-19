import { JSX, splitProps, Show } from "solid-js";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "elevated";
  title?: string;
  description?: string;
}

export default function Card(props: CardProps) {
  const [local, others] = splitProps(props, [
    "variant",
    "class",
    "title",
    "description",
    "children",
  ]);

  const variant = local.variant || "default";

  // Base styles
  const baseStyles =
    "p-6 rounded-xl bg-white dark:bg-forest-800 transition-colors duration-200";

  // Variant styles
  const variantStyles = {
    default: "",
    bordered:
      "border-2 border-cream-200 dark:border-forest-700 hover:border-cream-300 dark:hover:border-forest-600",
    elevated: "shadow-md hover:shadow-lg",
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${local.class || ""
    }`;

  return (
    <div class={classes} {...others}>
      <Show when={local.title}>
        <h3 class="text-lg font-semibold text-forest-700 dark:text-forest-300 mb-2">
          {local.title}
        </h3>
      </Show>
      <Show when={local.description}>
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {local.description}
        </p>
      </Show>
      {local.children}
    </div>
  );
}
