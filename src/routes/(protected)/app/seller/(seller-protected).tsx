import { useNavigate } from "@solidjs/router";
import { Show, createEffect, ParentComponent } from "solid-js";
import { useShop } from "~/lib/context/shop-context";

const SellerProtectedLayout: ParentComponent = (props) => {
    const { shop, isLoading } = useShop();
    const navigate = useNavigate();

    createEffect(() => {
        const currentShop = shop();
        const loading = isLoading();

        // Wait for loading to complete
        if (loading) return;

        // If no shop exists, redirect to setup
        if (currentShop === null) {
            navigate("/app/seller/setup-shop", { replace: true });
            return;
        }
    });

    // Only render content if shop exists and is truthy
    // This prevents rendering when shop is null or undefined
    return (
        <Show when={!isLoading() && shop()}>
            {props.children}
        </Show>
    );
};

export default SellerProtectedLayout;
