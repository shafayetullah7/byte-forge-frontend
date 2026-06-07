import { Component } from "solid-js";

export const FlagIcon: Component<{ class?: string }> = (props) => (
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
      d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-12.499 48.524 48.524 0 0 1 3.114-.732 9 9 0 0 1-6.086-.71l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V3"
    />
  </svg>
);
