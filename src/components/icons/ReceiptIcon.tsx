import { Component } from "solid-js";

export const ReceiptIcon: Component<{ class?: string }> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class={props.class}
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9 14.25 6.75 16.5 3 12.75m0 0 3-3.75M3 12.75l3 3.75M3 12.75l3-3.75m9 0 2.25 2.25 3-3.75m-3 3.75 3-3.75M12 9V3.75m0 5.25V15m0 0 3 3m-3-3-3 3"
    />
  </svg>
);
