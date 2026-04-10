import { Component, JSX } from "solid-js";

export const ChevronRightIcon: Component<JSX.SvgSVGAttributes<SVGSVGElement>> = (props) => {
    return (
        <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
            />
        </svg>
    );
};
