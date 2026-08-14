import { Show, splitProps } from "solid-js";
import type { Component, JSX } from "solid-js";
import {
  cloudinaryBlurPlaceholder,
  cloudinarySizes,
  cloudinarySrcSet,
  cloudinaryUrl,
  type CloudinaryPreset,
} from "./cloudinary-url";

export type CloudinaryImageProps = {
  url: string | null | undefined;
  preset: CloudinaryPreset;
  alt: string;
  responsive?: boolean;
  placeholder?: boolean;
  class?: string;
  imgClass?: string;
} & Pick<
  JSX.ImgHTMLAttributes<HTMLImageElement>,
  "loading" | "fetchpriority" | "decoding" | "onError"
>;

export const CloudinaryImage: Component<CloudinaryImageProps> = (props) => {
  const [local, imgProps] = splitProps(props, [
    "url",
    "preset",
    "alt",
    "responsive",
    "placeholder",
    "class",
    "imgClass",
  ]);

  const src = () => cloudinaryUrl(local.url, local.preset);
  const srcSet = () =>
    local.responsive ? cloudinarySrcSet(local.url, local.preset) : undefined;
  const sizes = () =>
    local.responsive ? cloudinarySizes(local.preset) : undefined;
  const blur = () =>
    local.placeholder ? cloudinaryBlurPlaceholder(local.url) : "";

  return (
    <Show when={src()}>
      <div class={local.class ?? "relative w-full h-full overflow-hidden"}>
        <Show when={blur()}>
          <img
            src={blur()}
            alt=""
            aria-hidden="true"
            class={`absolute inset-0 h-full w-full object-cover scale-105 blur-xl ${local.imgClass ?? ""}`}
          />
        </Show>
        <img
          {...imgProps}
          src={src()}
          srcset={srcSet()}
          sizes={sizes()}
          alt={local.alt}
          class={`relative h-full w-full object-cover ${local.imgClass ?? ""}`}
        />
      </div>
    </Show>
  );
};
