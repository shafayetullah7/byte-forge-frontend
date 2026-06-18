import { ParentComponent, createMemo } from "solid-js";
import { DashboardLayout } from "~/components/layout/dashboard/DashboardLayout";
import { SidebarConfig } from "~/components/layout/dashboard/Sidebar";
import {
    Squares2x2Icon,
    ShoppingBagIcon,
    CubeIcon,
    ClipboardListIcon,
    ClockIcon,
    BoltIcon,
    MapPinIcon,
} from "~/components/icons";
import { useI18n } from "~/i18n";

export const SellerLayout: ParentComponent = (props) => {
    const { t } = useI18n();

    const sidebarConfig = createMemo<SidebarConfig>(() => ({
        mode: "seller",
        brandColor: "terracotta",
        links: [
            {
                href: "/app/seller",
                icon: Squares2x2Icon,
                label: t("common.dashboard"),
            },
            {
                id: "my-shop",
                href: "/app/seller/my-shop",
                icon: ShoppingBagIcon,
                label: t("seller.myShop"),
                children: [
                    {
                        href: "/app/seller/my-shop",
                        icon: ShoppingBagIcon,
                        label: t("seller.sidebar.shopOverview"),
                    },
                    {
                        href: "/app/seller/verification",
                        icon: BoltIcon,
                        label: t("seller.verification.title"),
                    },
                    {
                        href: "/app/seller/my-shop/history",
                        icon: ClockIcon,
                        label: t("seller.history"),
                    },
                    {
                        href: "/app/seller/shipping-rates",
                        icon: MapPinIcon,
                        label: t("seller.shippingRates.title"),
                    },
                ],
            },
            {
                id: "products",
                href: "/app/seller/products",
                icon: CubeIcon,
                label: t("seller.products.allProducts"),
                children: [
                    {
                        href: "/app/seller/products",
                        icon: CubeIcon,
                        label: t("seller.sidebar.allProducts"),
                    },
                    {
                        href: "/app/seller/products/plants",
                        icon: CubeIcon,
                        label: t("seller.products.types.plants"),
                    },
                    {
                        href: "/app/seller/products/pots",
                        icon: CubeIcon,
                        label: t("seller.products.types.pots"),
                    },
                    {
                        href: "/app/seller/products/seeds",
                        icon: CubeIcon,
                        label: t("seller.products.types.seeds"),
                    },
                    {
                        href: "/app/seller/products/fertilizer",
                        icon: CubeIcon,
                        label: t("seller.products.types.fertilizer"),
                    },
                ],
            },
            {
                href: "/app/seller/orders",
                icon: ClipboardListIcon,
                label: t("seller.orders.title"),
            },
        ],
    }));

    return <DashboardLayout sidebarConfig={sidebarConfig()}>{props.children}</DashboardLayout>;
};
