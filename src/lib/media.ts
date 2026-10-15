import type { ImageMetadata } from "astro";
import type { Property } from "@/content/types.ts";

const files = import.meta.glob<{ default: ImageMetadata }>("../assets/stills/*.jpg", { eager: true });

const byKey = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, mod]) => [path.split("/").pop()!.replace(/\.jpg$/, ""), mod.default]),
);

export function still(key: string): ImageMetadata {
  const img = byKey.get(key);
  if (!img) throw new Error(`Missing still: ${key}.jpg (run \`pnpm media\`)`);
  return img;
}

export const loopSrc = (p: Pick<Property, "slug">) => `/media/reels/${p.slug}-loop.mp4`;
export const filmSrc = (p: Pick<Property, "slug">) => `/media/reels/${p.slug}-film.mp4`;
