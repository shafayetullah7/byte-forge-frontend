import { A, useLocation } from "@solidjs/router";
import { createSignal, onMount, onCleanup, Show } from "solid-js";
import { MagnifyingGlassIcon, ShoppingBagIcon, Bars3Icon } from "../icons";
import { AuthSection } from "./AuthSection";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { useSession } from "~/lib/auth";
import { getInitials } from "~/lib/utils/string.utils";
import { useI18n } from "~/i18n";

export function Navbar() {
  const user = useSession();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const { t, locale, toggleLocale } = useI18n();

  // Close mobile menu when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".mobile-menu-container")) {
      setMobileMenuOpen(false);
    }
  };

  onMount(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("click", handleClickOutside);
    }
  });

  onCleanup(() => {
    if (typeof window !== "undefined") {
      document.removeEventListener("click", handleClickOutside);
    }
  });

  return (
    <header class="sticky top-0 z-30">
      <nav class="w-full bg-white dark:bg-forest-800 border-b border-cream-200 dark:border-forest-700 transition-colors duration-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div class="flex-shrink-0">
              <A
                href="/"
                class="text-xl md:text-2xl font-bold text-forest-800 dark:text-cream-100 flex items-center gap-2 hover:text-forest-600 dark:hover:text-forest-300 transition-colors duration-200"
              >
                GreenHaven
                <span class="w-2 h-2 bg-forest-500 rounded-full"></span>
              </A>
            </div>

            {/* Center Links - Hidden on mobile */}
            <div class="hidden md:flex items-center gap-8">
              <A
                href="/"
                class="text-forest-700 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-forest-300 transition-colors duration-200"
                activeClass="text-forest-600 dark:text-forest-300 font-semibold"
                end
              >
                {t("common.home")}
              </A>
              <A
                href="/plants"
                class="text-forest-700 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-forest-300 transition-colors duration-200"
                activeClass="text-forest-600 dark:text-forest-300 font-semibold"
              >
                {t("common.plants")}
              </A>
              <A
                href="/shops"
                class="text-forest-700 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-forest-300 transition-colors duration-200"
                activeClass="text-forest-600 dark:text-forest-300 font-semibold"
              >
                {t("common.shops")}
              </A>
              <A
                href="/about"
                class="text-forest-700 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-forest-300 transition-colors duration-200"
                activeClass="text-forest-600 dark:text-forest-300 font-semibold"
              >
                {t("common.about")}
              </A>
            </div>

            {/* Right Actions */}
            <div class="flex items-center gap-4">
              <button
                class="p-2.5 text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-300 transition-colors duration-200"
                aria-label="Search"
              >
                <MagnifyingGlassIcon class="w-5 h-5" />
              </button>

              <button
                class="p-2.5 text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-300 transition-colors duration-200 relative"
                aria-label="Cart"
              >
                <ShoppingBagIcon class="w-5 h-5" />
                {/* Optional cart badge could go here */}
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              <button
                class="p-2.5 text-gray-500 dark:text-gray-400 hover:text-forest-600 dark:hover:text-forest-300 transition-colors duration-200 text-sm font-medium"
                onClick={toggleLocale}
                aria-label="Switch Language"
              >
                {locale() === "en" ? "BN" : "EN"}
              </button>

              {/* Auth Section */}
              <div class="hidden md:block">
                <AuthSection />
              </div>


              {/* Mobile Menu Trigger */}
              <div class="md:hidden mobile-menu-container">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
                  class="p-2.5 text-forest-700 dark:text-gray-300 hover:text-forest-600 dark:hover:text-forest-300 transition-colors duration-200"
                  aria-label="Toggle menu"
                >
                  <Bars3Icon class="w-6 h-6" />
                </button>

                <MobileMenu
                  isOpen={mobileMenuOpen()}
                  onClose={() => setMobileMenuOpen(false)}
                  user={user}
                />
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
