import { useNavigate } from "@solidjs/router";
import { RoleProvider } from "~/lib/context/role-context";
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
                return (
                    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                        <div class="text-center p-8">
                            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                Something went wrong
                            </h1>
                            <p class="text-gray-600 dark:text-gray-400 mb-6">
                                {error instanceof Error ? error.message : "An unexpected error occurred"}
                            </p>
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
            <Show when={user()?.emailVerified}>
                <RoleProvider>
                    <BusinessAccountProvider>{props.children}</BusinessAccountProvider>
                </RoleProvider>
            </Show>
        </ErrorBoundary>
    );
};

export default ProtectedLayout;
