import { attractions } from "@/data/attractions";
import { chapters } from "@/data/experience";
import { gallery } from "@/data/gallery";
import { menu } from "@/data/menu";
import type { ArtSpec } from "@/data/types";
import { artFile } from "./art";

// Build-time only (used by scripts/build-art.tsx). Kept apart from ./art so client
// components that need artUrl() don't bundle every data file.

/** Every illustration used anywhere on the site, keyed by file name. */
export function artByFile(): Map<string, ArtSpec> {
  const specs: ArtSpec[] = [
    ...menu.flatMap((c) => c.items.flatMap((item) => (item.visual ? [item.visual.art] : []))),
    ...chapters.map((c) => c.visual.art),
    ...attractions.map((a) => a.visual.art),
    ...gallery.map((g) => g.art),
  ];
  return new Map(specs.map((spec) => [artFile(spec), spec]));
}
