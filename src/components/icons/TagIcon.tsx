import type { Component } from "solid-js";

interface IconProps {
    class?: string;
    className?: string;
}

export const TagIcon: Component<IconProps> = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class={props.class || props.className || "w-6 h-6"}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.892 2.693.47a2.501 2.501 0 001.037-.927c.365-.62.384-1.391.07-2.016l-9.475-9.475A2.25 2.25 0 009.568 3z"
            />
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 6h.008v.008H6V6z"
            />
        </svg>
    );
};
