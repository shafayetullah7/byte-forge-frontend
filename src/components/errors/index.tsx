import { Component, ErrorBoundary, JSX, Reset } from "solid-js";

interface ErrorFallbackProps {
  error: Error;
  reset: Reset;
}

export interface SafeErrorBoundaryProps {
  fallback: (error: Error, reset: Reset) => JSX.Element;
  children: JSX.Element;
}

/**
 * Error boundary wrapper for safe error handling
 */
export function SafeErrorBoundary(props: SafeErrorBoundaryProps) {
  return (
    <ErrorBoundary fallback={props.fallback}>
      {props.children}
    </ErrorBoundary>
  );
}

/**
 * Inline error display component
 */
export function InlineErrorFallback(props: {
  error: Error;
  reset: Reset;
  label?: string;
}) {
  return (
    <div class="p-4 my-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-start gap-3">
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
          class="text-red-500 flex-shrink-0"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <div class="flex-1">
          <h3 class="text-sm font-semibold text-red-800 dark:text-red-300">
            Failed to load {props.label || "content"}
          </h3>
          <p class="text-sm text-red-600 dark:text-red-400 mt-1">
            {props.error.message}
          </p>
          <button
            onClick={props.reset}
            class="mt-3 px-3 py-1.5 text-sm bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Simple error display component
 */
export function ErrorDisplay(props: { error: Error; onRetry?: () => void }) {
  return (
    <div class="p-6 my-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
      <div class="flex items-center gap-3 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="text-red-500"
        >
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <h2 class="text-lg font-semibold text-red-800 dark:text-red-300">
          Something went wrong
        </h2>
      </div>
      <p class="text-sm text-red-600 dark:text-red-400 mb-4">
        {props.error.message}
      </p>
      {props.onRetry && (
        <button
          onClick={props.onRetry}
          class="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}
    </div>
  );
}
