import { Show } from "solid-js";
import { useTheme } from "~/lib/context/theme-context";
import { SunIcon, MoonIcon } from "../icons";

export function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(resolvedTheme() === "dark" ? "light" : "dark");
    };

    return (
        <button
            onClick={toggleTheme}
            class="p-2.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-300 hover:bg-forest-50 dark:hover:bg-forest-900/30 transition-colors duration-200"
            aria-label="Toggle theme"
        >
            <Show
                when={resolvedTheme() === "dark"}
                fallback={<MoonIcon class="w-6 h-6" />}
            >
                <SunIcon class="w-6 h-6" />
            </Show>
        </button>
    );
}
