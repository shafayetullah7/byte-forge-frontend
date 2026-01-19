import { ParentComponent } from "solid-js";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { SidebarConfig } from "~/components/layout/dashboard/Sidebar";
import { Squares2x2Icon, ShoppingBagIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

export const BuyerLayout: ParentComponent = (props) => {
    const { t } = useI18n();

    const sidebarConfig: SidebarConfig = {
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
                icon: ShoppingBagIcon,
                label: "Favorites",
            },
        ],
    };

    return <DashboardLayout sidebarConfig={sidebarConfig}>{props.children}</DashboardLayout>;
};
