export interface ColorSwatchProps {
  color: string;
  hex: string;
  textLight?: boolean;
}

export default function ColorSwatch(props: ColorSwatchProps) {
  return (
    <div
      class="p-6 rounded-xl border-8 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
      style={{ "background-color": props.hex }}
    >
      <div
        class={`text-sm font-semibold font-mono mb-1 ${
          props.textLight ? "text-white" : "text-gray-800"
        }`}
      >
        {props.color}
      </div>
      <div
        class={`text-xs font-mono ${
          props.textLight ? "text-gray-200" : "text-gray-600"
        }`}
      >
        {props.hex}
      </div>
    </div>
  );
}
