import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function MobileMenuPreferences() {
  return (
    <div class="mx-3 my-2 rounded-xl bg-cream-100/90 dark:bg-forest-900/50 px-3 py-2.5">
      <div class="flex items-center justify-between gap-2">
        <ThemeToggle />
        <LanguageSwitcher variant="compact" />
      </div>
    </div>
  );
}
