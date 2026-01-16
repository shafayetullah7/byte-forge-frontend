import { A, useLocation } from "@solidjs/router";
import { createSignal, onMount, onCleanup } from "solid-js";
import { MagnifyingGlassIcon, ShoppingBagIcon, Bars3Icon } from "../icons";
import { AuthSection } from "./AuthSection";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const location = useLocation();
  const [scrolled, setScrolled] = createSignal(false);
  const [mobileMenuOpen, setMobileMenuOpen] = createSignal(false);

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
            Home
          </A>
          <A
            href="/plants"
            class="relative text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
            activeClass="text-forest-600 dark:text-sage-400"
          >
            Plants
          </A>
          <A
            href="/shops"
            class="relative text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
            activeClass="text-forest-600 dark:text-sage-400"
          >
            Shops
          </A>
          <A
            href="/about"
            class="relative text-gray-600 dark:text-gray-300 font-medium text-sm hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
            activeClass="text-forest-600 dark:text-sage-400"
          >
            About
          </A>
        </div>

        {/* Right Actions */}
        <div class="flex items-center gap-4 md:gap-6">
          {/* Icons Area */}
          <button
            class="hidden md:flex p-2 text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400 hover:-translate-y-0.5 transition-all"
            aria-label="Search"
          >
            <MagnifyingGlassIcon class="w-5 h-5" />
          </button>

          <button
            class="hidden md:flex p-2 text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400 hover:-translate-y-0.5 transition-all"
            aria-label="Cart"
          >
            <ShoppingBagIcon class="w-5 h-5" />
          </button>

          {/* Auth Section (Desktop) */}
          <AuthSection />

          {/* Mobile Toggle */}
          <div class="block lg:hidden mobile-menu-container">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen())}
              class="flex p-2 text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
              aria-label="Menu"
            >
              <Bars3Icon class="w-6 h-6" />
            </button>

            {/* Mobile Menu Dropdown */}
            <MobileMenu
              isOpen={mobileMenuOpen()}
              onClose={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      </nav>
    </header>
  );
}
