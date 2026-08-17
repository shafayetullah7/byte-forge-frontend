import { RouteSectionProps, A, useLocation, useNavigate } from "@solidjs/router";
import { createMemo, createEffect } from "solid-js";
import { useSession, safeReturnTo } from "~/lib/auth";
import { useI18n } from "~/i18n";

export default function AuthLayout(props: RouteSectionProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useSession();
  const { t } = useI18n();

  createEffect(() => {
    const currentUser = user();
    if (!currentUser) return;

    const returnTo = location.query.returnTo;
    navigate(safeReturnTo(returnTo), { replace: true });
  });

  const metadata = createMemo(() => ({
    title: t("auth.login.title"),
    subtitle: t("auth.login.subtitle"),
  }));

  return (
    <main class="min-h-screen flex items-center justify-center p-4 transition-colors duration-200">
      <div class="w-full max-w-fit mx-auto transition-all duration-300 ease-in-out">
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

        <div class="bg-white dark:bg-forest-900 rounded-xl shadow-sm border border-cream-100 dark:border-forest-800 p-8 transition-colors">
          <div class="mb-8">
            <h1 class="text-2xl md:text-3xl font-bold text-forest-800 dark:text-cream-50 mb-2">
              {metadata().title}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {metadata().subtitle}
            </p>
          </div>

          {props.children}
        </div>
      </div>
    </main>
  );
}
