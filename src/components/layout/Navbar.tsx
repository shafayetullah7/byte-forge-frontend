import { A, useLocation } from "@solidjs/router";
import { createSignal, onMount, onCleanup, Show } from "solid-js";
import { MagnifyingGlassIcon, ShoppingBagIcon, Bars3Icon } from "../icons";
import { AuthSection } from "./AuthSection";
import { MobileMenu } from "./MobileMenu";
import { useSession } from "~/lib/auth";
import { getInitials } from "~/lib/utils/string.utils";
import { useI18n } from "~/i18n";

export function Navbar() {
  const user = useSession(); // Hoist auth state
  const location = useLocation();
  const [scrolled, setScrolled] = createSignal(false);
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const { t, locale, toggleLocale } = useI18n();

  // Handle scroll effect for navbar
  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };

  // Close mobile menu when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".mobile-menu-container")) {
      setMobileMenuOpen(false);
    }
  };

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
      document.addEventListener("click", handleClickOutside);
    }
  });

  onCleanup(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("click", handleClickOutside);
    }
  });

  return (
    <header
      class="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 md:px-8 transition-all duration-300 pointer-events-none"
      style={{ height: "auto", "padding-top": "1rem" }}
    >
      <nav
        class="w-full max-w-7xl h-16 flex items-center justify-between px-6 rounded-full border shadow-lg transition-all duration-300 pointer-events-auto"
        classList={{
          "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-white/30 dark:border-white/10":
            !scrolled(),
          "bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-white/50 dark:border-white/20 shadow-xl":
            scrolled(),
          "mt-4": !scrolled(),
          "mt-2": scrolled(),
        }}
      >
        {/* Logo Section */}
        <A
          href="/"
          class="text-xl md:text-2xl font-extrabold text-forest-600 dark:text-sage-400 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          ByteForge
          <span class="w-2 h-2 bg-amber-400 rounded-full"></span>
        </A>

        {/* Center Links - Hidden on mobile */}
        <div class="hidden lg:flex items-center gap-8">
          <A
            href="/"
            class="relative text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
            activeClass="text-forest-600 dark:text-sage-400"
            end
          >
            {t("common.home")}
          </A>
          <A
            href="/plants"
            class="relative text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
            activeClass="text-forest-600 dark:text-sage-400"
          >
            {t("common.plants")}
          </A>
          <A
            href="/shops"
            class="relative text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
            activeClass="text-forest-600 dark:text-sage-400"
          >
            {t("common.shops")}
          </A>
          <A
            href="/about"
            class="relative text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
            activeClass="text-forest-600 dark:text-sage-400"
          >
            {t("common.about")}
          </A>
        </div>

        {/* Right Actions */}
        <div class="flex items-center gap-4 md:gap-6">
          {/* Icons Area */}
          <button
            class="flex p-2 text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400 hover:-translate-y-0.5 transition-all"
            aria-label="Search"
          >
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>

          <button
            class="flex p-2 text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400 hover:-translate-y-0.5 transition-all"
            aria-label="Cart"
          >
            <ShoppingBagIcon class="w-5 h-5" />
          </button>

          <button
            class="flex p-2 text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400 hover:-translate-y-0.5 transition-all font-semibold text-sm"
            onClick={toggleLocale}
            aria-label="Switch Language"
          >
            {locale() === "en" ? "BN" : "EN"}
          </button>

          {/* Auth Section (Desktop) */}
          <AuthSection />

          {/* Mobile Menu Trigger Pill */}
          <div class="block lg:hidden mobile-menu-container">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
              class="flex items-center gap-2 p-1 rounded-full transition-all group"
              classList={{
                "pl-1 pr-2 bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/50": !!user(),
                "hover:bg-gray-200 dark:hover:bg-gray-700": !!user(),
                "text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400": !user(),
              }}
              aria-label="Toggle menu"
            >
              <Show when={user()}>
                {(userData) => (
                  <div class="w-7 h-7 rounded-full bg-forest-600 dark:bg-sage-500 text-white flex items-center justify-center font-semibold text-[10px] ring-2 ring-white dark:ring-gray-800 shadow-sm">
                    {getInitials(userData().userName)}
                  </div>
                )}
              </Show>
              <Bars3Icon class="w-6 h-6" />
            </button>

            {/* Mobile Menu Dropdown */}
            <MobileMenu
              isOpen={mobileMenuOpen()}
              onClose={() => setMobileMenuOpen(false)}
              user={user}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
