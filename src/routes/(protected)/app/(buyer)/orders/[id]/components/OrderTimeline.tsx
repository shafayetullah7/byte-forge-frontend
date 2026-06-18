import { Component, For } from "solid-js";
import { useI18n } from "~/i18n";
import {
  CheckCircleIcon,
  ClockIcon,
  TruckIcon,
  PackageIcon,
  XCircleIcon,
} from "~/components/icons";
import { formatShortDate, formatHour } from "./utils";

export interface TimelineEvent {
  id: string;
  status: string;
  title: string;
  description: string;
  timestamp: string;
  isCompleted: boolean;
  isCurrent?: boolean;
  actorLabel?: string | null;
}

interface OrderTimelineProps {
  events: TimelineEvent[];
  currentStatus: string;
}

const STATUS_ICON_MAP: Record<string, Component<{ class?: string }>> = {
  PENDING_PAYMENT: ClockIcon,
  CONFIRMED: PackageIcon,
  PROCESSING: PackageIcon,
  SHIPPED: TruckIcon,
  DELIVERED: CheckCircleIcon,
  COMPLETED: CheckCircleIcon,
  CANCELLED: XCircleIcon,
  EXPIRED: XCircleIcon,
};

function getStatusColor(status: string, isCompleted: boolean, isCurrent?: boolean): string {
  if (isCurrent) {
    switch (status) {
      case "PENDING_PAYMENT":
      case "CONFIRMED":
        return "bg-sage-400";
      case "PROCESSING":
        return "bg-cream-400";
      case "SHIPPED":
        return "bg-forest-400";
      case "DELIVERED":
      case "COMPLETED":
        return "bg-forest-500";
      case "CANCELLED":
      case "EXPIRED":
        return "bg-terracotta-400";
      default:
        return "bg-gray-400";
    }
  }
  if (isCompleted) {
    return "bg-forest-500";
  }
  return "bg-gray-300 dark:bg-forest-600";
}

function getLineColor(isCompleted: boolean): string {
  return isCompleted
    ? "bg-forest-500"
    : "bg-gray-200 dark:bg-forest-700";
}

export const OrderTimeline: Component<OrderTimelineProps> = (props) => {
  const { t } = useI18n();

  return (
    <div class="bg-white dark:bg-forest-800 rounded-xl border border-gray-200 dark:border-forest-700 shadow-sm">
      <div class="px-6 py-4 border-b border-gray-100 dark:border-forest-700">
        <h3 class="text-base font-semibold text-gray-900 dark:text-white">
          {t("buyer.orders.details.timeline")}
        </h3>
      </div>

      <div class="p-6">
        <For each={props.events}>
          {(event, index) => {
            const IconComponent = STATUS_ICON_MAP[event.status] || ClockIcon;
            const dotColor = getStatusColor(
              event.status,
              event.isCompleted,
              event.isCurrent
            );
            const lineColor = getLineColor(event.isCompleted);
            const isLast = index() === props.events.length - 1;

            return (
              <div class="relative flex gap-4">
                <div class="flex flex-col items-center flex-shrink-0">
                  <div
                    class={`w-8 h-8 rounded-full flex items-center justify-center ${dotColor} ${
                      event.isCurrent ? "ring-4 ring-white dark:ring-forest-800" : ""
                    }`}
                  >
                    <IconComponent class="w-4 h-4 text-white" />
                  </div>
                  {!isLast && (
                    <div class={`w-0.5 h-full min-h-[2rem] ${lineColor} mt-1`} />
                  )}
                </div>

                <div class="pb-6 min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <p class={`text-sm font-semibold ${
                      event.isCurrent
                        ? "text-gray-900 dark:text-white"
                        : event.isCompleted
                        ? "text-gray-700 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                    }`}>
                      {event.title}
                    </p>
                    {event.isCurrent && (
                      <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-forest-100 text-forest-700 dark:bg-forest-900/40 dark:text-forest-300">
                        {t("buyer.orders.details.current")}
                      </span>
                    )}
                    {event.actorLabel && (
                      <span class="text-xs text-gray-400 dark:text-gray-500">
                        · {event.actorLabel}
                      </span>
                    )}
                  </div>
                  <p class={`text-xs mt-0.5 ${
                    event.isCompleted || event.isCurrent
                      ? "text-gray-500 dark:text-gray-400"
                      : "text-gray-400 dark:text-gray-500"
                  }`}>
                    {event.description}
                  </p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    {formatShortDate(event.timestamp)} {formatHour(event.timestamp)}
                  </p>
                </div>
              </div>
            );
          }}
        </For>
      </div>
    </div>
  );
};
