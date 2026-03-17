import { ParentComponent, createMemo } from "solid-js";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { SidebarConfig } from "~/components/layout/dashboard/Sidebar";
import { Squares2x2Icon, ShoppingBagIcon } from "~/components/icons";
import { useI18n } from "~/i18n";
import { useShop } from "~/lib/context/shop-context";

export const SellerLayout: ParentComponent = (props) => {
    const { t } = useI18n();
    const { shop, isLoading } = useShop();

    // Check if shop exists (not null and not undefined)
    const hasShop = () => {
        const currentShop = shop();
        return currentShop !== null && currentShop !== undefined;
    };

    const sidebarConfig = createMemo<SidebarConfig>(() => ({
        mode: "seller",
        brandColor: "terracotta",
        workspaceTitle: t("common.sellerWorkspace"),
        links: !isLoading() && hasShop()
            ? [
                {
                    href: "/app/seller",
                    icon: Squares2x2Icon,
                    label: t("common.dashboard"),
                },
                {
                    href: "/app/seller/shops",
                    icon: ShoppingBagIcon,
                    label: t("common.shops"),
                },
            ]
            : [], // No sidebar links when shop doesn't exist
    }));

    return <DashboardLayout sidebarConfig={sidebarConfig()}>{props.children}</DashboardLayout>;
};
