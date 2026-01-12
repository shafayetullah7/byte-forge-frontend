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
    "p-6 rounded-xl bg-white dark:bg-forest-800 transition-colors";

  // Variant styles
  const variantStyles = {
    default: "",
    bordered:
      "border-2 border-sage-200 dark:border-sage-700 hover:border-sage-300 dark:hover:border-sage-600",
    elevated: "shadow-md hover:shadow-lg",
  };

  const classes = `${baseStyles} ${variantStyles[variant]} ${
    local.class || ""
  }`;

  return (
    <div class={classes} {...others}>
      <Show when={local.title}>
        <h3 class="text-lg font-semibold text-forest-700 dark:text-sage-300 mb-2">
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
