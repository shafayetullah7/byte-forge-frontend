export function ScissorsIcon(props: { class?: string }) {
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
        d="M7.843 7.843c.342-.342.844-.518 1.35-.518h.054a1.875 1.875 0 011.35.518m4.286 4.286a3.375 3.375 0 00-4.782-4.782M12 12.75h.008v.008H12v-.008zm-4.5 4.5a3.375 3.375 0 004.782-4.782m-4.782 4.782c.342.342.844.518 1.35.518h.054a1.875 1.875 0 001.35-.518m-2.856-6.632a3.375 3.375 0 014.782-4.782m-4.782 4.782c-.342-.342-.518-.844-.518-1.35v-.054a1.875 1.875 0 01.518-1.35m6.632 2.856a3.375 3.375 0 01-4.782 4.782m4.782-4.782c.342.342.518.844.518 1.35v.054a1.875 1.875 0 01-.518 1.35"
      />
      <circle cx="8.25" cy="8.25" r="1.5" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="15.75" cy="15.75" r="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}
