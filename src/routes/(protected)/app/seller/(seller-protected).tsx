import { createAsync, Navigate } from "@solidjs/router";
import { Suspense, Show, ErrorBoundary, ParentComponent } from "solid-js";
import { InlineErrorFallback } from "~/components/errors";
import { SubscribeNagModal } from "~/components/seller/SubscribeNagModal";
import { SellerLayout } from "~/components/layout/dashboard/SellerLayout";
import { useI18n } from "~/i18n";
import { getSellerSubscription } from "~/lib/api/endpoints/seller/subscription.api";
import { getShopStatus } from "~/lib/context/shop-context";

const SellerProtectedLayout: ParentComponent = (props) => {
    const { t } = useI18n();
    const shopStatus = createAsync(() => getShopStatus(), { deferStream: true });
    const subscription = createAsync(() => getSellerSubscription(), { deferStream: true });

    return (
        <SellerLayout>
            <ErrorBoundary
                fallback={(error, reset) => (
                    <InlineErrorFallback error={error} reset={reset} label="seller page" />
                )}
            >
                <Suspense
                    fallback={
                        <div class="flex justify-center py-20">
                            <div
                                class="w-8 h-8 border-2 border-forest-600 border-t-transparent rounded-full animate-spin"
                                role="status"
                                aria-label={t("common.loading")}
                            />
                        </div>
                    }
                >
                    <Show
                        when={shopStatus() !== null}
                        fallback={<Navigate href="/app/seller/setup-shop" />}
                    >
                        <SubscribeNagModal
                            shopStatus={shopStatus()}
                            subscription={subscription()}
                        />
                        {props.children}
                    </Show>
                </Suspense>
            </ErrorBoundary>
        </SellerLayout>
    );
};

export default SellerProtectedLayout;
