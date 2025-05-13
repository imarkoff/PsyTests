import {ImageLoaderProps} from "next/image";

/**
 * Next.js image loader for the images.
 * Fixes an issue when Image won't work because of some route is not included in the next.config.js
 *
 * @example
 * <Image
 *   loader={nextImageLoader}
 *   src={"https://example.com/image.jpg"}
 *   alt={"Image"}
 *   width={500}
 *   height={500}
 * />
 */
export default function nextImageLoader({src, width, quality}: ImageLoaderProps) {
    return `${src}&w=${width}&q=${quality || 75}`;
}