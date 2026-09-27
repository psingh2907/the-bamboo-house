"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

// DEMO copy — the brand idea from the brief ("More than a meal"). Rewrite
// with the owner's own story once we have it.
const lead = "More than a meal.";
const body =
  "Bamboo walls that glow at dusk. A thali that arrives still steaming. A table long enough for the whole family — and a reason to stop on your way through Panna.";

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.16 },
          {
            opacity: 1,
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
    <section ref={root} aria-label="Our idea" className="bg-smoke py-28 text-cream sm:py-40">
      <div className="container-x">
        <p className="label text-bamboo">[ 01 — The idea ]</p>
        <p data-words className="mt-8 max-w-6xl font-display text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.08] tracking-[-0.02em]">
          <span className="text-bamboo italic">{lead}</span>{" "}
          {body.split(" ").map((word, i) => (
            <span key={i} data-word>
              {word}{" "}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
