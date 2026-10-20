import { A, createAsync } from "@solidjs/router";
import { createSignal, onMount, onCleanup, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { HeartIcon, ShoppingBagIcon, Bars3Icon } from "../icons";
import { AuthSection } from "./AuthSection";
import { MobileMenu } from "./MobileMenu";
import { ThemeToggle } from "./ThemeToggle";
import { NavbarPlantSearch } from "./NavbarPlantSearch";
import { useSession } from "~/lib/auth";
import { useI18n } from "~/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { getCartCount } from "~/lib/api/endpoints/buyer/cart.api";
import { NavbarPrimaryLinks } from "./NavbarPrimaryLinks";
import { MobileHeaderAccountLink } from "./UserAvatarChip";

export function Navbar() {
  const user = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);
  const { t } = useI18n();
  const cartCount = createAsync(() => getCartCount(), {
    initialValue: { itemsCount: 0, totalQuantity: 0 },
  });

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!document.contains(target)) return;

    if (!target.closest(".mobile-menu-container")) {
      setMobileMenuOpen(false);
    }
  };

  onMount(() => {
    if (!isServer) {
      document.addEventListener("click", handleClickOutside);
    }
  });

  onCleanup(() => {
    if (!isServer) {
      document.removeEventListener("click", handleClickOutside);
    }
  });

  return (
    <header class="sticky top-0 z-50">
      <nav
        class="w-full bg-cream-50 dark:bg-forest-900 border-b border-cream-200/60 dark:border-forest-700/60 transition-colors duration-200"
        aria-label={t("landing.nav.mainAriaLabel")}
      >
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between gap-2 min-h-16 py-2">
            <div class="flex-shrink-0">
              <A
                href="/"
                class="h5 flex items-center gap-2 hover:text-forest-600 dark:hover:text-forest-300 transition-standard"
              >
                ByteForge
                <span class="w-1.5 h-1.5 bg-terracotta-500 rounded-full" />
              </A>
            </div>

            <NavbarPlantSearch />

            <div class="hidden md:flex items-center gap-6 lg:gap-8 flex-shrink-0">
              <NavbarPrimaryLinks variant="desktop" />
            </div>

            <div class="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <A
                href="/app/favorites"
                class="p-2.5 text-gray-500 dark:text-gray-400 hover:text-terracotta-500 dark:hover:text-terracotta-400 transition-colors duration-200"
                aria-label={t("buyer.favorites.title")}
              >
                <HeartIcon class="w-5 h-5" />
              </A>

              <A
                href="/cart"
                class="p-2.5 text-gray-500 dark:text-gray-400 hover:text-terracotta-500 dark:hover:text-terracotta-400 transition-colors duration-200 relative"
                aria-label={t("common.cart")}
              >
                <ShoppingBagIcon class="w-5 h-5" />
                <Show when={cartCount()?.totalQuantity > 0}>
                  <span class="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-5 px-1.5 flex items-center justify-center bg-terracotta-500 text-white text-[10px] font-bold rounded-full leading-none">
                    {cartCount()?.totalQuantity}
                  </span>
                </Show>
              </A>

              <div class="hidden md:flex items-center gap-2">
                <ThemeToggle />
                <LanguageSwitcher variant="compact" />
              </div>

              <div class="hidden md:block">
                <AuthSection />
              </div>

              <Show when={user()} keyed>
                {(userData) => (
                  <div class="md:hidden">
                    <MobileHeaderAccountLink user={userData} />
                  </div>
                )}
              </Show>

              <div class="md:hidden mobile-menu-container relative">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
                  class="p-2.5 text-forest-700 dark:text-gray-300 hover:text-terracotta-500 dark:hover:text-terracotta-400 transition-colors duration-200"
                  aria-label={t("landing.nav.toggleMenu")}
                  aria-expanded={mobileMenuOpen()}
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
