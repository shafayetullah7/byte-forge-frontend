import { Navigate } from "@solidjs/router";

/** Legacy path — product creation is plants-only for now. */
export default function AddProductRedirect() {
  return <Navigate href="/app/seller/products/plants/new" />;
}
