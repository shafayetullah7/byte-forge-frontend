import { JSX, splitProps, Show } from "solid-js";

export interface CardProps extends JSX.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "bordered" | "tinted";
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
  const baseStyles = "flat-card transition-standard";

  // Variant styles
  const variantStyles = {
    default: "flat-card-hover",
    bordered: "border-cream-300 dark:border-forest-600 flat-card-hover",
    tinted: "bg-forest-50 dark:bg-forest-900/50 border-transparent",
  };

  const classes = `${baseStyles} ${variantStyles[variant]} p-6 ${local.class || ""}`;

  return (
    <div class={classes} {...others}>
      <Show when={local.title}>
        <h3 class="h5 mb-2">
          {local.title}
        </h3>
      </Show>
      <Show when={local.description}>
        <p class="body-small text-forest-700/70 dark:text-gray-400 mb-4">
          {local.description}
        </p>
      </Show>
      {local.children}
    </div>
  );
}
