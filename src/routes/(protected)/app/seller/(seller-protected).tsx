import { useNavigate } from "@solidjs/router";
import { Show, createEffect, ParentComponent } from "solid-js";
import { useShop } from "~/lib/context/shop-context";

const SellerProtectedLayout: ParentComponent = (props) => {
    const { shopStatus, isStatusLoading } = useShop();
    const navigate = useNavigate();

    createEffect(() => {
        const status = shopStatus();
        const loading = isStatusLoading();

        // Wait for loading to complete
        if (loading) return;

        // If no shop exists (status is null), redirect to setup
        if (status === null) {
            navigate("/app/seller/setup-shop", { replace: true });
            return;
        }
    });

    // Only render content if shop status exists and is truthy
    // This prevents rendering when shop status is null or undefined
    return (
        <Show when={!isStatusLoading() && shopStatus()}>
            {props.children}
        </Show>
    );
};

export default SellerProtectedLayout;
