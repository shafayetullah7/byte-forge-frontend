import { RouteSectionProps, A, useLocation, useNavigate } from "@solidjs/router";
import { createMemo, createEffect } from "solid-js";
import { useSession } from "~/lib/auth";
import { useI18n } from "~/i18n";

export default function AuthLayout(props: RouteSectionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSession();
  const { t } = useI18n();

  createEffect(() => {
    const currentUser = user();
    const path = location.pathname;

    if (currentUser) {
      // User IS logged in
      if (currentUser.emailVerified) {
        // 1. Verified User: should NOT be in auth layout at all (login, register, verify-account, etc.)
        // Redirect to home or dashboard
        navigate("/", { replace: true });
      } else {
        // 2. Unverified User: should ONLY be on /verify-account
        if (path !== "/verify-account") {
          navigate("/verify-account", { replace: true });
        }
      }
    } else {
      // User is Guest (NOT logged in)
      // 3. Guest: Should NOT be on /verify-account (needs auth to verify)
      if (path === "/verify-account") {
        navigate("/login", { replace: true });
      }
      // Guests are allowed on login, register, forgot-password, etc.
    }
  });

  const metadata = createMemo(() => {
    const path = location.pathname;
    switch (path) {
      case "/login":
        return {
          title: t("auth.login.title"),
          subtitle: t("auth.login.subtitle"),
        };
      case "/register":
        return {
          title: t("auth.register.title"),
          subtitle: t("auth.register.subtitle"),
        };
      case "/forgot-password":
        return {
          title: t("auth.forgotPassword.title"),
          subtitle: t("auth.forgotPassword.subtitle"),
        };
      case "/reset-password":
        return {
          title: t("auth.resetPassword.title"),
          subtitle: t("auth.resetPassword.subtitle"),
        };
      case "/verify-reset":
        return {
          title: t("auth.verifyReset.title"),
          subtitle: t("auth.verifyReset.subtitle"),
        };
      case "/verify-account":
        return {
          title: t("auth.verifyAccount.title"),
          subtitle: t("auth.verifyAccount.subtitle"),
        };
      default:
        return {
          title: "ByteForge",
          subtitle: t("common.welcome"),
        };
    }
  });

  return (
    <main class="min-h-screen flex items-center justify-center p-4 transition-colors duration-200">
      <div class="w-full max-w-fit mx-auto transition-all duration-300 ease-in-out">
        {/* Header */}
        <div class="flex items-center justify-between mb-8">
          <A
            href="/"
            class="text-sm font-medium text-forest-700 dark:text-cream-200 hover:text-terracotta-500 dark:hover:text-terracotta-400 flex items-center gap-2 transition-colors group"
          >
            <svg
              class="w-4 h-4 transition-transform group-hover:-translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t("common.home")}
          </A>
          <A
            href="/"
            class="text-2xl font-bold text-forest-800 dark:text-cream-50 flex items-center"
          >
            ByteForge<span class="text-terracotta-500">.</span>
          </A>
        </div>

        {/* Card Container */}
        <div class="bg-white dark:bg-forest-900 rounded-xl shadow-sm border border-cream-100 dark:border-forest-800 p-8 transition-colors">
          {/* Title Section */}
          <div class="mb-8">
            <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50 mb-2">
              {metadata().title}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {metadata().subtitle}
            </p>
          </div>

          {/* Content */}
          {props.children}
        </div>
      </div>
    </main>
  );
}
