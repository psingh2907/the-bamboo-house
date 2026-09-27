"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import { useRef } from "react";
import { business } from "@/data/business";
import { menu } from "@/data/menu";
import { directionsUrl } from "@/lib/contact";
import { Artwork } from "../ui/Artwork";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { OpenStatus } from "../ui/OpenStatus";

// The hero object: the house thali, top-down. Swaps to the real photo
// (a cut-out, top-down shot) once it is added to the menu data.
const thali = menu.flatMap((c) => c.items).find((item) => item.visual?.art.kind === "plate" && item.visual.art.thali)!
  .visual!;

/** Blueprint guides around the plate — drawn in on load (Oryzo-style construction lines). */
function Guides() {
  const handle = (x: number, y: number, horizontal: boolean, delay: number) => (
    <g style={{ animationDelay: `${delay}s` }} className="intro-fade">
      <line
        x1={horizontal ? x - 34 : x}
        y1={horizontal ? y : y - 34}
        x2={horizontal ? x + 34 : x}
        y2={horizontal ? y : y + 34}
        stroke="var(--color-clay)"
        strokeWidth="0.8"
      />
      <rect x={(horizontal ? x - 34 : x) - 2} y={(horizontal ? y : y - 34) - 2} width="4" height="4" fill="var(--color-clay)" />
      <rect x={(horizontal ? x + 34 : x) - 2} y={(horizontal ? y : y + 34) - 2} width="4" height="4" fill="var(--color-clay)" />
      <circle cx={x} cy={y} r="2.6" fill="var(--color-smoke)" stroke="var(--color-clay)" strokeWidth="0.8" />
    </g>
  );
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true" className="absolute inset-0 size-full overflow-visible">
      <g stroke="var(--color-bamboo)" strokeWidth="0.4" fill="none" opacity="0.45">
        <line x1="-400" y1="150" x2="700" y2="150" pathLength={1} className="draw" />
        <line x1="150" y1="-400" x2="150" y2="700" pathLength={1} className="draw" style={{ animationDelay: "0.15s" }} />
        <line x1="-400" y1="50" x2="700" y2="50" pathLength={1} className="draw" style={{ animationDelay: "0.3s" }} opacity="0.5" />
        <line x1="-400" y1="250" x2="700" y2="250" pathLength={1} className="draw" style={{ animationDelay: "0.35s" }} opacity="0.5" />
      </g>
      <circle cx="150" cy="150" r="100" fill="none" stroke="var(--color-bamboo-light)" strokeWidth="0.6" strokeDasharray="2 3" opacity="0.7" className="intro-fade" style={{ animationDelay: "0.4s" }} />
      <circle cx="150" cy="150" r="56" fill="none" stroke="var(--color-bamboo-light)" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.45" className="intro-fade" style={{ animationDelay: "0.5s" }} />
      {handle(150, 50, true, 0.7)}
      {handle(150, 250, true, 0.78)}
      {handle(50, 150, false, 0.86)}
      {handle(250, 150, false, 0.94)}
    </svg>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);

  // As the hero scrolls away the plate turns and settles, and the copy lifts off.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 };
      // Desktop: the hero is exactly one screen, so everything can lift away together.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 1024px)", () => {
        gsap
          .timeline({ scrollTrigger: scrub })
          .to("[data-hero-plate]", { rotate: 50, scale: 0.78, ease: "none" }, 0)
          .to("[data-hero-guides]", { scale: 1.25, opacity: 0, ease: "none" }, 0)
          .to("[data-hero-copy]", { y: -80, opacity: 0, ease: "none" }, 0);
      });
      // Phones: the hero is taller than the screen, so only the plate turns — the
      // buttons stay fully readable.
      mm.add("(prefers-reduced-motion: no-preference) and (max-width: 1023px)", () => {
        gsap.to("[data-hero-plate]", { rotate: 40, ease: "none", scrollTrigger: scrub });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[640px] flex-col overflow-hidden bg-smoke text-cream lg:h-svh lg:min-h-[720px]"
    >
      {/* Warm light from above, like the dining room at night. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_50%_42%,rgba(214,150,70,0.22),transparent_70%)]"
      />

      <div className="container-x relative flex flex-1 flex-col pt-32 pb-10 lg:pt-32 lg:pb-12">
        <p data-hero-copy className="label intro-line text-center text-bamboo" style={{ animationDelay: "0.1s" }}>
          [ {business.category} · {business.address.area}, {business.address.district} ]
        </p>

        {/* Plate + headline. On large screens the headline sits either side of the plate. */}
        <div className="relative flex flex-1 flex-col items-center justify-center py-8 lg:py-0">
          <h1
            id="hero-title"
            data-hero-copy
            className="relative z-10 text-center font-display text-[clamp(2.9rem,11vw,4.5rem)] leading-[0.95] font-medium tracking-[-0.025em] lg:absolute lg:inset-x-0 lg:top-1/2 lg:flex lg:-translate-y-1/2 lg:justify-between lg:text-[clamp(3.5rem,5.6vw,6.2rem)]"
          >
            <span className="intro-line block lg:max-w-[26vw] lg:text-left" style={{ animationDelay: "0.25s" }}>
              Come hungry.
            </span>
            <span className="intro-line block text-bamboo italic lg:max-w-[26vw] lg:text-right" style={{ animationDelay: "0.4s" }}>
              Leave with a memory.
            </span>
          </h1>

          <div className="relative mt-8 aspect-square w-[min(78vw,44svh)] lg:mt-0 lg:w-[min(60svh,36vw)]">
            <div data-hero-guides className="absolute -inset-[25%]">
              <Guides />
            </div>
            <div
              data-hero-plate
              className="plate-in relative size-full overflow-hidden rounded-full shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]"
            >
              {thali.photo ? (
                <Image src={thali.photo.src} alt={thali.alt} fill priority sizes="(min-width: 1024px) 36vw, 78vw" className="object-cover" />
              ) : (
                <Artwork spec={thali.art} label={thali.alt} viewBox="18 68 364 364" className="size-full" />
              )}
            </div>
          </div>
        </div>

        <div data-hero-copy className="intro-line grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end" style={{ animationDelay: "0.7s" }}>
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:text-left">
            <p className="text-base leading-relaxed text-mist">
              A family restaurant wrapped in bamboo, in {business.address.area} near {business.address.locality}, Panna.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
              <Button href="/menu" icon="book">
                Explore the menu
              </Button>
              <Button
                href={directionsUrl}
                external
                variant="outline"
                icon="pin"
                track={{ event: "directions_click", params: { location: "hero" } }}
              >
                Find us
              </Button>
            </div>
          </div>

          <dl className="grid grid-cols-3 divide-x divide-smoke-line border-y border-smoke-line text-center lg:min-w-[30rem] lg:text-left">
            <div className="px-3 py-4 lg:px-5">
              <dt className="label text-[0.6rem] text-mist">Google</dt>
              <dd className="mt-1 flex items-center justify-center gap-1.5 font-display text-xl sm:text-2xl lg:justify-start">
                {business.rating.value}
                <Icon name="star" className="size-4 fill-bamboo text-bamboo" />
              </dd>
            </div>
            <div className="px-3 py-4 lg:px-5">
              <dt className="label text-[0.6rem] text-mist">Per person</dt>
              <dd className="mt-1 font-display text-xl whitespace-nowrap sm:text-2xl">
                ₹{business.priceRange.min}–{business.priceRange.max}
              </dd>
            </div>
            <div className="px-3 py-4 lg:px-5">
              <dt className="label text-[0.6rem] text-mist">Today</dt>
              <dd className="mt-2 text-xs leading-snug text-cream/90">
                <OpenStatus />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
