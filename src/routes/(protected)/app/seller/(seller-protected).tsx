import { useNavigate, createAsync, Navigate } from "@solidjs/router";
import { Suspense, Show, ParentComponent } from "solid-js";
import { getShopStatus } from "~/lib/context/shop-context";

const SellerProtectedLayout: ParentComponent = (props) => {
    const shopStatus = createAsync(() => getShopStatus());

    return (
        <Suspense>
            <Show
                when={shopStatus() !== null}
                fallback={<Navigate href="/app/seller/setup-shop" />}
            >
                {props.children}
            </Show>
        </Suspense>
    );
};

export default SellerProtectedLayout;
