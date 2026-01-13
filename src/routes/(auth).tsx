import { RouteSectionProps, A, useLocation } from "@solidjs/router";
import { createMemo } from "solid-js";

// Route metadata for titles and subtitles
const routeMetadata: Record<string, { title: string; subtitle: string }> = {
  "/login": {
    title: "Welcome Back",
    subtitle: "Sign in to your ByteForge account",
  },
  "/register": {
    title: "Create Account",
    subtitle: "Start your journey with ByteForge",
  },
  "/forgot-password": {
    title: "Forgot Password?",
    subtitle: "Enter your email and we'll send you a reset link",
  },
  "/reset-password": {
    title: "Reset Password",
    subtitle: "Enter your new password",
  },
  "/verify-account": {
    title: "Verify Your Account",
    subtitle: "Enter the verification code sent to your email",
  },
};

export default function AuthLayout(props: RouteSectionProps) {
  const location = useLocation();

  const metadata = createMemo(() => {
    return (
      routeMetadata[location.pathname] || {
        title: "ByteForge",
        subtitle: "Welcome",
      }
    );
  });

  return (
    <main class="min-h-screen bg-cream-50 dark:bg-forest-900 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        {/* Header */}
        <div class="flex items-center justify-between mb-8">
          <A
            href="/"
            class="text-sm text-gray-600 dark:text-gray-400 hover:text-forest-600 dark:hover:text-sage-400 flex items-center gap-2"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Home
          </A>
          <A
            href="/"
            class="text-2xl font-bold bg-linear-to-r from-forest-600 to-sage-500 bg-clip-text text-transparent"
          >
            ByteForge
          </A>
        </div>

        {/* Card Container */}
        <div class="bg-white dark:bg-forest-800 rounded-xl shadow-lg p-8">
          {/* Title Section */}
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-forest-700 dark:text-sage-300 mb-2">
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
