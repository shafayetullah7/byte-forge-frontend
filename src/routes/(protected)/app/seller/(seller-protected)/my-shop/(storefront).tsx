import { redirect, type RouteDefinition } from "@solidjs/router";
import { getShop } from "~/lib/context/shop-context";

export const route = {
  preload: async () => {
    const shop = await getShop();
    if (shop?.slug) {
      throw redirect(`/shops/${shop.slug}`);
    }
    throw redirect("/app/seller/my-shop");
  },
} satisfies RouteDefinition;

export default function StorefrontRedirect() {
  return null;
}
