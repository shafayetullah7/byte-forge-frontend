import { A, useLocation, useNavigate } from "@solidjs/router";
import { Show, createSignal, onMount, onCleanup } from "solid-js";
import { useSession } from "~/lib/auth";
import { authApi } from "~/lib/api";

export function Navbar() {
  const user = useSession();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = createSignal(false);
  const [dropdownOpen, setDropdownOpen] = createSignal(false);
  const [isLoggingOut, setIsLoggingOut] = createSignal(false);

  // Handle scroll effect for navbar
  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };

  // Close dropdown when clicking outside
  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".profile-dropdown-container")) {
      setDropdownOpen(false);
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    const { performLogout } = await import("~/lib/auth");
    setIsLoggingOut(true);
    try {
      await performLogout();
      // Redirect to home page after logout
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setDropdownOpen(false);
    }
  };

  return (
    <header
      class="fixed top-0 left-0 right-0 z-50 flex justify-center px-8 transition-all duration-300"
      style={{ height: "80px" }}
    >
      <nav
        class="w-full max-w-7xl mt-4 h-16 flex items-center justify-between px-8 rounded-full border shadow-lg transition-all duration-300"
        classList={{
          "bg-white/70 backdrop-blur-md border-white/30": !scrolled(),
          "bg-white/90 backdrop-blur-lg border-white/50 shadow-xl": scrolled(),
        }}
      >
        {/* Logo Section */}
        <A
          href="/"
          class="text-2xl font-extrabold text-forest-600 dark:text-sage-400 flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          ByteForge
          <span class="w-2 h-2 bg-amber-400 rounded-full"></span>
        </A>

        {/* Center Links - Hidden on mobile */}
        <div class="hidden lg:flex items-center gap-10">
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
        <div class="flex items-center gap-6">
          {/* Icons Area */}
          <button
            class="hidden md:flex p-2 text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400 hover:-translate-y-0.5 transition-all"
            aria-label="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          <button
            class="hidden md:flex p-2 text-gray-600 dark:text-gray-300 hover:text-forest-600 dark:hover:text-sage-400 hover:-translate-y-0.5 transition-all"
            aria-label="Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </button>

          {/* Auth Conditional Rendering */}
          <Show
            when={user()}
            fallback={
              <div class="flex items-center gap-3">
                <A
                  href="/login"
                  class="text-gray-800 dark:text-gray-200 font-semibold text-sm px-4 py-2 hover:text-forest-600 dark:hover:text-sage-400 transition-colors"
                >
                  Login
                </A>
                <A
                  href="/register"
                  class="bg-forest-600 dark:bg-sage-500 text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-forest-700 dark:hover:bg-sage-600 hover:shadow-lg transition-all"
                >
                  Join Now
                </A>
              </div>
            }
          >
            {(userData) => (
              <div class="relative profile-dropdown-container">
                {/* Profile Button */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen())}
                  class="flex items-center gap-3 px-3 py-1 pr-1 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/15 transition-all cursor-pointer"
                  aria-label="User menu"
                >
                  <span class="text-sm font-medium text-gray-800 dark:text-gray-200 hidden sm:block">
                    {userData().userName}
                  </span>
                  <div class="w-8 h-8 rounded-full bg-forest-600 dark:bg-sage-500 text-white flex items-center justify-center font-semibold text-xs ring-2 ring-white dark:ring-gray-800">
                    {getInitials(userData().userName)}
                  </div>
                </button>

                {/* Dropdown Menu */}
                <Show when={dropdownOpen()}>
                  <div class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* User Info Header */}
                    <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p class="text-sm font-semibold text-gray-900 dark:text-white">
                        {userData().userName}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {userData().email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div class="py-1">
                      <A
                        href="/dashboard"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        Dashboard
                      </A>

                      <A
                        href="/profile"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        Profile
                      </A>

                      <A
                        href="/settings"
                        class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                          />
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Settings
                      </A>
                    </div>

                    {/* Logout Button */}
                    <div class="border-t border-gray-200 dark:border-gray-700 pt-1">
                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut()}
                        class="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                          />
                        </svg>
                        {isLoggingOut() ? "Logging out..." : "Logout"}
                      </button>
                    </div>
                  </div>
                </Show>
              </div>
            )}
          </Show>

          {/* Mobile Toggle */}
          <button class="lg:hidden flex flex-col gap-1 p-2" aria-label="Menu">
            <span class="w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded"></span>
            <span class="w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded"></span>
            <span class="w-6 h-0.5 bg-gray-800 dark:bg-gray-200 rounded"></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
