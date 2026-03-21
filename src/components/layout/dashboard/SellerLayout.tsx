import { ParentComponent, createMemo } from "solid-js";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { SidebarConfig } from "~/components/layout/dashboard/Sidebar";
import { Squares2x2Icon, ShoppingBagIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

export const SellerLayout: ParentComponent = (props) => {
    const { t } = useI18n();

    // Static sidebar config - doesn't depend on async data
    const sidebarConfig: SidebarConfig = {
        mode: "seller",
        brandColor: "terracotta",
        workspaceTitle: t("common.sellerWorkspace"),
        links: [
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
        ],
    };

    return <DashboardLayout sidebarConfig={sidebarConfig}>{props.children}</DashboardLayout>;
};
