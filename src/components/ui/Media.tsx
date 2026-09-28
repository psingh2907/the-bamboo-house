import Image from "next/image";
import { siteConfig } from "@/config/site";
import type { Visual } from "@/data/types";
import { type Locale, pick } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { artUrl } from "@/lib/art";
import { cn } from "@/lib/cn";

interface MediaProps {
  visual: Visual;
  /** `sizes` for the responsive image, e.g. "(min-width: 1024px) 50vw, 100vw". */
  sizes: string;
  className?: string;
  priority?: boolean;
  /** Shows the "photo to come" chip in prototype mode. */
  showLabel?: boolean;
  locale?: Locale;
}

/**
 * One image slot. Renders the real photo when it exists, otherwise the
 * illustrated stand-in (a static SVG file). Always fills its (positioned) parent.
 */
export function Media({ visual, sizes, className, priority, showLabel = true, locale = "en" }: MediaProps) {
  const { photo, art, shot } = visual;
  const alt = pick(locale, visual.alt, visual.altHi);
  const text = t(locale).media;
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {photo ? (
        <Image src={photo.src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
      ) : (
        // Prerendered static SVG (see src/lib/art.ts), lazy-loaded like a photo.
        <Image src={artUrl(art)} alt={alt} fill unoptimized sizes={sizes} priority={priority} className="object-cover" />
      )}
      {!photo && showLabel && siteConfig.prototypeMode && (
        <span
          title={`${text.shot}: ${shot}`}
          className="label pointer-events-none absolute bottom-2.5 left-2.5 rounded-full bg-smoke/70 px-2.5 py-1 text-[0.68rem] tracking-[0.12em] text-bamboo-light backdrop-blur-sm"
        >
          {text.placeholder}
        </span>
      )}
    </div>
  );
}
