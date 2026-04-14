import { useNavigate, createAsync, Navigate } from "@solidjs/router";
import { Suspense, Show, ErrorBoundary, ParentComponent } from "solid-js";
import { getShopStatus } from "~/lib/context/shop-context";
import { SellerLayout } from "~/components/layout/dashboard/SellerLayout";

const SellerProtectedLayout: ParentComponent = (props) => {
    const shopStatus = createAsync(() => getShopStatus());

    return (
        <ErrorBoundary fallback={(error) => <div class="flex justify-center py-20 text-red-600">Error loading shop status: {error.toString()}</div>}>
            <Suspense fallback={<div class="flex justify-center py-20">Loading...</div>}>
                <Show
                    when={shopStatus() !== null}
                    fallback={<Navigate href="/app/seller/setup-shop" />}
                >
                    {/* Apply SellerLayout only after shop status is confirmed */}
                    <SellerLayout>
                        {props.children}
                    </SellerLayout>
                </Show>
            </Suspense>
        </ErrorBoundary>
    );
};

export default SellerProtectedLayout;
