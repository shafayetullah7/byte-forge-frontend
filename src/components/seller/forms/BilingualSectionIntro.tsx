export function BilingualSectionIntro(props: { title: string; description: string }) {
  return (
    <div class="bg-cream-50 dark:bg-forest-800/50 rounded-xl p-4 border border-cream-200 dark:border-forest-700">
      <p class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{props.title}</p>
      <p class="text-sm text-gray-600 dark:text-gray-400">{props.description}</p>
    </div>
  );
}
