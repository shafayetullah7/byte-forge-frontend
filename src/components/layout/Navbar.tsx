import { A, useLocation } from "@solidjs/router";
import { Show, createSignal, onMount, onCleanup } from "solid-js";
import { useSession } from "~/lib/auth";
import "./Navbar.css";

export function Navbar() {
  const user = useSession();
  const location = useLocation();
  const [scrolled, setScrolled] = createSignal(false);

  // Handle scroll effect for navbar
  const handleScroll = () => {
    setScrolled(window.scrollY > 20);
  };

  onMount(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", handleScroll);
    }
  });

  onCleanup(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", handleScroll);
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

  return (
    <header class="navbar-container" classList={{ scrolled: scrolled() }}>
      <nav class="navbar-glass">
        {/* Logo Section */}
        <A href="/" class="nav-logo">
          ByteForge
          <span class="logo-dot"></span>
        </A>

        {/* Center Links */}
        <div class="nav-links">
          <A href="/" class="nav-link" activeClass="active" end>
            Home
          </A>
          <A href="/plants" class="nav-link" activeClass="active">
            Plants
          </A>
          <A href="/shops" class="nav-link" activeClass="active">
            Shops
          </A>
          <A href="/about" class="nav-link" activeClass="active">
            About
          </A>
        </div>

        {/* Right Actions */}
        <div class="nav-actions">
          {/* Icons Area */}
          <button class="icon-btn" aria-label="Search">
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

          <button class="icon-btn" aria-label="Cart">
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

          {/* Auth Conditional Branding */}
          <Show
            when={user()}
            fallback={
              <div class="auth-btns">
                <A href="/login" class="btn-login">
                  Login
                </A>
                <A href="/register" class="btn-register">
                  Join Now
                </A>
              </div>
            }
          >
            {(userData) => (
              <A href="/profile" class="user-profile">
                <span class="user-name">{userData().userName}</span>
                <div class="avatar">{getInitials(userData().userName)}</div>
              </A>
            )}
          </Show>

          {/* Mobile Toggle */}
          <button class="mobile-toggle" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
