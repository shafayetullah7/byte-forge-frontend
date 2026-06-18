import type { OrderStatusHistoryDetail } from "~/lib/api/types/order.types";
import type { TimelineEvent } from "./OrderTimeline";

export function formatCurrency(amount: string): string {
  return `\u09f3${parseFloat(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatFullDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function formatShortDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatHour(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function buildTimelineFromHistory(
  history: OrderStatusHistoryDetail[],
  getStatusLabel?: (status: string) => string,
): TimelineEvent[] {
  if (history.length === 0) return [];

  return history.map((h, i) => ({
    id: h.id,
    status: h.toStatus,
    title: getStatusLabel
      ? getStatusLabel(h.toStatus)
      : h.toStatus.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    description: h.notes ?? `Order status changed to ${h.toStatus.replace(/_/g, " ").toLowerCase()}`,
    timestamp: h.createdAt,
    isCompleted: i < history.length - 1,
    isCurrent: i === history.length - 1,
    actorLabel: h.actorLabel ?? null,
  }));
}
