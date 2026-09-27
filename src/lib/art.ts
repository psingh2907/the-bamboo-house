import type { ArtSpec } from "@/data/types";

/**
 * Illustrations are served as static files (/art/<file>.svg, generated at
 * build time by scripts/build-art.tsx) instead of being inlined, so
 * they don't bloat every page's HTML and React payload, and they load lazily
 * like the real photos that will replace them.
 */

/** Stable file name for an illustration, e.g. "plate-1-38-thali.svg". */
export function artFile(spec: ArtSpec): string {
  const parts: (string | number)[] = [spec.kind, spec.seed ?? 1];
  if (spec.kind === "plate") parts.push(spec.hue, spec.thali ? "thali" : "bowl");
  if (spec.kind === "landscape") parts.push(spec.hue, spec.feature ?? "forest");
  return `${parts.join("-")}.svg`;
}

export const artUrl = (spec: ArtSpec) => `/art/${artFile(spec)}`;
