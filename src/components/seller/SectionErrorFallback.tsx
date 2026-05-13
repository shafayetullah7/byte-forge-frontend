export function SectionErrorFallback(props: { error: Error; title?: string }) {
  return (
    <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
      <p class="text-sm text-amber-700 dark:text-amber-300">
        {props.title ? `Failed to load ${props.title}: ` : ""}{props.error?.message || "An unexpected error occurred."}
      </p>
    </div>
  );
}
