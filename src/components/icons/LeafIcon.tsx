import { Component } from "solid-js";

export const LeafIcon: Component<{ class?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={props.class}>
    <path d="M11 20A7 7 0 0 1 6.9 7c-1.5-1-4-2.5-4-6.5 0 0 3 2 5 4.5"/>
    <path d="M11 20c3.5 0 6.5-2 8-5.5C21 11 21 7 21 7c-3 2-5 4.5-6 6.5"/>
    <path d="M11 20 6.9 7"/>
  </svg>
);
