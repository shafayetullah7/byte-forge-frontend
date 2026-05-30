import { ParentComponent, createMemo } from "solid-js";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { SidebarConfig } from "~/components/layout/dashboard/Sidebar";
import { Squares2x2Icon, MapPinIcon, ShoppingBagIcon, HeartIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

export const BuyerLayout: ParentComponent = (props) => {
    const { t } = useI18n();

    const sidebarConfig = createMemo<SidebarConfig>(() => ({
        mode: "buyer",
        brandColor: "forest",
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
            {
                href: "/app/addresses",
                icon: MapPinIcon,
                label: t("buyer.addresses.title"),
            },
        ],
    }));

    return <DashboardLayout sidebarConfig={sidebarConfig()}>{props.children}</DashboardLayout>;
};
