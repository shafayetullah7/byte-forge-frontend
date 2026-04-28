import { useNavigate, createAsync, Navigate } from "@solidjs/router";
import { Suspense, Show, ErrorBoundary, ParentComponent } from "solid-js";
import { getShopStatus } from "~/lib/context/shop-context";
import { SellerLayout } from "~/components/layout/dashboard/SellerLayout";
import { InlineErrorFallback } from "~/components/errors";

const SellerProtectedLayout: ParentComponent = (props) => {
    const shopStatus = createAsync(() => getShopStatus());

    return (
        <SellerLayout>
            <ErrorBoundary
                fallback={(error, reset) => (
                    <InlineErrorFallback error={error} reset={reset} label="seller page" />
                )}
            >
                <Suspense fallback={<div class="flex justify-center py-20">Loading...</div>}>
                    <Show
                        when={shopStatus() !== null}
                        fallback={<Navigate href="/app/seller/setup-shop" />}
                    >
                        {props.children}
                    </Show>
                </Suspense>
            </ErrorBoundary>
        </SellerLayout>
    );
};

export default SellerProtectedLayout;
