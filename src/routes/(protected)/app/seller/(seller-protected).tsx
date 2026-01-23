import { useNavigate } from "@solidjs/router";
import { Show, createEffect, ParentComponent } from "solid-js";
import { useBusinessAccount } from "~/lib/context/business-account-context";

const SellerProtectedLayout: ParentComponent = (props) => {
    const { businessAccount, isLoading } = useBusinessAccount();
    const navigate = useNavigate();

    createEffect(() => {
        const account = businessAccount();
        const loading = isLoading();

        // Wait for loading to complete
        if (loading) return;

        // If no business account exists, redirect to setup
        if (account === null) {
            navigate("/app/seller/setup-business", { replace: true });
            return;
        }
    });

    // Only render content if business account exists and is truthy
    // This prevents rendering when businessAccount is null or undefined
    return (
        <Show when={!isLoading() && businessAccount()}>
            {props.children}
        </Show>
    );
};

export default SellerProtectedLayout;
