import { Navigate } from "@solidjs/router";

/** Single-shop model: legacy route redirects to My Shop. */
export default function ShopsPage() {
  return <Navigate href="/app/seller/my-shop" />;
}
