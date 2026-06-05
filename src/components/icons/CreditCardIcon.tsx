import type { Component } from "solid-js";

export const CreditCardIcon: Component<{ class?: string }> = (props) => (
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
      d="M2.25 8.25h19.5M2.25 9h19.5m-20.25.09c.81-.09 1.63-.16 2.46-.16h15.24c.83 0 1.65.07 2.46.16M4.5 15.75h15m-15 0v-3.75c0-.62.5-1.12 1.12-1.12h12.75c.62 0 1.12.5 1.12 1.12v3.75m-15 0v3.75c0 .62.5 1.12 1.12 1.12h12.75c.62 0 1.12-.5 1.12-1.12v-3.75"
    />
  </svg>
);
