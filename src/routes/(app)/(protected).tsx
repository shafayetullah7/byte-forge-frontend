import { useNavigate } from "@solidjs/router";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { RoleProvider } from "~/lib/context/role-context";
import { BusinessAccountProvider } from "~/lib/context/business-account-context";

import { Show, createEffect, ParentComponent } from "solid-js";
import { useSession } from "~/lib/auth";

const ProtectedLayout: ParentComponent = (props) => {
    const user = useSession();
    const navigate = useNavigate();

    createEffect(() => {
        const userData = user();

        // If userData is explicitly null, user is not logged in -> Redirect to login
        if (userData === null) {
            navigate("/login", { replace: true });
            return;
        }

        // If userData exists but email is not verified -> Redirect to verify-account
        if (userData && !userData.emailVerified) {
            navigate("/verify-account", { replace: true });
            return;
        }
    });

    // Only render content if user is verified
    // We use user()?.emailVerified to safely handle the loading state (undefined) or null
    return (
        <Show when={user()?.emailVerified}>
            <RoleProvider>
                <BusinessAccountProvider>
                    <DashboardLayout>
                        {props.children}
                    </DashboardLayout>
                </BusinessAccountProvider>
            </RoleProvider>
        </Show>
    );
};

export default ProtectedLayout;
