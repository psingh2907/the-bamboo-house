/**
 * Renders every illustration the site uses to public/art/<file>.svg.
 * Runs automatically before `pnpm dev` and `pnpm build`.
 *
 * Why files instead of inline SVG: inlined, the illustrations were ~70% of
 * the home page's HTML and were repeated in React's payload. As files they
 * are cached, lazy-loaded and behave exactly like the photos that will
 * replace them.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { Artwork } from "../src/components/ui/Artwork";
import { artByFile } from "../src/lib/art-registry";

const outDir = join(process.cwd(), "public", "art");
mkdirSync(outDir, { recursive: true });

// Remove illustrations that are no longer referenced.
const specs = artByFile();
for (const file of readdirSync(outDir)) {
  if (!specs.has(file)) rmSync(join(outDir, file));
}

let bytes = 0;
for (const [file, spec] of specs) {
  const svg = renderToStaticMarkup(<Artwork spec={spec} label="" standalone />)
    // Two decimals is plenty at this size and roughly halves the file.
    .replace(/(\.\d{2})\d+/g, "$1");
  writeFileSync(join(outDir, file), svg);
  bytes += svg.length;
}

console.log(`art: ${specs.size} illustrations → public/art (${Math.round(bytes / 1024)} KB)`);
