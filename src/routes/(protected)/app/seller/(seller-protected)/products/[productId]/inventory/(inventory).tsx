import { useParams, type RouteDefinition } from "@solidjs/router";
import { ProductInventoryPanel } from "../../components/ProductInventoryPanel";

export const route = {
  preload: () => {},
} satisfies RouteDefinition;

export default function ProductInventoryRoute() {
  const params = useParams();
  return <ProductInventoryPanel productId={params.productId as string} />;
}
