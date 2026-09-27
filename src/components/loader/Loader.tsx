"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { business } from "@/data/business";
import { INTRO_DONE_EVENT, INTRO_STORAGE_KEY } from "@/lib/intro";

const SEGMENTS = 10;
const MIN_MS = 1300; // long enough to read as intentional
const MAX_MS = 2600; // never hold a slow connection hostage
const BLINDS = 5;

const labels: [number, string][] = [
  [0, "Lighting the lamps"],
  [0.4, "Warming the tandoor"],
  [0.75, "Setting your table"],
];

/**
 * First-visit loader: a bamboo stalk grows one segment per 10% while the
 * counter runs to 100, a leaf unfurls, then bamboo chik blinds roll up to
 * reveal the page. Progress tracks real work (fonts, page load), clamped
 * between MIN_MS and MAX_MS.
 */
export function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const html = document.documentElement;
    const el = root.current;
    if (!el || !html.classList.contains("is-loading")) return;

    // Hand the page back without any reveal (Lenis waits for this event).
    const skip = () => {
      html.classList.remove("is-loading", "loader-revealing");
      try {
        sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
      } catch {
        // Private mode: nothing to remember.
      }
      window.dispatchEvent(new Event(INTRO_DONE_EVENT));
    };

    // Opened in a background tab: nobody would see it, and animation frames
    // are paused there, so skip it entirely.
    if (document.hidden) {
      skip();
      return;
    }

    const segments = [...el.querySelectorAll<SVGGElement>("[data-segment]")];
    const leaf = el.querySelector<SVGGElement>("[data-leaf]");
    const start = performance.now();
    let real = 0.35; // the app has hydrated
    let shown = 0;
    let frame = 0;

    document.fonts?.ready.then(() => (real = Math.max(real, 0.75)));
    const onLoad = () => (real = 1);
    if (document.readyState === "complete") document.fonts?.ready.then(onLoad);
    else window.addEventListener("load", onLoad, { once: true });

    const render = (p: number) => {
      segments.forEach((seg, i) => (seg.style.transform = `scaleY(${gsap.utils.clamp(0, 1, p * SEGMENTS - i)})`));
      if (counter.current) counter.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      const text = labels.filter(([at]) => p >= at).at(-1)?.[1];
      if (label.current && text && label.current.textContent !== text) label.current.textContent = text;
    };

    const reveal = () => {
      const tl = gsap.timeline({
        onComplete: () => {
          html.classList.remove("loader-revealing");
          window.dispatchEvent(new Event(INTRO_DONE_EVENT));
        },
      });
      if (leaf) leaf.style.transform = "scale(1) rotate(0deg)";
      tl.to("[data-stage]", { autoAlpha: 0, y: -24, duration: 0.45, ease: "power2.in" }, 0.75)
        .add(() => {
          // Hand over to the page: its intro animations start as the blinds lift.
          html.classList.add("loader-revealing");
          html.classList.remove("is-loading");
          try {
            sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
          } catch {
            // Private mode: the loader simply shows again next visit.
          }
        }, 1.05)
        .to("[data-blind]", { yPercent: -100, duration: 1.1, ease: "power3.inOut", stagger: { each: 0.08, from: "center" } }, 1.05);
    };

    const tick = (now: number) => {
      // The <head> failsafe already took the loader down (e.g. the tab was
      // hidden and frames paused): don't bring the blinds back over the page.
      if (!html.classList.contains("is-loading")) {
        skip();
        return;
      }
      const elapsed = now - start;
      const target = elapsed >= MAX_MS ? 1 : Math.min(real, elapsed / MIN_MS);
      shown += (target - shown) * 0.12;
      if (target === 1 && shown > 0.995) shown = 1;
      render(shown);
      if (shown >= 1) reveal();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      // Only stop the loop: in dev Strict Mode the effect runs again and must
      // find the loader still marked as running. The head script's 6 s
      // failsafe covers anything that never finishes.
      cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div ref={root} id="loader" aria-hidden="true" className="fixed inset-0 z-[100] overflow-hidden">
      {/* Chik blinds: opaque rows of thin bamboo sticks, tied with cord. */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: BLINDS }, (_, i) => (
          <div key={i} data-blind className="chik relative h-full flex-1">
            <span className="absolute inset-y-0 left-1/4 w-px bg-smoke/60" />
            <span className="absolute inset-y-0 right-1/4 w-px bg-smoke/60" />
            <span className="absolute inset-x-0 bottom-0 h-3.5 rounded-full bg-gradient-to-b from-bamboo-light via-bamboo to-bamboo-deep shadow-[0_6px_14px_rgba(0,0,0,0.5)]" />
          </div>
        ))}
      </div>

      <div data-stage className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_50%_45%,rgba(22,17,12,0.92),rgba(22,17,12,0.55))]">
        {/* The growing stalk */}
        <svg viewBox="0 0 80 460" className="absolute bottom-0 left-1/2 h-[80svh] -translate-x-1/2 overflow-visible">
          <defs>
            <linearGradient id="loader-culm" x1="0" x2="1">
              <stop offset="0" stopColor="#6b4520" />
              <stop offset="0.4" stopColor="#e2b46a" />
              <stop offset="0.65" stopColor="#c99a55" />
              <stop offset="1" stopColor="#5e3c1b" />
            </linearGradient>
          </defs>
          {Array.from({ length: SEGMENTS }, (_, i) => {
            const y = 460 - (i + 1) * 44;
            return (
              <g key={i} data-segment style={{ transformBox: "fill-box", transformOrigin: "50% 100%", transform: "scaleY(0)" }}>
                <rect x="28" y={y + 3} width="24" height="41" rx="3" fill="url(#loader-culm)" />
                <rect x="25" y={y} width="30" height="5" rx="2.5" fill="#8c6630" />
                <rect x="25" y={y + 5} width="30" height="1.2" fill="#f0cf8f" opacity="0.5" />
              </g>
            );
          })}
          <g
            data-leaf
            style={{
              transformBox: "fill-box",
              transformOrigin: "0% 90%",
              transform: "scale(0) rotate(-50deg)",
              transition: "transform 0.6s cubic-bezier(0.34, 1.8, 0.64, 1)",
            }}
          >
            <path d="M44 20 C 60 4, 88 -2, 112 4 C 90 12, 66 22, 44 20 Z" fill="#6f8a3e" />
            <path d="M44 20 C 70 10, 92 6, 110 5" stroke="#4b5b36" strokeWidth="1.2" fill="none" />
          </g>
        </svg>

        <div className="container-x absolute inset-x-0 bottom-0 flex items-end justify-between pb-8 text-cream sm:pb-12">
          <div>
            <span ref={label} className="label block text-bamboo">
              Lighting the lamps
            </span>
            <span className="mt-2 flex items-start font-display leading-[0.8] tracking-[-0.05em]">
              <span ref={counter} className="text-[clamp(5rem,18vw,11rem)] tabular-nums">
                000
              </span>
              <span className="mt-2 text-2xl text-clay">%</span>
            </span>
          </div>
          <p className="label hidden text-right text-mist sm:block">
            {business.name}
            <br />
            {business.address.area} · {business.address.district}
          </p>
        </div>
      </div>
    </div>
  );
}
