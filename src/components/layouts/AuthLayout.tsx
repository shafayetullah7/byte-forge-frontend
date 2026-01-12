import { JSX } from "solid-js";
import { A } from "@solidjs/router";

export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: JSX.Element;
}

export default function AuthLayout(props: AuthLayoutProps) {
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
            class="text-2xl font-bold bg-gradient-to-r from-forest-600 to-sage-500 bg-clip-text text-transparent"
          >
            ByteForge
          </A>
        </div>

        {/* Card Container */}
        <div class="bg-white dark:bg-forest-800 rounded-xl shadow-lg p-8">
          {/* Title Section */}
          <div class="mb-6">
            <h1 class="text-3xl font-bold text-forest-700 dark:text-sage-300 mb-2">
              {props.title}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">{props.subtitle}</p>
          </div>

          {/* Content */}
          {props.children}
        </div>
      </div>
    </main>
  );
}
