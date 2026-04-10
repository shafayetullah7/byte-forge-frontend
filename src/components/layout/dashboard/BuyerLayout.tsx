import { ParentComponent, createMemo } from "solid-js";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { SidebarConfig } from "~/components/layout/dashboard/Sidebar";
import { Squares2x2Icon, ShoppingBagIcon, HeartIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

export const BuyerLayout: ParentComponent = (props) => {
    const { t } = useI18n();

    const sidebarConfig = createMemo<SidebarConfig>(() => ({
        mode: "buyer",
        brandColor: "forest",
        workspaceTitle: t("common.dashboard"),
        links: [
            {
                href: "/app",
                icon: Squares2x2Icon,
                label: t("common.dashboard"),
            },
            {
                href: "/app/orders",
                icon: ShoppingBagIcon,
                label: t("buyer.orders.title"),
            },
            {
                href: "/app/favorites",
                icon: HeartIcon,
                label: t("buyer.favorites.title"),
            },
        ],
    }));

    return <DashboardLayout sidebarConfig={sidebarConfig()}>{props.children}</DashboardLayout>;
};
