import type { Component } from "solid-js";
import type { PublicShopTrustMetrics } from "~/lib/types/public/shops.types";
import { KpiCard } from "./KpiCard";

/** Phase 1: only show metrics backed by real API aggregates. */
export const ShopTrustSnapshot: Component<{
  metrics: PublicShopTrustMetrics;
  labels: Record<string, string>;
}> = (props) => {
  const m = () => props.metrics;
  const l = () => props.labels;
  const yearsActive = () => {
    const since = new Date(m().memberSince);
    const years = Math.max(
      1,
      Math.floor(
        (Date.now() - since.getTime()) / (365.25 * 24 * 60 * 60 * 1000),
      ),
    );
    return years;
  };

  return (
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      <KpiCard label={l().products} value={m().totalProducts} />
      <KpiCard label={l().orders} value={(m().completedOrders ?? 0).toLocaleString()} />
      <KpiCard label={l().rating} value={(m().averageRating ?? 0).toFixed(1)} suffix="/ 5" />
      <KpiCard label={l().reviews} value={(m().reviewCount ?? 0).toLocaleString()} />
      <KpiCard label={l().shopAge} value={yearsActive()} suffix={l().years} />
    </div>
  );
};
