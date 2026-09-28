"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import type { Locale } from "@/i18n";
import { t } from "@/i18n/dictionaries";

// DEMO copy (src/i18n/dictionaries.ts) — the brand idea from the brief
// ("More than a meal"). Rewrite with the owner's own story once we have it.

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function Manifesto({ locale = "en" }: { locale?: Locale }) {
  const { lead, body, bodyShort, label, eyebrow } = t(locale).manifesto;
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Colour, not opacity: the dim state (#807262, 4:1 on smoke) still
        // passes contrast for large text, so the paragraph is readable before
        // it lights up.
        gsap.fromTo(
          "[data-word]",
          { color: "#807262" },
          {
            color: "#fbf7ef",
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: "[data-words]", start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="idea" aria-label={label} className="lamp scroll-mt-20 bg-smoke py-20 text-cream sm:py-40">
      <div className="container-x">
        <p className="label text-bamboo">[ {eyebrow} ]</p>
        <p data-words className="mt-8 max-w-6xl font-display text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.08] tracking-[-0.02em]">
          <span className="text-bamboo italic">{lead}</span>{" "}
          {/* Phones get the one-line version; tablets and desktop the full paragraph. */}
          <span className="md:hidden">
            {bodyShort.split(" ").map((word, i) => (
              <span key={i} data-word>
                {word}{" "}
              </span>
            ))}
          </span>
          <span className="hidden md:inline">
            {body.split(" ").map((word, i) => (
              <span key={i} data-word>
                {word}{" "}
              </span>
            ))}
          </span>
        </p>
      </div>
    </section>
  );
}
