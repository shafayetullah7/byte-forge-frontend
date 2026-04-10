import { Navigate } from "@solidjs/router";

/**
 * Redirect old /dashboard route to new /app route
 * This maintains backward compatibility while migrating to the new route structure
 */
export default function DashboardRedirect() {
    return <Navigate href="/app" />;
}
