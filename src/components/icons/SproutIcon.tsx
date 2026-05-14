import { Component } from "solid-js";

export const SproutIcon: Component<{ class?: string }> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class={props.class}>
    <path d="M7 20h10"/>
    <path d="M10 20c5.5-2.5.8-6.4 3-10"/>
    <path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.4-1.2-1-1.6-2.5-1.6-4 0-1.1.5-2.1 1.3-2.8.1-1.6 1.2-3.6 3.2-2.8 1.5.6 2.2 2.2 2 3.8-.4-1.8-2.5-3-4.4-2.1z"/>
    <path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.5 3.5-.1 4.6 1.2 1.3 1.4 1.4 3.5.3 5.1-.4 1.2-1.1 2.3-2 3.1"/>
  </svg>
);
