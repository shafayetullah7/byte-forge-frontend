import { ParentComponent, createMemo } from "solid-js";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { SidebarConfig } from "~/components/layout/dashboard/Sidebar";
import { Squares2x2Icon, ShoppingBagIcon, TagIcon } from "~/components/icons";
import { useI18n } from "~/i18n";

export const SellerLayout: ParentComponent = (props) => {
    const { t } = useI18n();

    // Static sidebar config - doesn't depend on async data
    const sidebarConfig: SidebarConfig = {
        mode: "seller",
        brandColor: "terracotta",
        links: [
            {
                href: "/app/seller/my-shop",
                icon: Squares2x2Icon,
                label: t("common.dashboard"),
            },
            {
                href: "/app/seller/my-shop/edit",
                icon: ShoppingBagIcon,
                label: t("seller.shop.editShop"),
            },
            {
                href: "/app/seller/my-shop/verification",
                icon: TagIcon,
                label: t("seller.verification.title"),
            },
        ],
    };

    return <DashboardLayout sidebarConfig={sidebarConfig}>{props.children}</DashboardLayout>;
};
