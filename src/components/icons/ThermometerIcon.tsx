export function ThermometerIcon(props: { class?: string }) {
  return (
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
        d="M12 3v13.5m0 0a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12 3a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 004.5 0v-1.5A2.25 2.25 0 0012 3z"
      />
    </svg>
  );
}
