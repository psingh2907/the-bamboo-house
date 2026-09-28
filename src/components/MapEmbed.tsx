"use client";

import { useState } from "react";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";
import { directionsUrl, mapEmbedUrl } from "@/lib/contact";
import { Icon } from "./ui/Icon";
import { TrackedLink } from "./ui/TrackedLink";

/**
 * Map facade: a light "map card" until someone asks for the real map.
 * The Google Maps embed is heavy (several hundred KB, its own cookies) and
 * showed as an empty box while loading on phones; now it loads on tap only.
 */
export function MapEmbed({ locale = "en" }: { locale?: Locale }) {
  const [live, setLive] = useState(false);
  const text = t(locale).visit;

  if (live) {
    return (
      <iframe
        title={text.map}
        src={mapEmbedUrl}
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 size-full border-0 grayscale-[35%] sepia-[20%]"
      />
    );
  }

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden bg-[#e9e1d0] p-6 text-center">
      {/* A hint of a map: faint roads and a river, drawn in CSS/SVG. */}
      <svg aria-hidden="true" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full opacity-70">
        <path d="M-10 210 C 90 180, 160 240, 250 200 S 380 150, 420 170" stroke="#bcd3d6" strokeWidth="14" fill="none" />
        <path d="M-10 90 L 420 130" stroke="#fbf7ef" strokeWidth="10" />
        <path d="M150 -10 L 190 320" stroke="#fbf7ef" strokeWidth="8" />
        <path d="M300 -10 C 280 100, 330 200, 300 320" stroke="#fbf7ef" strokeWidth="6" />
        <path d="M-10 260 L 420 250" stroke="#f4ecdc" strokeWidth="5" />
      </svg>
      <span className="relative flex size-14 items-center justify-center rounded-full bg-clay text-cream shadow-lg ring-8 ring-clay/20">
        <Icon name="pin" className="size-7" />
      </span>
      <div className="relative flex flex-col gap-2.5 sm:flex-row">
        <button
          type="button"
          onClick={() => setLive(true)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-smoke px-6 text-sm font-semibold text-cream transition hover:bg-clay-deep active:scale-[0.98]"
        >
          {text.showMap}
        </button>
        <TrackedLink
          href={directionsUrl}
          external
          track={{ event: "directions_click", params: { location: "map_card" } }}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cream px-6 text-sm font-semibold text-ink ring-1 ring-ink/15 transition hover:ring-ink/40"
        >
          <Icon name="external" className="size-4" />
          {text.openMaps}
        </TrackedLink>
      </div>
    </div>
  );
}
