import { useParams, Navigate } from "@solidjs/router";

/** Redirect legacy /shops/:slug/products to tabbed products view */
export default function ShopProductsRedirect() {
  const params = useParams();
  return <Navigate href={`/shops/${params.slug}?tab=products`} />;
}
