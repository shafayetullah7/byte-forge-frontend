import {
    createContext,
    createEffect,
    createSignal,
    useContext,
    JSX,
    onMount,
} from "solid-js";
import { isServer } from "solid-js/web";

export type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: () => Theme;
    resolvedTheme: () => "light" | "dark";
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>();

export function ThemeProvider(props: {
    initialTheme?: Theme;
    children: JSX.Element;
}) {
    const [theme, setTheme] = createSignal<Theme>(props.initialTheme || "system");
    const [systemTheme, setSystemTheme] = createSignal<"light" | "dark">("light");

    // Sync with system preference
    onMount(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        setSystemTheme(mediaQuery.matches ? "dark" : "light");

        const handler = (e: MediaQueryListEvent) => {
            setSystemTheme(e.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    });

    const resolvedTheme = () => {
        if (theme() === "system") return systemTheme();
        return theme() as "light" | "dark";
    };

    // Sync theme class and cookies
    createEffect(() => {
        const currentTheme = resolvedTheme();
        const locTheme = theme();

        if (!isServer) {
            // Update cookie
            document.cookie = `theme=${locTheme}; path=/; max-age=31536000; SameSite=Lax`;

            // Update HTML class
            const root = document.documentElement;
            if (currentTheme === "dark") {
                root.classList.add("dark");
            } else {
                root.classList.remove("dark");
            }
        }
    });

    const value = {
        theme,
        resolvedTheme,
        setTheme,
    };

    return (
        <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
