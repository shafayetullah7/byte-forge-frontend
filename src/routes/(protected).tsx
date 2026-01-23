import { useNavigate } from "@solidjs/router";

import { BusinessAccountProvider } from "~/lib/context/business-account-context";
import { Show, createEffect, ParentComponent, ErrorBoundary } from "solid-js";
import { useSession } from "~/lib/auth";
import { requireVerifiedEmail } from "~/lib/auth/guards";
import { ApiError } from "~/lib/api";

/**
 * Server-side route guard
 */
export const route = {
    load: () => requireVerifiedEmail(),
};

const ProtectedLayout: ParentComponent = (props) => {
    const user = useSession();
    const navigate = useNavigate();

    // Client-side backup guard (for client-side navigation)
    createEffect(() => {
        const userData = user();

        // Don't do anything while loading (undefined state)
        if (userData === undefined) return;

        // If userData is explicitly null, user is not logged in → Redirect to login
        if (userData === null) {
            navigate("/login", { replace: true });
            return;
        }

        // If userData exists but email is not verified → Redirect to verify-account
        if (userData && !userData.emailVerified) {
            navigate("/verify-account", { replace: true });
            return;
        }
    });

    // Only render content if user is verified
    // We use user()?.emailVerified to safely handle the loading state (undefined) or null
    return (
        <ErrorBoundary
            fallback={(error, reset) => {
                // Log error for debugging
                console.error("[ProtectedLayout ErrorBoundary] Caught error:", error);
                console.error("[ProtectedLayout ErrorBoundary] Error type:", error?.constructor?.name);
                console.error("[ProtectedLayout ErrorBoundary] Error stack:", error?.stack);

                // Fix #3: Don't catch Response objects (SSR redirects)
                if (error instanceof Response) {
                    throw error;
                }

                // Handle auth errors that somehow got through
                if (error instanceof ApiError && error.statusCode === 401) {
                    navigate("/login", { replace: true });
                    return null;
                }

                // Show error screen for other errors
                const errorMessage = error instanceof Error
                    ? error.message
                    : typeof error === "string"
                        ? error
                        : "An unexpected error occurred";

                return (
                    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-forest-900">
                        <div class="text-center p-8 max-w-lg">
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Something went wrong
                            </h1>
                            <p class="text-gray-600 dark:text-gray-400 mb-6">
                                {errorMessage}
                            </p>
                            <div class="mb-6 p-4 bg-gray-100 dark:bg-forest-800 rounded-lg text-left overflow-auto max-h-64">
                                <p class="text-xs font-mono text-gray-700 dark:text-gray-300 break-all whitespace-pre-wrap">
                                    {error?.stack || JSON.stringify(error, null, 2)}
                                </p>
                            </div>
                            <button
                                onClick={reset}
                                class="px-4 py-2 bg-terracotta-600 text-white rounded-lg hover:bg-terracotta-700 transition-colors"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                );
            }}
        >
            <Show when={user() !== null} fallback={null}>
                <BusinessAccountProvider>{props.children}</BusinessAccountProvider>
            </Show>
        </ErrorBoundary>
    );
};

export default ProtectedLayout;
